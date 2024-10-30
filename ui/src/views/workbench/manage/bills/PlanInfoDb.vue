<template>
  <div v-if="company" class="plan-info">
    <div class="title">{{ $t('dbDesigner') }} - {{ $t('wb.manage.orders.plan_info') }}</div>
    <div class="info-list">
      <div class="item">
        <div class="label">{{ $t('wb.manage.orders.version_info') }}</div>
        <div class="value">
          {{ company.subscribeTypeDb ? $t(IBSubscribeTypeDbMap[subscribe?.subscribeType || 'FREE']) : '' }}
        </div>
      </div>
      <div class="item">
        <div class="label">{{ $t('wb.orders.plan_seats') }}</div>
        <div class="value">{{ company.seatUsed }} / {{ company.seatTotal }}</div>
      </div>
      <div class="item">
        <div class="label"></div>
        <div class="value"></div>
      </div>
      <div class="item">
        <div class="label">{{ $t('wb.manage.orders.exp_time') }}</div>
        <div class="value">{{ effectiveDate }}</div>
      </div>
      <div class="item">
        <div class="label">{{ $t('wb.manage.orders.table_used_num') }}</div>
        <div class="value">{{ company.tableUsed }} / {{ company.tableTotal }}</div>
      </div>
      <div class="item ai-point">
        <div class="label">{{ $t('wb.manage.orders.ai_point') }}</div>
        <div class="value">
          {{ $t('wb.manage.orders.residual') }} {{ company.aiPoint }}
          <n-button v-if="!userStore.aliYunUser" type="info" text @click="buyAiPoint">
            {{ $t('wb.manage.orders.buy') }}
          </n-button>
          <n-button type="info" text @click="viewAiPointLogs">{{ $t('wb.manage.orders.log') }}</n-button>
        </div>
      </div>
    </div>
    <div v-if="!userStore.aliYunUser" class="btn-list">
      <n-space>
        <n-button v-if="company.subscribeTypeDb !== 'TEAM'" type="info" size="small" @click="handleUpgradePlan">
          {{ $t('wb.manage.orders.upgrade') }}
        </n-button>
        <n-button size="small" @click="handleToOrderRecord">{{ $t('wb.manage.orders.order_record') }}</n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { IBSubscribeTypeDbMap } from '@/types/workbench'
import { formatUnix } from '@/utils'
import { useUserStore } from '@/store'
import { useCompanyStore } from '@/store/workbench'
import { useIbModal, useSubscriptionDbModal } from '@/hooks'

const router = useRouter()
const ibModal = useIbModal()
const userStore = useUserStore()
const companyStore = useCompanyStore()
const company = computed(() => companyStore.company!)
const subscribe = computed(() => {
  return companyStore.subscriptions.find((item) => item.productType === 'dbdesign')
})

const handleUpgradePlan = () => {
  useSubscriptionDbModal()
}
const handleToOrderRecord = () => {
  router.push({ name: 'bills' })
}

const buyAiPoint = () => {
  ibModal.buyAiPointModalRef.value?.show()
}
const viewAiPointLogs = () => {
  ibModal.aiPointLogModalRef.value?.show()
}

const effectiveDate = computed(() => {
  if (!subscribe.value) return '/'
  let { expiryTime } = subscribe.value
  if (String(expiryTime).length === 11) expiryTime /= 10
  if (String(expiryTime).length === 13) expiryTime /= 1000
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
    .item {
      display: flex;
      width: 33.33333%;
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
