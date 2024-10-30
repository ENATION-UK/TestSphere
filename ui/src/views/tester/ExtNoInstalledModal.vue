<template>
  <div class="ext-no-installed">
    <div class="title">
      <IbLogo width="50" />
      <span class="title-text">{{ $t('tester.no_install_extension_title') }}</span>
    </div>
    <div class="qa-item">
      <div class="qa-title">
        <n-icon><QuestionCircleOutlined /></n-icon>
        {{ $t('tester.no_install_extension_q1') }}
      </div>
      <div class="qa-content">{{ $t('tester.no_install_extension_a1') }}</div>
    </div>
    <div class="qa-item">
      <div class="qa-title">
        <n-icon><QuestionCircleOutlined /></n-icon>
        {{ $t('tester.no_install_extension_q2') }}
      </div>
      <div class="qa-content">
        <div class="qa-content-item">
          <span class="qa-content-item-label">{{ $t('tester.online_install') }}: </span>
          <i18n-t keypath="tester.no_install_extension_a2_1">
            {{ isEdge ? 'Edge' : 'Chrome' }}
          </i18n-t>
        </div>
        <div class="qa-content-btn">
          <n-button type="primary" class="install-btn" @click="handleToInstallExtension">
            <i18n-t keypath="tester.install_extension_by">
              {{ isEdge ? 'Edge' : 'Chrome' }}
            </i18n-t>
          </n-button>
        </div>
        <div class="qa-content-item" style="margin-top: 15px">
          <span class="qa-content-item-label">{{ $t('tester.offline_install') }}: </span>
          <i18n-t keypath="tester.no_install_extension_a2_2">
            {{ isEdge ? 'Edge' : 'Chrome' }}
          </i18n-t>
        </div>
        <div class="qa-content-btn">
          <n-button type="primary" color="#7c46f2" class="install-btn" @click="handleToInstallExtensionOffline">
            {{ $t('tester.install_extension_offline_help') }}
          </n-button>
        </div>
      </div>
    </div>
    <div class="reload-text" @click="handleReloadPage">{{ $t('tester.install_extension_reload') }}</div>
  </div>
</template>

<script setup lang="ts">
import QuestionCircleOutlined from '@vicons/antd/QuestionCircleOutlined'
import { IBConfig } from '@/config'
import IbLogo from '@/components/IbLogo.vue'

const isEdge = /edg/.test(navigator.userAgent.toLowerCase())
const handleToInstallExtension = () => {
  if (isEdge) {
    window.open(`https://microsoftedge.microsoft.com/addons/detail/${IBConfig.TESTER_EXT_ID}`)
  } else {
    window.open(`https://chrome.google.com/webstore/detail/${IBConfig.TESTER_EXT_ID}`)
  }
}
const handleToInstallExtensionOffline = () => {
  const text = IBConfig.APP_CHINA ? 'itbuilder' : 'softfactory'
  if (isEdge) {
    window.open(`${IBConfig.DOCS_URL}/docs/autotest/record-test/why-${text}-extension`)
  } else {
    window.open(`${IBConfig.DOCS_URL}/docs/autotest/record-test/why-${text}-extension`)
  }
}
const handleReloadPage = () => {
  window.location.reload()
}
</script>

<style scoped lang="scss">
.ext-no-installed {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 24px;
  font-size: 16px;
  line-height: 22px;
  .title {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 700;
    line-height: 24px;
    margin-top: 12px;
    margin-bottom: 12px;
    .title-text {
      margin-left: 12px;
      margin-top: 8px;
    }
  }
  .qa-item {
    & + .qa-item {
      margin-top: 15px;
    }
    .qa-title {
      display: flex;
      align-items: center;
      color: var(--warning-color);
      :deep(.n-icon) {
        margin-right: 5px;
      }
    }
    .qa-content {
      color: #333333;
      margin-top: 10px;
      margin-left: 24px;
      font-size: 14px;
      .qa-content-item-label {
        color: #111111;
        font-weight: bold;
      }
    }
    .qa-content-btn {
      display: flex;
      justify-content: center;
      width: 100%;
    }
  }
  .subtitle {
    text-align: center;
  }
  .install-btn {
    width: 300px;
    height: 50px;
    margin-top: 10px;
    margin-bottom: 15px;
    font-size: 20px;
    font-weight: bold;
  }
  .reload-text {
    color: var(--primary-color);
    background: none;
    font-size: 12px;
    letter-spacing: 0;
    font-weight: bold;
    line-height: 40px;
    padding: 0 12px;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      text-decoration: none;
    }
  }
  .tip-text {
    color: #858791;
    font-size: 12px;
    line-height: 18px;
    padding-bottom: 10px;
    padding-top: 10px;
  }
}
</style>
