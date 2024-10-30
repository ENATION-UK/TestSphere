<template>
  <div class="login" :class="{ modal }">
    <auth-form-view v-show="!showGithubConnectView">
      <template #header>
        <div v-if="inviteStore.shareData?.companyName" class="invite-view">
          <div class="invite-name">
            <n-ellipsis style="max-width: 80px">{{ inviteStore.shareData?.userName }}</n-ellipsis>
            {{ $t('auth.invite_u_join_company') }}
          </div>
          <div class="company-name">
            <n-ellipsis style="max-width: 260px">
              {{ inviteStore.shareData?.companyName }}
            </n-ellipsis>
          </div>
          <n-divider dashed />
        </div>
      </template>
      <wechat-qrcode-login-view v-if="loginStore.tabActive === 'login-wechat'" />
      <div v-else class="form-login-view">
        <div v-if="showGGAuthLogin" class="login-btn-box">
          <div v-if="IBConfig.GOOGLE_CLIENT_ID" id="google-login-btn" class="google-login-btn" />
          <div v-if="IBConfig.GITHUB_CLIENT_ID && !modal" class="github-login-btn">
            <n-button size="large" tag="a" :href="githubLoginLink">
              <template #icon>
                <n-icon :component="LogoGithub" />
              </template>
              Github
            </n-button>
          </div>
        </div>
        <div v-if="showWechatLogin" class="wechat-login">
          <n-button type="default" tertiary class="wechat-btn" @click="loginStore.tabActive = 'login-wechat'">
            <n-icon class="logo-wechat">
              <logo-wechat />
            </n-icon>
            {{ $t('auth.wechat_login') }}
          </n-button>
        </div>
        <n-divider v-if="showWechatLogin">{{ $t('auth.or') }}</n-divider>
        <n-tabs v-model:value="loginStore.tabActive" animated class="form-view">
          <!--短信登录-->
          <n-tab-pane v-if="IBConfig.APP_CHINA" name="login-sms">
            <login-sms-tab />
          </n-tab-pane>
          <!--密码登录-->
          <n-tab-pane name="login-password">
            <login-pass-tab />
          </n-tab-pane>
          <!--短信注册-->
          <n-tab-pane v-if="IBConfig.APP_CHINA" name="register-sms">
            <register-sms-tab />
          </n-tab-pane>
          <!--邮箱注册-->
          <n-tab-pane name="register-email">
            <register-email-tab />
          </n-tab-pane>
          <!--忘记密码-->
          <n-tab-pane name="forgot-password">
            <forgot-password-tab />
          </n-tab-pane>
          <!--绑定手机-->
          <n-tab-pane name="bind-mobile">
            <bind-mobile-tab />
          </n-tab-pane>
        </n-tabs>
      </div>
    </auth-form-view>
    <GithubConnectView v-if="showGithubConnectView" />
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LogoGithub from '@vicons/ionicons5/LogoGithub'
import LogoWechat from '@vicons/ionicons5/LogoWechat'
import { DialogReactive } from 'naive-ui'
import { IBConfig } from '@/config'
import { useUserStore } from '@/store'
import { useInviteStore } from '@/store/workbench'
import { useGoogleAuth } from '@/hooks'
import AuthFormView from './AuthFormView.vue'
import BindMobileTab from './BindMobileTab.vue'
import ForgotPasswordTab from './ForgotPasswordTab.vue'
import GithubConnectView from './GithubConnectView.vue'
import LoginPassTab from './LoginPassTab.vue'
import LoginSmsTab from './LoginSmsTab.vue'
import RegisterEmailTab from './RegisterEmailTab.vue'
import RegisterSmsTab from './RegisterSmsTab.vue'
import { useLoginStore } from './useLoginStore'
import WechatQrcodeLoginView from './WechatQrcodeLoginView.vue'

const props = defineProps<{
  modal?: boolean
  dialog?: DialogReactive
  callback?: () => Promise<void>
}>()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loginStore = useLoginStore()
const inviteStore = useInviteStore()
if (!IBConfig.APP_CHINA) {
  useGoogleAuth(loginStore.handleLoginSuccess)
}
loginStore.tabActive = !IBConfig.APP_CHINA ? 'login-password' : 'login-wechat'
const showWechatLogin = computed(() => {
  if (!IBConfig.APP_CHINA) return false
  if (loginStore.registerStep === 2) return false
  return !['bind-mobile', 'forgot-password'].includes(loginStore.tabActive)
})
const showGGAuthLogin = computed(() => {
  if (IBConfig.APP_CHINA) return false
  if (!IBConfig.GOOGLE_CLIENT_ID && !IBConfig.GITHUB_CLIENT_ID) return false
  if (loginStore.registerStep === 2) return false
  return !['bind-mobile', 'forgot-password'].includes(loginStore.tabActive)
})
const githubLoginLink = computed(() => {
  return `https://github.com/login/oauth/authorize?client_id=${IBConfig.GITHUB_CLIENT_ID}`
})
const showGithubConnectView = computed(() => {
  if (IBConfig.APP_CHINA || props.modal) return false
  const { redirect_type, code } = route.query
  return !!(redirect_type === 'github' && code)
})
watch(
  () => userStore.isLogin,
  async (newVal) => {
    if (!newVal) return
    if (props.modal) {
      if (props.callback) await props.callback()
      props.dialog?.destroy()
      return
    }
    const { redirect } = route.query
    if (redirect) {
      router.push(redirect as string)
    } else {
      router.push('/')
    }
  },
  { immediate: true }
)
onUnmounted(() => {
  loginStore.$dispose()
})
</script>

<style src="./login.scss" scoped lang="scss"></style>
<style lang="scss">
.login-modal {
  .n-dialog__content {
    margin: 0;
  }
}
</style>
