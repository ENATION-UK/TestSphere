<template>
  <div v-if="company" class="bills-subscription" :class="{ modal }">
    <div class="detail">
      <div class="title">
        {{ $t('wb.manage.bills.subscribe_detail') }}
        ({{ company.companyName || $t('wb.manage.bills.subscribe_free') }})
      </div>
      <div class="detail-item plan">
        <div class="label">{{ $t('wb.manage.orders.plan_info') }}</div>
        <div class="value">
          <span>{{ company.subscribeTypeAt ? $t(IBSubscribeTypeAtMap[company.subscribeTypeAt]) : '' }}</span>
          <n-button
            v-if="currentSubscribeType && currentSubscribeType !== 'FREE' && company.subscriptionStatus !== 'canceled'"
            text
            size="tiny"
            type="info"
            class="value-btn"
            @click="onCancelPlan"
            style="margin-left: 4px"
            >{{ $t('wb.manage.bills.cancel_plan') }}
          </n-button>
        </div>
      </div>
      <div v-if="currentSubscribeType.includes('TEAM')" class="detail-item plan">
        <div class="label">{{ $t('wb.enterprise_seats') }}</div>
        <div class="value">
          <span>{{ company.seatUsed }} / {{ company.seatTotal }}</span>
        </div>
      </div>
      <div v-if="currentSubscribeType !== 'FREE'" class="detail-item">
        <div class="label">{{ $t('wb.manage.bills.renewal_date') }}</div>
        <div class="value">
          <div>
            <span>{{ formatUnix(company.expiryTime, '/', 'YYYY-MM-DD') }}</span>
            <span v-if="company.subscriptionStatus === 'canceled'" class="status-canceled">
              ({{ $t('wb.orders.canceled') }})
            </span>
          </div>
        </div>
      </div>
      <div class="detail-item ai-point">
        <div class="label">{{ $t('wb.ai_point') }}</div>
        <div class="value">
          <span>{{ company.aiPoint }}</span>
          <div class="btn">
            <n-button
              text
              size="tiny"
              type="info"
              class="value-btn"
              style="margin-right: 20px"
              @click="onShowAiPointLogs"
            >
              Logs
            </n-button>
            <n-button text size="tiny" type="info" class="value-btn" @click="onBuyAiPoint">Buy Point</n-button>
          </div>
        </div>
      </div>
      <div class="detail-item ai-point">
        <div class="label">{{ $t('wb.manage.orders.table_used_num') }}</div>
        <div class="value">
          <span>{{ company.tableUsed }} / {{ company.tableTotal }}</span>
        </div>
      </div>
    </div>
    <div class="plans">
      <div class="switch-bar">
        <div class="item-switch" :class="{ active: activeTab === 0 }" @click="activeTab = 0">Pay Monthly</div>
        <div class="item-switch" :class="{ active: activeTab === 1 }" @click="activeTab = 1">Pay Annually</div>
        <div class="active-tab" :style="tabStyle"></div>
      </div>
      <div class="plan-list">
        <div class="item-pricing free" :class="{ active: currentSubscribeType === 'FREE' }">
          <div class="item-title">Free</div>
          <div class="item-price">
            <div class="price">$0</div>
          </div>
          <n-spin :show="loading && subscriptionType === 'FREE'">
            <n-button
              :disabled="currentSubscribeType === 'FREE'"
              text
              class="btn-view"
              @click="onChooseSubscription('FREE')"
            >
              {{
                currentSubscribeType === 'FREE'
                  ? $t('wb.manage.bills.subscribe_current')
                  : $t('wb.manage.bills.subscribe_choose_free')
              }}
            </n-button>
          </n-spin>
          <ul class="info">
            <li class="info-item">
              <div class="info-label">Run Limit:</div>
              <div class="info-value"><b>100</b> runs/month</div>
            </li>
            <li class="info-item">
              <div class="info-label">Concurrency:</div>
              <div class="info-value"><b>1</b> concurrent run</div>
            </li>
            <li class="info-item">
              <div class="info-label">Batch Execution:</div>
              <div class="info-value">Not supported</div>
            </li>

            <li class="info-item">
              <div class="info-label">After-Sales:</div>
              <div class="info-value">None</div>
            </li>
          </ul>
        </div>
        <template v-if="activeTab === 0">
          <div class="item-pricing personal" :class="{ active: currentSubscribeType === 'PRO_MONTHLY' }">
            <div class="item-title">Professional</div>
            <div class="item-price">
              <div class="price">$100</div>
              <div class="type">/ {{ $t('wb.orders.month') }}</div>
            </div>
            <n-spin :show="loading && subscriptionType === 'PRO_MONTHLY'">
              <n-button
                :disabled="currentSubscribeType === 'PRO_MONTHLY'"
                class="btn-view"
                @click="onChooseSubscription('PRO_MONTHLY')"
              >
                {{ currentSubscribeType === 'PRO_MONTHLY' ? $t('wb.manage.bills.subscribe_current') : 'Choose Plan' }}
              </n-button>
            </n-spin>
            <ul class="info">
              <li class="info-item">
                <div class="info-label">Run Limit:</div>
                <div class="info-value"><b>5000</b> runs/month</div>
              </li>
              <li class="info-item">
                <div class="info-label">Concurrency:</div>
                <div class="info-value"><b>2</b> concurrent run</div>
              </li>
              <li class="info-item">
                <div class="info-label">Batch Execution:</div>
                <div class="info-value">Supported</div>
              </li>

              <li class="info-item">
                <div class="info-label">After-Sales:</div>
                <div class="info-value">Supported</div>
              </li>
            </ul>
          </div>
          <div class="item-pricing team" :class="{ active: currentSubscribeType === 'ADVANCED_MONTHLY' }">
            <div class="item-title">Advanced</div>
            <div class="item-price">
              <div class="price">$300</div>
              <div class="type">/ {{ $t('wb.orders.month') }}</div>
            </div>
            <n-spin :show="loading && subscriptionType === 'ADVANCED_MONTHLY'">
              <n-button class="btn-view" @click="onChooseSubscription('ADVANCED_MONTHLY')">
                {{
                  currentSubscribeType === 'ADVANCED_MONTHLY' ? $t('wb.manage.bills.subscribe_update') : 'Choose Plan'
                }}
              </n-button>
            </n-spin>

            <ul class="info">
              <li class="info-item">
                <div class="info-label">Run Limit:</div>
                <div class="info-value"><b>10000</b> runs/month</div>
              </li>
              <li class="info-item">
                <div class="info-label">Concurrency:</div>
                <div class="info-value"><b>5</b> concurrent run</div>
              </li>
              <li class="info-item">
                <div class="info-label">Batch Execution:</div>
                <div class="info-value">Supported</div>
              </li>

              <li class="info-item">
                <div class="info-label">After-Sales:</div>
                <div class="info-value">Supported</div>
              </li>
            </ul>
          </div>
        </template>
        <template v-if="activeTab === 1">
          <div class="item-pricing personal" :class="{ active: currentSubscribeType === 'PRO_YEARLY' }">
            <div class="item-title">Professional</div>
            <div class="item-price">
              <div class="price">$80</div>
              <div class="type">/ Month</div>

              <div class="price year-price">$960</div>
              <div class="type year-price">/ Year</div>
            </div>
            <n-spin :show="loading && subscriptionType === 'PRO_YEARLY'">
              <n-button
                :disabled="currentSubscribeType === 'PRO_YEARLY'"
                class="btn-view"
                @click="onChooseSubscription('PRO_YEARLY')"
              >
                {{ currentSubscribeType === 'PRO_YEARLY' ? $t('wb.manage.bills.subscribe_current') : 'Choose Plan' }}
              </n-button>
            </n-spin>
            <ul class="info">
              <li class="info-item">
                <div class="info-label">Run Limit:</div>
                <div class="info-value"><b>5000</b> runs/month</div>
              </li>
              <li class="info-item">
                <div class="info-label">Concurrency:</div>
                <div class="info-value"><b>2</b> concurrent run</div>
              </li>
              <li class="info-item">
                <div class="info-label">Batch Execution:</div>
                <div class="info-value">Supported</div>
              </li>

              <li class="info-item">
                <div class="info-label">After-Sales:</div>
                <div class="info-value">Supported</div>
              </li>
            </ul>
          </div>
          <div class="item-pricing team" :class="{ active: currentSubscribeType === 'ADVANCED_YEARLY' }">
            <div class="item-title">Advanced</div>
            <div class="item-price">
              <div class="price">$240</div>
              <div class="type">/ Month</div>

              <div class="price year-price">$2880</div>
              <div class="type year-price">/ Year</div>
            </div>
            <n-spin :show="loading && subscriptionType === 'ADVANCED_YEARLY'">
              <n-button class="btn-view" @click="onChooseSubscription('ADVANCED_YEARLY')">
                {{
                  currentSubscribeType === 'ADVANCED_YEARLY' ? $t('wb.manage.bills.subscribe_update') : 'Choose Plan'
                }}
              </n-button>
            </n-spin>

            <ul class="info">
              <li class="info-item">
                <div class="info-label">Run Limit:</div>
                <div class="info-value"><b>10000</b> runs/month</div>
              </li>
              <li class="info-item">
                <div class="info-label">Concurrency:</div>
                <div class="info-value"><b>5</b> concurrent run</div>
              </li>
              <li class="info-item">
                <div class="info-label">Batch Execution:</div>
                <div class="info-value">Supported</div>
              </li>

              <li class="info-item">
                <div class="info-label">After-Sales:</div>
                <div class="info-value">Supported</div>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { DialogReactive } from 'naive-ui'
import { IBSubscribeTypeAt, IBSubscribeTypeAtMap } from '@/types/workbench'
import { formatUnix } from '@/utils'
import { useCompanyStore } from '@/store/workbench'
import { useIbModal } from '@/hooks'
import { TestSubscribesApi } from '@/api/workbench'

const props = defineProps<{
  modal?: boolean
  dialog?: DialogReactive
}>()
const route = useRoute()
const ibModal = useIbModal()
const companyStore = useCompanyStore()
const company = computed(() => companyStore.company!)
const currentSubscribeType = computed(() => companyStore.company!.subscribeTypeAt)

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
        TestSubscribesApi.update('FREE')
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
const subscriptionType = ref<IBSubscribeTypeAt>()
const onChooseSubscription = async (type: IBSubscribeTypeAt) => {
  const { subscribeTypeAt } = company.value
  if (subscribeTypeAt !== 'FREE' && type === 'FREE') return onCancelPlan()
  subscriptionType.value = type
  loading.value = true
  try {
    if (!companyStore.subscriptionAt?.subscriptionId) {
      const url = await TestSubscribesApi.create(type)
      if (!props.modal) {
        window.location.href = url
      } else {
        getCompanyInfoLoop()
        window.open(url, '_blank')
      }
      return
    }
    await window.$confirm(window.$t('wb.subscribe_update_tip'), { type: 'warning' }, async () => {
      const res = await TestSubscribesApi.update(type)
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
ul.info {
  padding-left: 0;
}
.info-item {
  display: flex;
  align-items: center;
  width: 100%;
  line-height: 44px;
  .info-label,
  .info-value {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.7);
  }
  .info-label {
    width: 47%;
    text-align: right;
    padding-right: 12px;
  }
  .info-value {
    flex: 1;
    padding-left: 8px;
  }
}

.bills-subscription {
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
        .year-price {
          margin-left: 5px;
          font-size: 24px;
          color: #cccccc;
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
        .year-price {
          font-size: 18px;
          color: #cccccc;
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
  &.modal {
    .detail {
      display: none;
    }
    .plans {
      .item-pricing {
      }
    }
  }
}
</style>
