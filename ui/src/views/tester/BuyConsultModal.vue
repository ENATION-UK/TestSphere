<template>
  <div class="buy-consult">
    <div v-for="item in versionList" :key="item.id" class="version-item">
      <div class="ver-name">{{ item.verName }}</div>
      <div class="info-list">
        <div v-for="info in item.infoList" :key="info.label" class="info-item">
          <div class="info-label">{{ info.label }}:</div>
          <div class="info-value">{{ info.value }}</div>
        </div>
        <n-button
          v-if="item.planBtn"
          :color="item.planBtn.color"
          :focusable="false"
          class="plan-btn"
          @click="getPricePlan"
        >
          {{ $t('get_price_plan') }}
        </n-button>
      </div>
    </div>
    <n-modal v-model:show="showServiceModal" closable transform-origin="center">
      <div class="service-card">
        <div class="card-head">
          <div class="face-box">
            <img src="@/assets/service-face.png" alt class="service-face-img" />
          </div>
          <div class="head-title">{{ $t('i_am_your_service') }}</div>
          <div class="head-subtitle">{{ $t('scan_wechat_qrcode_get_plan') }}</div>
        </div>
        <div class="card-body">
          <img :src="IBConfig.WECHAT_GROUP_QRCODE_URL" alt="" class="qrcode-img" />
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IBSubscribeTypeAtMap } from '@/types/workbench'
import { IBConfig } from '@/config'

const versionList = [
  {
    id: '1',
    verName: window.$t(IBSubscribeTypeAtMap.FREE),
    infoList: [
      { label: window.$t('tester.run_count'), value: window.$t('times_of_month', { num: 100 }) },
      { label: window.$t('tester.concurrency_limit'), value: window.$t('tester.num_of_concurrency_limit', { num: 1 }) },
      { label: window.$t('tester.batch_run'), value: window.$t('not_supported') },
      { label: window.$t('tester.after_sales_support'), value: window.$t('none') }
    ],
    planBtn: null
  },
  {
    id: '2',
    verName: window.$t(IBSubscribeTypeAtMap.PROFESSIONAL),
    infoList: [
      { label: window.$t('tester.run_count'), value: window.$t('times_of_month', { num: 5000 }) },
      { label: window.$t('tester.concurrency_limit'), value: window.$t('tester.num_of_concurrency_limit', { num: 2 }) },
      { label: window.$t('tester.batch_run'), value: window.$t('supported') },
      { label: window.$t('tester.after_sales_support'), value: window.$t('group_support') }
    ],
    planBtn: {
      color: '#e38425'
    }
  },
  {
    id: '3',
    verName: window.$t(IBSubscribeTypeAtMap.ADVANCED),
    infoList: [
      { label: window.$t('tester.run_count'), value: window.$t('times_of_month', { num: 10000 }) },
      { label: window.$t('tester.concurrency_limit'), value: window.$t('tester.num_of_concurrency_limit', { num: 5 }) },
      { label: window.$t('tester.batch_run'), value: window.$t('supported' + '') },
      { label: window.$t('tester.after_sales_support'), value: window.$t('one_vs_one_support') }
    ],
    planBtn: {
      color: '#6e00ff'
    }
  }
]

const showServiceModal = ref(false)
const getPricePlan = () => {
  showServiceModal.value = true
}
</script>

<style scoped lang="scss">
.buy-consult {
  display: flex;
  width: 100%;
  padding-top: 44px;
  background-color: #ffffff;
  .version-item {
    display: flex;
    flex-direction: column;
    flex: 1;
    & + .version-item {
      margin-left: 24px;
    }
    &:nth-child(1) {
      .ver-name {
        background-color: #bdb5c9;
      }
    }
    &:nth-child(2) {
      .ver-name {
        background-color: #e38425;
      }
    }
    &:nth-child(3) {
      .ver-name {
        background-color: #6e00ff;
      }
    }
    .ver-name {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 24px;
      height: 64px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    .info-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      border: 1px solid var(--border-color);
      border-top: none;
      padding-top: 10px;
      padding-bottom: 24px;
    }
    .info-item {
      display: flex;
      align-items: center;
      width: 100%;
      line-height: 44px;
      .info-label,
      .info-value {
        width: 50%;
        font-size: 16px;
      }
      .info-label {
        text-align: right;
        padding-right: 12px;
      }
      .info-value {
        padding-left: 8px;
      }
    }
    .plan-btn {
      margin-top: 24px;
    }
  }
}
.service-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  border-radius: 8px;
  background-color: #ffffff;
  .card-head {
    position: relative;
    width: 100%;
    padding-bottom: 10px;
    background-color: #ec61b9;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    .face-box {
      position: relative;
      left: 50%;
      margin-top: -50px;
      margin-left: -50px;
      margin-bottom: 12px;
      width: 100px;
      height: 100px;
      border-radius: 9999999px;
      .service-face-img {
        width: 100%;
        height: 100%;
      }
    }
    .head-title,
    .head-subtitle {
      width: 100%;
      text-align: center;
      color: #ffffff;
      font-size: 14px;
      font-weight: 500;
    }
  }
  .card-body {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 24px;
    padding-bottom: 24px;
    .qrcode-img {
      width: 200px;
      height: 200px;
      border: none;
      outline: none;
    }
  }
}
</style>
