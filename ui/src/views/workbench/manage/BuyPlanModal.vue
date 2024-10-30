<template>
  <n-modal
    v-model:show="showModal"
    :close-on-esc="false"
    :mask-closable="false"
    :show-icon="false"
    :auto-focus="false"
    transform-origin="center"
    preset="dialog"
    :style="modalStyles"
    class="buy-plan-modal"
  >
    <div class="buy-plan">
      <div class="equity-box">
        <div class="inner-equity">
          <img src="@/assets/icons/icon-equity.png" class="icon-equity" alt="" />
          <div class="title-equity">{{ equityTitle }}</div>
          <div class="hr-equity"></div>
          <div class="list-equity">
            <div v-for="(item, index) in equities" :key="index" class="item-list-equity">
              {{ $t(`wb.manage.buy_seats.${item}`) }}
            </div>
          </div>
        </div>
      </div>
      <div class="plan-box">
        <div class="plan-title">{{ company.companyName }}</div>
        <div v-if="params.productType === 'dbdesign'" class="plan-type">
          <div
            v-if="company.subscribeTypeDb !== 'PERSONAL'"
            class="item-plan personal"
            :class="{ active: params.plan === 'PERSONAL' }"
            @click="params.plan = 'PERSONAL'"
          >
            <div class="label-plan">{{ $t('wb.manage.buy_seats.personal_edition') }}</div>
            <div class="price-plan">
              <span class="currency">¥</span>
              <span class="money">80</span>
              <span>/{{ $t('wb.manage.buy_seats.year') }}</span>
            </div>
            <div class="tip-plan">{{ $t('wb.manage.buy_seats.personal_use') }}</div>
          </div>
          <div class="item-plan team" :class="{ active: params.plan === 'TEAM' }" @click="params.plan = 'TEAM'">
            <div class="label-plan">{{ $t('wb.manage.buy_seats.team_edition') }}</div>
            <div class="price-plan">
              <span class="currency">¥</span>
              <span class="money">100</span>
              <span>/{{ $t('wb.manage.buy_seats.people') }}/{{ $t('wb.manage.buy_seats.year') }}</span>
            </div>
            <div class="tip-plan">{{ $t('wb.manage.buy_seats.team_use') }}</div>
          </div>
        </div>
        <div v-if="params.productType === 'autotest'" class="plan-type">
          <div
            v-if="company.subscribeTypeAt !== 'PROFESSIONAL'"
            class="item-plan personal"
            :class="{ active: params.plan === 'PROFESSIONAL' }"
            @click="params.plan = 'PROFESSIONAL'"
          >
            <div class="label-plan">{{ $t('wb.subscribe_type_professional') }}</div>
            <div class="price-plan">
              <span class="currency">¥</span>
              <span class="money">2400</span>
              <span>/{{ $t('wb.manage.buy_seats.year') }}</span>
            </div>
            <div class="tip-plan">{{ $t('wb.manage.buy_seats.professional_use') }}</div>
          </div>
          <div class="item-plan team" :class="{ active: params.plan === 'ADVANCED' }" @click="params.plan = 'ADVANCED'">
            <div class="label-plan">{{ $t('wb.subscribe_type_advanced') }}</div>
            <div class="price-plan">
              <span class="currency">¥</span>
              <span class="money">5000</span>
              <span>/{{ $t('wb.manage.buy_seats.year') }}</span>
            </div>
            <div class="tip-plan">{{ $t('wb.manage.buy_seats.advanced_use') }}</div>
          </div>
        </div>
        <div class="plan-title">{{ $t('wb.manage.buy_seats.buy_time') }}</div>
        <div class="plan-time">
          <div
            v-for="item in durations"
            :key="item.key"
            class="item-time"
            :class="{ active: params.duration === item.value }"
            @click="params.duration = item.value"
          >
            {{ item.key }}{{ $t('wb.manage.buy_seats.year') }}
            <span v-if="item.key === 2" class="discount">{{ $t('wb.manage.buy_seats.discount_10') }}</span>
            <span v-if="item.key === 3" class="discount">{{ $t('wb.manage.buy_seats.discount_20') }}</span>
          </div>
        </div>
        <div v-if="params.plan === 'TEAM'" class="plan-title buy-num">
          {{ $t('wb.manage.buy_seats.buy_num') }}
          <n-input-number
            v-model:value="params.seatQuantity"
            :min="2"
            :max="9999999"
            size="small"
            button-placement="both"
            placeholder=""
            class="buy-num-input"
            @blur="handleBuyNumInputBlur"
          />
        </div>
        <div class="plan-checkout">
          <div class="price-total">
            <span class="amount-label">{{ $t('wb.manage.buy_seats.amount') }}</span>
            <div v-if="priceDetail" class="price-box">
              <n-spin :show="computedPriceLoading" size="small">
                <span class="currency">¥</span>
                <span class="money">{{ priceDetail.finalPrice }}</span>
              </n-spin>
            </div>
            <n-popover v-if="priceDetailObj">
              <template #trigger>
                <n-icon class="icon-info">
                  <Info24Filled />
                </n-icon>
              </template>
              <div class="price-detail">
                <div class="label">
                  <p>{{ priceDetailObj.need_pay.label }}:</p>
                  <p v-if="priceDetailObj.paid?.value">{{ priceDetailObj.paid.label }}:</p>
                  <p v-if="priceDetailObj.remaining?.value">{{ priceDetailObj.remaining.label }}:</p>
                  <p v-if="priceDetailObj.deduction?.value">{{ priceDetailObj.deduction.label }}:</p>
                </div>
                <div class="value">
                  <p>{{ priceDetailObj.need_pay.value }}</p>
                  <p v-if="priceDetailObj.paid?.value">{{ priceDetailObj.paid.value }}</p>
                  <p v-if="priceDetailObj.remaining?.value">{{ priceDetailObj.remaining.value }}</p>
                  <p v-if="priceDetailObj.deduction?.value">{{ priceDetailObj.deduction.value }}</p>
                </div>
              </div>
            </n-popover>
          </div>
          <n-button
            size="small"
            type="primary"
            :disabled="computedPriceLoading"
            :loading="submitLoading"
            class="submit-btn"
            @click="submitOrder"
          >
            {{ $t('wb.manage.buy_seats.submit_order') }}
          </n-button>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, h, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Info24Filled from '@vicons/fluent/Info24Filled'
import { cloneDeep } from 'lodash-es'
import { IBProductType } from '@/types'
import { IBMergeSubscribeType, IBOrderPriceDetail, IBOrderPriceParams, IBSubscribeTypeDbMap } from '@/types/workbench'
import { useCompanyStore } from '@/store/workbench'
import { OrderApi } from '@/api/workbench'

interface BuyPlanModalProps {
  modal?: boolean
  type?: IBProductType
  plan?: IBMergeSubscribeType
}

const router = useRouter()
const companyStore = useCompanyStore()
const company = computed(() => companyStore.company!)
const modalCashier = ref(false)
const showModal = ref(false)
const show = (options?: BuyPlanModalProps) => {
  modalCashier.value = options?.modal || false
  if (options?.type === 'autotest') {
    params.value.productType = 'autotest'
    params.value.plan = options?.plan || 'PROFESSIONAL'
    params.value.seatQuantity = 0
  } else {
    params.value.productType = 'dbdesign'
    params.value.plan = options?.plan || 'TEAM'
    params.value.seatQuantity = 2
  }
  showModal.value = true
  computedPrice()
}
const modalStyles = {
  width: 'calc(100vw - 32px)',
  maxWidth: '886px',
  borderRadius: '8px',
  padding: 0,
  overflow: 'hidden',
  '--n-content-margin': 0
}
const equityTitle = computed(() => {
  switch (params.value.plan) {
    case 'PERSONAL':
      return window.$t('wb.manage.buy_seats.title_version_personal')
    case 'TEAM':
      return window.$t('wb.manage.buy_seats.title_version_team')
    case 'PROFESSIONAL':
      return window.$t('wb.manage.buy_seats.title_version_professional')
    case 'ADVANCED':
      return window.$t('wb.manage.buy_seats.title_version_advanced')
  }
})
const teamEquities = ['equity_team_1', 'equity_team_2', 'equity_team_3', 'equity_team_4']
const personalEquities = ['equity_personal_1', 'equity_personal_2', 'equity_personal_4', 'equity_personal_5']
const professionalEquities = [
  'equity_professional_1',
  'equity_professional_2',
  'equity_professional_3',
  'equity_professional_4',
  'equity_professional_5'
]
const advancedEquities = [
  'equity_advanced_1',
  'equity_advanced_2',
  'equity_advanced_3',
  'equity_advanced_4',
  'equity_advanced_5'
]
const equities = computed(() => {
  switch (params.value.plan) {
    case 'PERSONAL':
      return personalEquities
    case 'TEAM':
      return teamEquities
    case 'PROFESSIONAL':
      return professionalEquities
    case 'ADVANCED':
      return advancedEquities
  }
})
const durations: { key: number; value: 'oneYear' | 'towYear' | 'threeYear' }[] = [
  { key: 1, value: 'oneYear' },
  { key: 2, value: 'towYear' },
  { key: 3, value: 'threeYear' }
]
const params = ref<IBOrderPriceParams>({
  duration: 'oneYear',
  plan: 'TEAM',
  seatQuantity: 2,
  productType: 'dbdesign'
})

const priceDetail = ref<IBOrderPriceDetail>()

interface PriceDetailObj {
  need_pay: { label: string; value: string }
  paid?: { label: string; value: string }
  remaining?: { label: string; value: string }
  deduction?: { label: string; value: string }
}

const priceDetailObj = computed<PriceDetailObj | null>(() => {
  if (!priceDetail.value) return null
  const { subscribeTypeDb } = company.value
  const { plan, seatQuantity, duration } = params.value
  // 如果不是个人版升级团队版，不显示明细
  // TODO
  if (subscribeTypeDb !== 'PERSONAL' || plan !== 'TEAM') return null
  const { planCost, amountRemaining, dayRemaining, monthRemaining, yearRemaining } = priceDetail.value
  const ver_str = window.$t(IBSubscribeTypeDbMap[plan])
  let price = plan === 'TEAM' ? 100 : 80
  price = price * (plan === 'TEAM' ? seatQuantity : 1)
  switch (duration) {
    case 'towYear':
      price *= 2
      price *= 0.9
      break
    case 'threeYear':
      price *= 3
      price *= 0.8
      break
  }
  const obj: PriceDetailObj = {
    need_pay: {
      label: window.$t('wb.version_need_pay', { version: ver_str }),
      value: `￥${price.toFixed(2)}`
    }
  }
  const cur_ver_str = window.$t(IBSubscribeTypeDbMap[company.value.subscribeTypeDb])
  obj.paid = {
    label: window.$t('wb.version_paid', { version: cur_ver_str }),
    value: `￥${planCost || 0.0}`
  }
  let remainingLabel = `${cur_ver_str}${window.$t('wb.duration')}`
  let remainingValue = ''
  if (yearRemaining) remainingValue += `${yearRemaining}${window.$t('wb.orders.year').toLowerCase()}`
  if (monthRemaining) remainingValue += `${monthRemaining}${window.$t('wb.orders.month').toLowerCase()}`
  if (dayRemaining) remainingValue += `${dayRemaining}${window.$t('wb.orders.day').toLowerCase()}`
  obj.remaining = { label: remainingLabel, value: remainingValue }
  obj.deduction = {
    label: window.$t('wb.version_deduction', { version: cur_ver_str }),
    value: `￥${amountRemaining || 0.0}`
  }
  return obj
})
const computedPriceLoading = ref(false)

const computedPrice = async () => {
  if (!showModal.value) return
  computedPriceLoading.value = true
  const p = cloneDeep(params.value)
  if (p.plan === 'PERSONAL') {
    p.seatQuantity = 1
  }
  if (p.plan === 'TEAM') {
    const { seatQuantity } = p
    if (!seatQuantity || seatQuantity < 2) {
      computedPriceLoading.value = false
      return
    }
  }
  try {
    priceDetail.value = await OrderApi.computedPrice(p)
  } finally {
    computedPriceLoading.value = false
  }
}
const handleBuyNumInputBlur = () => {
  const { seatQuantity } = params.value
  if (!seatQuantity || seatQuantity < 2) {
    params.value.seatQuantity = 2
  }
}
watch(() => params.value, computedPrice, { immediate: true, deep: true })

const cashierPage = defineAsyncComponent(() => import('@/views/workbench/cashier.vue'))
const submitLoading = ref(false)
const submitOrder = async () => {
  submitLoading.value = true
  try {
    const orderId = await OrderApi.createOrder(params.value)
    if (!modalCashier.value) {
      router.push(`/cashier?orderId=${orderId}`)
      showModal.value = false
      return
    }
    const dialog = window.$dialog.create({
      title: window.$t('wb.orders.cashier'),
      showIcon: false,
      maskClosable: false,
      closeOnEsc: false,
      autoFocus: false,
      content: () => h(cashierPage, { modal: true, orderId, dialog }),
      transformOrigin: 'center',
      style: `width: 900px`
    })
    setTimeout(() => {
      showModal.value = false
    }, 500)
  } finally {
    submitLoading.value = false
  }
}

defineExpose({ show })
</script>

<style scoped lang="scss">
.buy-plan {
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 557px;
  background: linear-gradient(180deg, #fff6e0 0%, #fff8e8 100%);
  .equity-box {
    position: relative;
    z-index: 1;
    width: 294px;
    flex: 0 0 294px;
    padding: 60px 0 0;
    &::after {
      content: ' ';
      display: inline-block;
      position: absolute;
      left: 0;
      top: 0;
      right: -10px;
      bottom: 0;
      height: 100%;
      z-index: 0;
      background: url('@/assets/bg-buy-seats-left.png') left top/cover no-repeat;
    }
    .inner-equity {
      position: relative;
      z-index: 2;
      width: calc(100% - 74px);
      margin-left: auto;
      margin-right: auto;
      .icon-equity {
        display: block;
        width: 35px;
        margin: 0 auto;
      }
      .title-equity {
        display: flex;
        align-items: center;
        color: #733306;
        font-weight: 600;
        font-size: 20px;
        margin: 11px 0 13px;
        white-space: pre-line;
      }
      .hr-equity {
        width: 100%;
        height: 1px;
        background-color: #7333061a;
      }
      .list-equity {
        margin-top: 24px;
        text-align: left;
        .item-list-equity {
          font-size: 14px;
          line-height: 20px;
          position: relative;
          color: #733306;
          padding-left: 10px;
          & + .item-list-equity {
            margin-top: 20px;
          }
          &::after {
            content: '';
            display: inline-block;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 4px;
            height: 4px;
            background: #733306;
            border-radius: 50%;
          }
        }
      }
    }
  }
  .plan-box {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    flex: 1;
    border-radius: 8px;
    background-color: #ffffff;
    padding: 28px 24px 0;
    .plan-title {
      font-weight: 600;
      font-size: 20px;
      line-height: 28px;
      margin-bottom: 20px;
    }
    .plan-type {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      .item-plan {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 2px solid #f7f7f9;
        width: 47%;
        background-color: #f7f7f9;
        border-radius: 8px;
        height: 150px;
        padding: 28px 10px 0;
        overflow: hidden;
        user-select: none;
        cursor: pointer;
        transition: all 0.2s var(--bezier);
        &.active {
          background-color: #ffebbe;
          border-color: #ffd26c;
          cursor: auto;
          .tip-plan {
            color: #733306;
            background-color: #ffd26c;
          }
        }
        &:hover {
          border-color: #ffd26c;
        }
        .label-plan {
          font-weight: 600;
          font-size: 18px;
        }
        .price-plan {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          font-weight: 600;
          font-size: 20px;
          line-height: 36px;
          margin-top: 12px;
          .currency {
            line-height: 28px;
            margin-right: 4px;
          }
          .money {
            font-size: 32px;
          }
        }
        .tip-plan {
          position: absolute;
          left: 0;
          right: -0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 30px;
          font-size: 12px;
          font-weight: 500;
          color: #555557;
          background-color: #edeef0;
          transition: all 0.2s var(--bezier);
        }
      }
    }
    .plan-time {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      .item-time {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        font-weight: bold;
        font-size: 16px;
        color: #1d2124;
        width: 150px;
        height: 78px;
        border: 2px solid #f1f1f1;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s var(--bezier);
        &.active {
          cursor: auto;
        }
        &:hover,
        &.active {
          border-color: #ffd26c;
        }
        .discount {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: -1px;
          top: -12px;
          color: #ffffff;
          font-size: 14px;
          padding: 2px 8px;
          height: 24px;
          min-width: 70px;
          background: linear-gradient(86.33deg, #f26957 -10.07%, #ff2d78 115.66%);
          border-radius: 10px 0;
        }
      }
    }
    .buy-num {
      display: flex;
      align-items: center;
      margin-top: 10px;
      .buy-num-input {
        margin-left: 24px;
        width: 120px;
        text-align: center;
      }
    }
    .plan-checkout {
      position: absolute;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: calc(100% - 48px);
      height: 75px;
      border-top: 1px solid #e9e9e9;
      box-sizing: border-box;
      .price-total {
        display: flex;
        align-items: center;
        .amount-label {
          font-size: 16px;
          font-weight: bold;
        }
        .price-box {
          display: flex;
          align-items: flex-end;
          color: red;
          margin-left: 4px;
          :deep(.n-spin-content) {
            display: flex;
            align-items: flex-end;
          }
          .currency {
            font-size: 16px;
            margin-right: 2px;
            margin-bottom: 2px;
          }
          .money {
            font-size: 20px;
            font-weight: bold;
            margin-right: 2px;
          }
        }
        .icon-info {
          color: var(--warning-color);
          font-size: 18px;
        }
      }
      .submit-btn {
        min-width: 90px;
        margin-left: 12px;
      }
    }
  }
}
.price-detail {
  display: flex;
  .label {
    text-align: right;
  }
  .value {
    padding-left: 10px;
  }
}
</style>
<style lang="scss">
.buy-plan-modal {
  .n-base-close {
    z-index: 10;
  }
}
</style>
