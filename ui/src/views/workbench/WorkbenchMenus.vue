<template>
  <div class="workbench-menus">
    <div class="logo-view">
      <IbLogo width="150" type="left-right" home />
    </div>
    <div class="menus-view">
      <router-link
        v-if="companyStore.hasDbDesignAuth && IBConfig.APP_CHINA"
        :to="{ name: 'dbDesignerProjects' }"
        class="item-menu"
      >
        <span class="title-menu">{{ $t('dbDesigner') }}</span>
        <n-icon class="icon-arrow">
          <IosArrowForward />
        </n-icon>
      </router-link>
      <router-link :to="{ name: 'testerProjects' }" class="item-menu">
        <span class="title-menu">{{ $t('autoTester') }}</span>
        <n-icon class="icon-arrow">
          <IosArrowForward />
        </n-icon>
      </router-link>
      <router-link
        v-if="companyStore.hasDbDesignAuth && !IBConfig.APP_CHINA"
        :to="{ name: 'dbDesignerProjects' }"
        class="item-menu"
      >
        <span class="title-menu">{{ $t('dbDesigner') }}</span>
        <n-icon class="icon-arrow">
          <IosArrowForward />
        </n-icon>
      </router-link>
      <div class="menu-hr"></div>
      <router-link v-if="companyStore.hasDbDesignAuth" to="/devices" class="item-menu">
        <n-icon class="icon-menu">
          <ComputerRound />
        </n-icon>
        <span class="title-menu">{{ $t('wb.device.ide_list') }}</span>
      </router-link>
      <router-link to="/manage" class="item-menu">
        <n-icon class="icon-menu">
          <SettingFilled />
        </n-icon>
        <span class="title-menu">{{ $t('wb.menus.manage') }}</span>
      </router-link>
    </div>
    <div class="user-view">
      <n-popover
        v-if="user"
        trigger="hover"
        placement="right"
        :show-arrow="false"
        style="padding: 0; border-radius: 10px"
      >
        <template #trigger>
          <div class="item info-user">
            <IbUserFace class="user-face" />
            <div class="name-box">
              <n-ellipsis class="name" style="max-width: 100px">{{ user.nickname }}</n-ellipsis>
            </div>
          </div>
        </template>
        <div class="user-menus">
          <div class="info-view">
            <div class="inner-info">
              <IbUserFace class="user-face" />
              <div class="name-box">
                <n-ellipsis class="name">{{ user.nickname }}</n-ellipsis>
              </div>
            </div>
          </div>
          <div class="menus-view">
            <n-button quaternary @click="handleToSetting">
              <n-icon>
                <SettingsOutline />
              </n-icon>
              {{ $t('wb.account_setting') }}
            </n-button>
            <n-button quaternary @click="handleToWebsite">
              <n-icon>
                <HomeOutline />
              </n-icon>
              {{ $t('wb.go_to_website') }}
            </n-button>
            <n-divider />
            <n-button quaternary @click="handleLogout">
              <n-icon>
                <ExitOutline />
              </n-icon>
              {{ $t('wb.logout') }}
            </n-button>
          </div>
        </div>
      </n-popover>
      <n-popover
        v-if="company"
        trigger="hover"
        placement="right"
        :show-arrow="false"
        style="padding: 0; border-radius: 10px"
      >
        <template #trigger>
          <div class="item team-user">
            <workbench-avatar :src="company.logo" :name="displayCompanyName()" company class="avatar" />
            <div class="name">
              <n-ellipsis style="max-width: 100px">{{ displayCompanyName() }}</n-ellipsis>
            </div>
            <div class="arrows">
              <n-icon class="up">
                <ArrowDropUpRound />
              </n-icon>
              <n-icon class="down">
                <ArrowDropUpRound />
              </n-icon>
            </div>
          </div>
        </template>
        <n-spin :show="changeLoading">
          <div class="teams-box">
            <div class="team-list">
              <div
                v-for="item in companies"
                :key="item.companyId"
                class="item-team"
                :class="{ active: company.companyId === item.companyId }"
                @click="handleChangeCompany(item)"
              >
                <workbench-avatar :src="item.logo" :name="displayCompanyName(item)" company class="logo-team" />
                <div class="info">
                  <div class="name">
                    <n-ellipsis>{{ displayCompanyName(item) }}</n-ellipsis>
                  </div>
                  <div class="other">
                    <div class="sub-type">{{ Formatters.subTypeName(item.subscribeTypeDb) }}</div>
                    <div class="use-total">
                      <div class="table">{{ $t('table') }}: {{ item.tableUsed }}/{{ item.tableTotal }}</div>
                      <div class="ai-point">{{ $t('wb.ai_point') }}: {{ item.aiPoint }}</div>
                    </div>
                  </div>
                </div>
                <div class="check-tag">
                  <n-icon class="icon-check">
                    <Checkmark12Filled />
                  </n-icon>
                </div>
              </div>
            </div>
          </div>
        </n-spin>
      </n-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import SettingFilled from '@vicons/antd/SettingFilled'
import Checkmark12Filled from '@vicons/fluent/Checkmark12Filled'
import IosArrowForward from '@vicons/ionicons4/IosArrowForward'
import ExitOutline from '@vicons/ionicons5/ExitOutline'
import HomeOutline from '@vicons/ionicons5/HomeOutline'
import SettingsOutline from '@vicons/ionicons5/SettingsOutline'
import ArrowDropUpRound from '@vicons/material/ArrowDropUpRound'
import ComputerRound from '@vicons/material/ComputerRound'
import { IBGuide } from '@/types'
import { IBCompany } from '@/types/workbench'
import { IBConfig } from '@/config'
import { Formatters } from '@/utils'
import { useGuideStore, useUserStore } from '@/store'
import { useCompanyStore } from '@/store/workbench'
import { useIbModal } from '@/hooks'
import IbLogo from '@/components/IbLogo.vue'
import IbUserFace from '@/components/IbUserFace.vue'
import WorkbenchAvatar from './WorkbenchAvatar.vue'

const router = useRouter()
const ibModal = useIbModal()
const userStore = useUserStore()
const companyStore = useCompanyStore()
const user = computed(() => userStore.user)
const company = computed(() => companyStore.company)
// 主要是排个序，把当前选中团队排到最前面
const companies = computed<IBCompany[]>(() => {
  if (!company.value) return []
  const list = companyStore.companies
  if (!list) return []
  const curIndex = list.findIndex((item) => item.companyId === company.value!.companyId)
  const curCompany = list[curIndex]
  list.splice(curIndex, 1)
  list.splice(0, 0, curCompany)
  return list
})
const displayCompanyName = (com?: IBCompany) => {
  const comp = com || company.value
  if (!comp) return ''
  const { subscribeTypeDb, companyName } = comp
  if (subscribeTypeDb === 'FREE') {
    return com ? window.$t('wb.personal_space') : window.$t('wb.personal')
  }
  return companyName
}
const handleLogout = () => {
  window.$confirm(window.$t('wb.confirm_logout'), {}, async () => {
    await userStore.logout()
    const url = router.resolve('/login')
    window.location.replace(url.href)
  })
}
const handleToWebsite = () => {
  window.open(IBConfig.APP_WEBSITE)
}
const handleToSetting = () => {
  ibModal.accountModalRef.value?.show()
}
const changeLoading = ref(false)
const handleChangeCompany = async (item: IBCompany) => {
  if (item.companyId === company.value?.companyId) return
  try {
    changeLoading.value = true
    await companyStore.changeCompany(item.companyId)
    location.reload()
  } finally {
    changeLoading.value = false
  }
}

// 导览
const guideStore = useGuideStore()
const guideItem: IBGuide = {
  key: 'workbenchMenus',
  steps: [
    {
      title: window.$t('wb.guide_wb_menu_tester_title'),
      content: window.$t('wb.guide_wb_menu_tester_content'),
      placement: 'right-start',
      selector: '#app > div > div.workbench-layout > div.workbench-menus > div.menus-view > a:nth-child(1)'
    }
  ]
}
guideStore.addGuide(guideItem)
</script>

<style scoped lang="scss">
.workbench-menus {
  position: relative;
  width: 200px;
  height: 100vh;
  background-color: #fff;
  border-right: 1px solid var(--border-color);
  .logo-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 24px;
  }
  .menus-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 8px;
    padding-bottom: 120px;
    .item-menu {
      position: relative;
      display: flex;
      align-items: center;
      width: 170px;
      height: 40px;
      padding: 0 10px;
      border-radius: 9999px;
      transition: all 0.2s var(--bezier);
      color: #6d6a6a;
      margin-top: 24px;
      cursor: pointer;
      &.new {
        .icon-menu {
          color: #d45c5b;
        }
        .title-menu {
          color: #111111;
        }
      }
      .icon-menu {
        font-size: 24px;
        margin-right: 12px;
      }
      &.router-link-active,
      &:hover {
        color: var(--ib-main-color);
        background-color: var(--ib-main-hover-color);
        .icon-arrow {
          opacity: 1;
        }
      }
      .title-menu {
      }
      @keyframes arrow-move {
        0% {
          transform: translateX(0);
        }
        50% {
          transform: translateX(5px);
        }
        100% {
          transform: translateX(0);
        }
      }
      &:hover .icon-arrow {
        animation: arrow-move 1s ease-in-out infinite;
      }
      .icon-arrow {
        opacity: 0;
        position: absolute;
        right: 24px;
        transition: opacity 0.2s var(--bezier);
      }
    }
    .menu-hr {
      width: calc(100% - 48px);
      border-bottom: 1px dashed var(--border-color);
      margin-top: 24px;
    }
  }
  .user-view {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding-bottom: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--divider-color);
    background-color: var(--body-color);
    transition: all 0.2s var(--bezier);
    .info-user .user-face {
      font-size: 18px;
    }
    .item {
      display: flex;
      align-items: center;
      position: relative;
      height: 60px;
      cursor: pointer;
      padding-left: 12px;
      &:hover {
        color: var(--ib-main-color);
        background-color: var(--ib-main-hover-color);
        &::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 5px;
          height: 100%;
          background-color: var(--ib-main-color);
        }
      }
    }
    .info-user {
      .name-box {
        margin-left: 10px;
      }
    }
    .team-user {
      position: relative;
      .avatar {
        color: #ffffff;
        font-size: 14px;
        background-color: var(--ib-main-color);
      }
      .name {
        margin-left: 10px;
      }
      .arrows {
        display: flex;
        flex-direction: column;
        position: absolute;
        right: 12px;
        :deep(.n-icon) {
          font-size: 22px;
          color: #979fb3;
        }
        .up {
          top: 7px;
        }
        .down {
          bottom: 7px;
          transform: rotate(180deg);
        }
      }
    }
  }
}
.user-menus {
  width: 264px;
  .info-view {
    position: relative;
    background: linear-gradient(360deg, rgb(238, 245, 255) 0.01%, rgb(199, 218, 255) 102.95%);
    padding: 20px 12px 12px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    .inner-info {
      display: flex;
      margin-left: 12px;
      .user-face {
        width: 42px;
        height: 42px;
        font-size: 18px;
        flex-shrink: 0;
      }
      .name-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 12px;
        :deep(.name) {
          font-size: 16px;
          max-width: 160px;
        }
        :deep(.desc) {
          max-width: 160px;
          color: #5d6f8f;
          font-size: 12px;
          line-height: 17px;
        }
      }
    }
  }
  .menus-view {
    padding: 12px;
    :deep(.n-divider) {
      margin-top: 4px;
      margin-bottom: 4px;
    }
    :deep(.n-button) {
      width: 100%;
      justify-content: flex-start;
      .n-icon {
        font-size: 22px;
        margin-right: 12px;
      }
    }
  }
}
.teams-box {
  width: 330px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: var(--box-shadow-1);
  padding: 24px 6px;
  cursor: auto;
  .item-team {
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding: 10px 8px;
    cursor: pointer;
    border-radius: 4px;
    &:not(.active):hover {
      background-color: var(--hover-color);
    }
    &.active {
      cursor: not-allowed;
      background-color: var(--hover-color);
      :deep(.check-tag) {
        visibility: visible;
      }
    }
    &.add {
      .logo-team {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--border-color);
        border-radius: 50%;
      }
    }
    .check-tag {
      position: absolute;
      z-index: 2;
      top: -15px;
      right: -30px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 40px;
      background-color: var(--primary-color);
      transform: rotate(45deg);
      visibility: hidden;
      :deep(.icon-check) {
        color: #ffffff;
        font-size: 18px;
        margin-top: 20px;
        margin-right: 6px;
        transform: rotate(-45deg);
      }
    }
    .logo-team {
      width: 36px;
      height: 36px;
      margin-right: 12px;
    }
    .info {
      z-index: 1;
      display: flex;
      flex: 1;
      flex-direction: column;
      .name {
        max-width: 230px;
        color: #222222;
        font-size: 14px;
        font-weight: bold;
      }
      .other {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 6px;
        font-size: 12px;
      }
      .use-total {
        display: flex;
        align-items: center;
      }
      .table {
        margin-right: 10px;
      }
    }
  }
}
</style>
