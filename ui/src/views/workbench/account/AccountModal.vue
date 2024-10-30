<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    :close-on-esc="false"
    :show-icon="false"
    :auto-focus="false"
    transform-origin="center"
    preset="dialog"
    style="width: 420px; margin-top: 100px; padding: 0; border-radius: 10px"
  >
    <div class="account-modal">
      <div class="title">
        <h5 class="text">{{ $t('wb.account_info') }}</h5>
      </div>
      <div class="body">
        <div class="body-item info">
          <IbUserFace class="face" />
          <div class="name-box">
            <n-ellipsis style="max-width: 220px">{{ user.nickname }}</n-ellipsis>
          </div>
        </div>
        <!--姓名-->
        <div class="body-item">
          <p class="item-title">{{ $t('wb.name') }}</p>
          <p class="item-desc">{{ user.nickname }}</p>
          <span class="opt-btn" @click="handleEditName">{{ $t('wb.edit') }}</span>
        </div>
        <!--手机号-->
        <div v-if="IBConfig.APP_CHINA" class="body-item">
          <p class="item-title">{{ $t('wb.bind_mobile') }}</p>
          <p v-if="user.mobile" class="item-desc">{{ DataAnonymization.mobile(user.mobile) }}</p>
          <p v-else class="item-desc bind-tip">
            <n-icon :component="IconWarning" />
            {{ $t('wb.mobile_not_bind') }}
          </p>
          <span class="opt-btn" @click="handleBindMobile">{{ user.mobile ? $t('wb.change') : $t('wb.bind') }}</span>
        </div>
        <!--邮箱-->
        <div class="body-item">
          <p class="item-title">{{ $t('wb.bind_email') }}</p>
          <p v-if="user.email" class="item-desc">{{ user.email }}</p>
          <p v-else class="item-desc bind-tip">
            <n-icon :component="IconWarning" />
            {{ $t('wb.email_not_bind') }}
          </p>
          <span class="opt-btn" @click="handleBindEmail">{{ user.email ? $t('wb.change') : $t('wb.bind') }}</span>
        </div>
        <!--微信-->
        <div v-if="IBConfig.APP_CHINA" class="body-item">
          <p class="item-title">{{ $t('wb.bind_wechat') }}</p>
          <p v-if="user.wxUnionId" class="item-desc">{{ $t('wb.has_bind') }}</p>
          <p v-else class="item-desc bind-tip">
            <n-icon :component="IconWarning" />
            {{ $t('wb.wechat_not_bind') }}
          </p>
          <span v-if="!user.wxUnionId" class="opt-btn" @click="handleBindWechat">{{ $t('wb.bind') }}</span>
        </div>
        <!--密码-->
        <div class="body-item">
          <p class="item-title">{{ $t('wb.password') }}</p>
          <p class="item-desc">{{ user.hasPassword ? '******' : $t('wb.no_set') }}</p>
          <span class="opt-btn" @click="handleSetPassword">
            {{ user.hasPassword ? $t('wb.change') : $t('wb.set') }}
          </span>
        </div>
      </div>
    </div>
  </n-modal>
  <SetPasswordModal v-if="showModal" ref="setPasswordModalRef" />
  <BindEmailModal v-if="showModal" ref="bindEmailModalRef" />
  <BindWechatModal v-if="showModal && IBConfig.APP_CHINA" ref="bindWechatModalRef" />
  <BindMobilePhoneModal v-if="showModal && IBConfig.APP_CHINA" ref="bindMobilePhoneModalRef" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import IconWarning from '@vicons/carbon/Warning'
import { IBConfig } from '@/config'
import { DataAnonymization } from '@/utils'
import { useUserStore } from '@/store'
import { UserApi } from '@/api/user'
import IbUserFace from '@/components/IbUserFace.vue'
import BindEmailModal from './BindEmailModal.vue'
import BindMobilePhoneModal from './BindMobilePhoneModal.vue'
import BindWechatModal from './BindWechatModal.vue'
import SetPasswordModal from './SetPasswordModal.vue'

const setPasswordModalRef = ref<InstanceType<typeof SetPasswordModal>>()
const bindEmailModalRef = ref<InstanceType<typeof BindEmailModal>>()
const bindWechatModalRef = ref<InstanceType<typeof BindWechatModal>>()
const bindMobilePhoneModalRef = ref<InstanceType<typeof BindMobilePhoneModal>>()
const showModal = ref(false)
const show = () => {
  showModal.value = true
}
const userStore = useUserStore()
const user = computed(() => userStore.user!)
const handleSetPassword = async () => {
  let missType = ''
  if (IBConfig.APP_CHINA && !user.value.mobile) {
    missType = 'mobile'
  }
  if (!IBConfig.APP_CHINA && !user.value.email) {
    missType = 'email'
  }
  if (missType) {
    return window.$dialog.warning({
      title: window.$t('tip'),
      content:
        missType === 'mobile' ? window.$t('wb.please_bind_mobile_first') : window.$t('wb.please_bind_email_first'),
      autoFocus: false,
      maskClosable: false,
      transformOrigin: 'center',
      positiveText: window.$t('confirm'),
      onPositiveClick: () => {
        missType === 'mobile' ? handleBindMobile() : handleBindEmail()
      },
      style: 'margin-top:50px'
    })
  }
  setPasswordModalRef.value?.show()
}
const handleEditName = () => {
  const { nickname } = user.value
  window.$prompt(
    {
      title: window.$t('wb.change_name'),
      inputLabel: window.$t('wb.name'),
      defaultValue: nickname || '',
      placeholder: window.$t('wb.change_name_placeholder'),
      validator: (name) => !!name
    },
    async (name) => {
      await UserApi.updateName(name)
      await userStore.getUserInfo()
      window.$message.success(window.$t('save_success'))
    }
  )
}
const handleBindMobile = () => {
  bindMobilePhoneModalRef.value?.show()
}
const handleBindEmail = () => {
  bindEmailModalRef.value?.show()
}
const handleBindWechat = () => {
  bindWechatModalRef.value?.show()
}

defineExpose({ show })
</script>

<style scoped lang="scss">
.account-modal {
  .title {
    display: flex;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid var(--border-color);
    .text {
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
    }
    .uid {
      color: var(--text-color-3);
      font-size: 12px;
      margin-left: 6px;
    }
  }
  .body {
    padding: 0 20px;
    .body-item {
      position: relative;
      padding: 18px 0;
      &:not(:last-child) {
        border-bottom: 1px solid var(--border-color);
      }
      .opt-btn {
        position: absolute;
        top: 45%;
        right: 0;
        margin-top: -7px;
        font-size: 14px;
        line-height: 14px;
        cursor: pointer;
        color: var(--primary-color);
      }
    }
    .item-title {
      color: #5d6f8f;
      font-size: 14px;
      line-height: 20px;
    }
    .item-desc {
      color: #35445d;
      font-weight: 500;
      margin-top: 14px;
      font-size: 14px;
      line-height: 14px;
      &.bind-tip {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: var(--text-color-3);
        :deep(.n-icon) {
          margin-right: 3px;
          color: var(--warning-color);
        }
      }
    }
  }
  .info {
    display: flex;
    .name-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 12px;
      font-size: 16px;
      .item-desc {
        margin-top: 0;
      }
    }
  }
  .third-party {
    .wechat {
      display: flex;
      align-items: center;
      .icon-wechat {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        color: #ffffff;
        background-color: rgb(0, 194, 80);
        border-radius: 50%;
        padding: 3px;
        margin-right: 6px;
      }
      .bind-btn {
        margin-left: 12px;
      }
    }
  }
}
</style>
