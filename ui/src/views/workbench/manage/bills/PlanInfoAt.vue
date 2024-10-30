<template>
  <div v-if="company" class="plan-info">
    <div class="title">{{ $t('autoTester') }} - {{ $t('wb.manage.orders.plan_info') }}</div>
    <div class="info-list">
      <div class="item">
        <div class="label">{{ $t('wb.manage.orders.version_info') }}</div>
        <div class="value">
          {{ company.subscribeTypeAt ? $t(IBSubscribeTypeAtMap[subscribe?.subscribeType || 'FREE']) : '' }}
        </div>
      </div>
      <div class="item">
        <div class="label">{{ $t('tester.month_run_count_limit') }}</div>
        <div class="value">{{ company.maxCountMonthly }}</div>
      </div>
      <div class="item">
        <div class="label">{{ $t('wb.manage.orders.exp_time') }}</div>
        <div class="value">{{ effectiveDate }}</div>
      </div>
      <div class="item">
        <div class="label">{{ $t('tester.run_concurrency_limit') }}</div>
        <div class="value">{{ company.maxConcurrent }}</div>
      </div>
    </div>
    <div v-if="!userStore.aliYunUser" class="btn-list">
      <n-space>
        <n-button v-if="isFree" type="info" size="small" @click="handleUpgradePlan">
          {{ $t('wb.manage.orders.upgrade') }}
        </n-button>
        <n-button v-if="!isFree" type="default" size="small" @click="handleUpgradePlan">
          {{ $t('wb.manage.orders.renewal') }}
        </n-button>
        <n-button size="small" @click="handleToOrderRecord">{{ $t('wb.manage.orders.order_record') }}</n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { IBSubscribeTypeAtMap } from '@/types/workbench'
import { formatUnix } from '@/utils'
import { useUserStore } from '@/store'
import { useCompanyStore } from '@/store/workbench'
import { useSubscriptionAtModal } from '@/hooks'

const router = useRouter()
const userStore = useUserStore()
const companyStore = useCompanyStore()
const company = computed(() => companyStore.company!)
const subscribe = computed(() => companyStore.subscriptionAt)
// 是否为免费版
const isFree = computed(() => {
  const type = subscribe.value?.subscribeType
  if (!type) return true
  return !['PROFESSIONAL', 'ADVANCED'].includes(type)
})

// 升级方案
const handleUpgradePlan = () => {
  useSubscriptionAtModal()
}

const handleToOrderRecord = () => {
  router.push({ name: 'bills' })
}

const effectiveDate = computed(() => {
  if (!subscribe.value) return ''
  const { expiryTime } = subscribe.value
  return formatUnix(expiryTime, '/', 'YYYY-MM-DD')
})
</script>

<style scoped lang="scss">
.plan-info {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;
  margin-top: 12px;
  .title {
    color: #222222;
    font-size: 16px;
    font-weight: bold;
    span {
      color: #999999;
      font-size: 12px;
      font-weight: normal;
    }
  }
  .info-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 24px;
    padding-right: 200px;
    .item {
      display: flex;
      width: 45%;
      margin-bottom: 18px;
      .label {
        color: #999999;
        margin-right: 12px;
      }
      &.ai-point {
        .value {
          :deep(.n-button) {
            font-size: 14px;
            margin-left: 10px;
            text-decoration: underline;
          }
        }
      }
    }
  }
  .btn-list {
    margin-top: 8px;
  }
}
</style>
