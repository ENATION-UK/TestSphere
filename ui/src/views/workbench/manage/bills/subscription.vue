<template>
  <div v-if="company" class="bills-subscription">
    <div>
      <div v-if="company" class="owner">
        <div class="title">{{ $t('wb.manage.orders.enterprise_owner') }}</div>
        <div class="user-info">
          <WorkbenchAvatar :src="company.logo" :name="company.companyName" company />
          <span>{{ company.companyName }}</span>
        </div>
      </div>
      <PlanInfoDb />
      <PlanInfoAt />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { DialogReactive } from 'naive-ui'
import { IBSubscribeTypeDb } from '@/types/workbench'
import { formatUnix } from '@/utils'
import { useCompanyStore } from '@/store/workbench'
import { useIbModal } from '@/hooks'
import { SubscribesApi } from '@/api/workbench'
import WorkbenchAvatar from '@/views/workbench/WorkbenchAvatar.vue'
import PlanInfoAt from './PlanInfoAt.vue'
import PlanInfoDb from './PlanInfoDb.vue'

const props = defineProps<{
  modal?: boolean
  dialog?: DialogReactive
}>()
const route = useRoute()
const ibModal = useIbModal()
const companyStore = useCompanyStore()
const company = computed(() => companyStore.company!)
const currentSubscribeType = computed(() => companyStore.company!.subscribeTypeDb)
const activeTab = ref<0 | 1>(0)
const oldSubscribeType = ref(company.value.subscribeTypeDb)
const loading = ref(false)
const tabStyle = computed(() => {
  const left = `calc((100% / 2) * ${activeTab.value} + 4px)`
  return { left }
})
// 取消订阅
const onCancelPlan = async () => {
  const dialog = window.$dialog.create({
    type: 'error',
    title: window.$t('wb.manage.bills.cancel_plan'),
    positiveText: window.$t('wb.manage.bills.cancel_plan'),
    negativeText: window.$t('cancel'),
    content: window.$t('wb.manage.bills.cancel_plan_tip', { date: formatUnix(company.value.expiryTime) }),
    iconPlacement: 'left',
    closable: false,
    maskClosable: false,
    style: 'width: 400px',
    onPositiveClick: (): Promise<void> => {
      dialog.loading = true
      return new Promise((resolve, reject) => {
        SubscribesApi.update('FREE')
          .then(() => {
            resolve()
            companyStore.getCompanyInfo()
          })
          .catch(() => {
            reject()
          })
      })
    }
  })
}
// 显示AI点日志
const onShowAiPointLogs = async () => {
  ibModal.aiPointLogModalRef.value?.show()
}
// 购买AI点
const onBuyAiPoint = async () => {
  ibModal.buyAiPointModalRef.value?.show()
}
const seatQuantity = ref(2)
const minSeat = ref(2)
watch(
  () => company.value,
  (newVal) => {
    if (!newVal) return
    const { subscribeTypeDb, seatTotal } = newVal
    if (subscribeTypeDb.includes('YEARLY')) {
      activeTab.value = 1
    }
    if (subscribeTypeDb.includes('TEAM') && seatTotal) {
      seatQuantity.value = seatTotal
      minSeat.value = seatTotal
    }
  },
  { immediate: true, deep: true }
)
let loopTimer: any = null
const getCompanyInfoLoop = async () => {
  if (loopTimer) clearTimeout(loopTimer)
  await companyStore.getCompanyInfo()
  if (company.value.subscribeTypeDb === oldSubscribeType.value) {
    loopTimer = setTimeout(getCompanyInfoLoop, 1000)
  } else {
    props.dialog?.destroy()
    loading.value = false
    if (loopTimer) clearTimeout(loopTimer)
  }
}
const subscriptionType = ref<IBSubscribeTypeDb>()
const onChooseSubscription = async (type: IBSubscribeTypeDb) => {
  const { subscribeTypeDb } = company.value
  if (subscribeTypeDb !== 'FREE' && type === 'FREE') return onCancelPlan()
  subscriptionType.value = type
  loading.value = true
  try {
    if (!company.value.subscriptionId) {
      const url = await SubscribesApi.create(type, type.startsWith('TEAM') ? seatQuantity.value : 5)
      if (!props.modal) {
        window.location.href = url
      } else {
        getCompanyInfoLoop()
        window.open(url, '_blank')
      }
      return
    }
    await window.$confirm(window.$t('wb.subscribe_update_tip'), { type: 'warning' }, async () => {
      const res = await SubscribesApi.update(type, type.startsWith('TEAM') ? seatQuantity.value : 5)
      if (!Boolean(res)) return
      getCompanyInfoLoop()
      await companyStore.getCompanyInfo()
      window.$dialog.success({
        title: window.$t('success'),
        autoFocus: false,
        content: window.$t('wb.subscribe_update_success_tip'),
        positiveText: window.$t('confirm'),
        style: 'width: 380px'
      })
    })
  } finally {
    loading.value = false
    subscriptionType.value = undefined
  }
}

// 处理订阅成功和取消
const onSubscriptionResult = async () => {
  const status = route.query.status as string
  if (!status || !['success', 'cancel'].includes(status)) return
  if (status === 'success') {
    await companyStore.getCompanyInfo()
    window.$dialog.success({
      title: window.$t('success'),
      autoFocus: false,
      content: window.$t('wb.subscribe_success_tip'),
      positiveText: window.$t('confirm'),
      style: 'width:380px'
    })
  }
  if (status === 'cancel') {
    window.$dialog.warning({
      title: window.$t('tip'),
      autoFocus: false,
      content: window.$t('wb.subscribe_cancel_tip'),
      positiveText: window.$t('confirm'),
      style: 'width:380px'
    })
  }
  const url = new URL(window.location.href)
  url.search = ''
  window.history.pushState({}, '', url)
}
onMounted(() => onSubscriptionResult())
</script>

<style scoped lang="scss">
.bills-subscription {
  .owner {
    padding: 24px;
    background-color: #ffffff;
    border-radius: 8px;
    .title {
      color: #222222;
      font-size: 16px;
      font-weight: bold;
    }
    .user-info {
      display: flex;
      align-items: center;
      margin-top: 24px;
      .avatar {
        width: 40px;
        height: 40px;
        margin-right: 12px;
      }
    }
  }
  .detail {
    background-color: #f8fafe;
    box-sizing: border-box;
    padding: 24px;
    border-radius: 2px;
    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 24px;
    }
    .detail-item {
      display: flex;
      justify-content: space-between;
      width: 480px;
      margin-bottom: 12px;
      .label {
        width: 45%;
        font-weight: bold;
      }
      .value {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 55%;
      }
      .value-btn {
        text-decoration: underline;
      }
      .status-canceled {
        color: var(--warning-color);
        margin-left: 5px;
      }
    }
  }
  .switch-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    box-shadow:
      0 2px 12px rgba(25, 25, 26, 0.04),
      0 6px 20px rgba(25, 25, 26, 0.06);
    border-radius: 84px;
    min-height: 48px;
    position: relative;
    max-width: 250px;
    margin: 35px auto 35px;
    .item-switch {
      position: relative;
      flex: 1;
      height: 40px;
      font-size: 16px;
      font-weight: 400;
      line-height: 40px;
      border-radius: 52px;
      transition:
        color 0.3s ease-in,
        background-color 0.2s ease;
      margin-bottom: 0;
      color: #5f5f5f;
      z-index: 2;
      cursor: pointer;
      text-align: center;
      &:hover {
        color: #19191a;
      }
      &.active {
        color: #ffffff;
      }
    }
    .active-tab {
      position: absolute;
      left: 4px;
      top: 4px;
      height: 40px;
      width: calc(100% / 2 - 8px);
      transition: left 0.3s ease-out;
      background: #7353fc;
      border-radius: 52px;
      z-index: 0;
    }
  }
  .plan-list {
    display: flex;
    justify-content: center;
    .item-pricing {
      width: auto;
      flex: 0 0 350px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      box-shadow:
        0 6px 10px rgba(77, 94, 112, 0.03),
        0 8px 48px rgba(238, 238, 238, 0.52);
      border-radius: 20px;
      position: relative;
      background-color: #ffffff;
      padding: 32px;
      min-height: 480px;
      text-align: left;
      &.active {
        background-color: #eeeeee;
      }
      &:not(:last-child) {
        margin-right: 36px;
      }
      .item-title {
        font-size: 24px;
        font-weight: bold;
        line-height: 36px;
        margin-bottom: 12px;
      }
      .item-subtitle {
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        color: rgba(0, 0, 0, 0.5);
        margin-bottom: 24px;
        min-height: 30px;
      }
      .item-price {
        display: flex;
        align-items: baseline;
        margin-bottom: 28px;
        .price {
          font-size: 32px;
          line-height: 42px;
          font-weight: 700;
          height: 42px;
        }
        .seats,
        .type {
          font-weight: 400;
          font-size: 20px;
          color: rgb(16, 16, 16);
          font-style: normal;
          letter-spacing: 0;
          line-height: 23px;
          margin-left: 5px;
        }
      }
      .btn-view {
        position: relative;
        font-size: 22px;
        width: 100%;
        height: 60px;
        line-height: 58px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 400;
        border-radius: 10px;
        margin-bottom: 20px;
        border: 2px solid #121212;
        transition: all 0.3s ease;
        user-select: none;
        color: #000000;
        :deep(.n-button__state-border) {
          display: none;
        }
        &:not(.n-button--disabled):hover {
          transform: translateY(-6px);
          box-shadow:
            0 0 4px rgba(25, 25, 26, 0.04),
            0 4px 16px rgba(25, 25, 26, 0.04),
            0 8px 24px rgba(25, 25, 26, 0.06);
        }
        &.active {
          color: #ffffff;
          background-color: #3788ff;
          border-color: #3788ff;
        }
      }
      .num-box {
        display: flex;
        justify-content: center;
        :deep(.n-input-number) {
          width: 150px;
          text-align: center;
        }
      }
      .item-rules {
        list-style: none;
        .item-rule {
          position: relative;
          display: flex;
          align-items: center;
          color: rgba(0, 0, 0, 0.7);
          font-size: 14px;
          height: 42px;
          padding-left: 20px;
          &::before {
            content: '';
            position: absolute;
            left: 0;
            width: 14px;
            height: 14px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            background-image: url('@/assets/icons/icon-check.svg');
          }
        }
      }
    }
  }
}
</style>
