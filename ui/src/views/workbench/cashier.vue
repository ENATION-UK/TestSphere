<template>
  <div class="cashier" :class="{ modal: isModal }">
    <IbFullHeader v-if="!isModal" :title="$t('wb.orders.cashier')" @handle-click="handleCancel" />
    <div class="container" :class="{ loading: orderLoading }">
      <n-spin v-if="orderLoading" />
      <div v-if="order && !orderLoading && orderInfo.id" class="content">
        <div class="info-box">
          <div class="item-info">
            <div class="label">{{ $t('wb.orders.order_sn') }}</div>
            <div class="value">{{ orderInfo.id }}</div>
          </div>
          <div class="item-info order-status">
            <div class="label">{{ $t('wb.orders.order_status') }}</div>
            <div class="value" :class="[order.orderStatus]">{{ orderInfo.status }}</div>
          </div>
          <div class="item-info">
            <div class="label">{{ $t('wb.orders.order_type') }}</div>
            <div class="value">{{ orderInfo.type }}</div>
          </div>
          <div class="item-info">
            <div class="label">{{ $t('wb.orders.order_details') }}</div>
            <div class="value">{{ orderDetails }}</div>
          </div>
          <div class="item-info">
            <div class="label">{{ $t('wb.orders.pay_price') }}</div>
            <div class="value money">
              <span class="currency">{{ IBConfig.APP_CHINA ? '¥' : '$' }}</span>
              <span>{{ orderInfo.totalPrice }}</span>
            </div>
          </div>
        </div>
        <div v-if="order.orderStatus === 'pending'" class="payment-box">
          <div class="title-payment">{{ $t('wb.orders.payment') }}</div>
          <div class="payment-list">
            <div
              class="item-payment"
              :class="{ active: paymentId === 'alipayPayment' }"
              @click="pickPayment('alipayPayment')"
            >
              <n-icon size="30" color="#4676FB">
                <IconAliPay />
              </n-icon>
              <div class="name-payment">{{ $t('wb.orders.alipay') }}</div>
            </div>
            <div
              class="item-payment"
              :class="{ active: paymentId === 'wechatPayment' }"
              @click="pickPayment('wechatPayment')"
            >
              <n-icon size="28" color="#44b549">
                <IconWechatPay />
              </n-icon>
              <div class="name-payment">{{ $t('wb.orders.wechat_pay') }}</div>
            </div>
            <!--<div class="item-payment" :class="{ active: paymentId === 'CPAA' }" @click="pickPayment('CPAA')">
              <n-icon size="30" color="#F0CF37">
                <icon-bank-card />
              </n-icon>
              <div class="name-payment">{{ $t('wb.orders.public_pay1') }}</div>
            </div>-->
          </div>
          <div v-if="paymentId === 'wechatPayment'" class="wechat-pay-form">
            <div class="bg-box"></div>
            <div class="qrcode-box">
              <div class="qrcode-tip">{{ $t('wb.orders.wechat_pay_tip') }}</div>
              <n-spin :show="payLoading">
                <qrcode-vue :value="payRes" :size="160" @click="onPayNow" style="cursor: pointer" />
              </n-spin>
            </div>
          </div>
          <n-space v-if="paymentId === 'alipayPayment'" align="center" style="margin-top: 35px">
            <n-button type="info" :loading="payLoading" class="pay-btn" @click="onPayNow">
              {{ $t('wb.orders.pay_now') }}
            </n-button>
          </n-space>
        </div>
        <div v-else class="payment-box">
          <n-space>
            <n-button type="default" :loading="backLoading" @click="handleBack">
              <template #icon>
                <n-icon>
                  <MdArrowBack />
                </n-icon>
              </template>
              {{ $t('back') }}
            </n-button>
          </n-space>
        </div>
      </div>
    </div>
    <form
      v-if="paymentId === 'alipayPayment' && payRes"
      id="alipay-form"
      class="alipay-form"
      name="submit_form"
      method="post"
      target="_blank"
      :action="payRes"
    >
      <input type="submit" :value="$t('submit')" style="display: none" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MdArrowBack from '@vicons/ionicons4/MdArrowBack'
import { DialogReactive } from 'naive-ui'
import QrcodeVue from 'qrcode.vue'
import { IBMergeSubscribeTypeMap, IBOrder, IBOrderPlanDurationMap } from '@/types/workbench'
import { IBConfig } from '@/config'
import { useCompanyStore } from '@/store/workbench'
import { OrderApi } from '@/api/workbench'
import IconAliPay from '@/assets/icons/icon-alipay.svg'
import IconWechatPay from '@/assets/icons/icon-wechat-pay.svg'
import IbFullHeader from '@/components/IbFullHeader.vue'

const props = defineProps<{
  orderId?: string
  dialog?: DialogReactive
}>()
const route = useRoute()
const router = useRouter()
const companyStore = useCompanyStore()
const orderId = computed(() => {
  if (props.orderId) return props.orderId
  return useRoute().query.orderId as string
})
const isModal = computed(() => !!(props.orderId && props.dialog))
const order = ref<IBOrder>()
const orderLoading = ref(false)
const getOrder = async () => {
  if (!orderId.value) return
  try {
    orderLoading.value = true
    order.value = await OrderApi.detail(orderId.value)
  } finally {
    orderLoading.value = false
  }
}
onMounted(() => getOrder())
type PaymentType = 'alipayPayment' | 'wechatPayment' | 'CPAA'

const orderDetails = computed(() => {
  const { orderType, aiPoints, planType, planDuration, seatQuantity } = order.value
  if (orderType === 'point') {
    return window.$t('wb.orders.buy_num_ai_point', { num: aiPoints })
  }
  if (orderType === 'plan') {
    if (!planDuration) return '--'
    let text = window.$t(IBMergeSubscribeTypeMap[planType])
    text += `, ${window.$t(IBOrderPlanDurationMap[planDuration])}`
    if (seatQuantity) {
      text += `, ${seatQuantity} ${window.$t('wb.manage.bills.subscribe_seats')}`
    }
    return text
  }
  if (orderType === 'seat') {
    if (!seatQuantity) return '--'
    return `${seatQuantity} ${window.$t('wb.manage.bills.subscribe_seats')}`
  }
  return '--'
})

const orderInfo = computed<Record<string, any>>(() => {
  if (!order.value) return {}
  const { id, orderType, totalPrice, orderStatus } = order.value
  const info: Record<string, any> = {
    id,
    totalPrice,
    type: window.$t(`wb.orders.order_type_${orderType}`),
    status: window.$t(`wb.orders.order_status_${orderStatus}`)
  }
  return info
})

const paymentId = ref<PaymentType>('alipayPayment')
const payLoading = ref(false)
const payRes = ref('')

let timer: any = null
const getOrderStatusLoop = async () => {
  timer && clearTimeout(timer)
  const res = await OrderApi.detail(orderId.value)
  order.value = res
  if (res.orderStatus === 'pending') {
    timer = setTimeout(getOrderStatusLoop, 1000)
  } else if (res.orderStatus === 'paid') {
    aliPayDialog && aliPayDialog.destroy()
    companyStore.getCompanyInfo()
  }
}
onUnmounted(() => {
  timer && clearTimeout(timer)
})

const pickPayment = (type: PaymentType) => {
  paymentId.value = type
  payRes.value = ''
  timer && clearTimeout(timer)
  if (type === 'CPAA') {
  } else if (type === 'wechatPayment') {
    onPayNow()
  }
}

const onPayNow = async () => {
  payLoading.value = true
  try {
    payRes.value = await OrderApi.pay(order.value!.id, paymentId.value)
    if (paymentId.value === 'alipayPayment') {
      await nextTick()
      const alipayFormEl = document.getElementById('alipay-form') as HTMLFormElement
      alipayFormEl.submit()
      handleAliPay()
    }
    getOrderStatusLoop()
  } finally {
    payLoading.value = false
  }
}
let aliPayDialog: DialogReactive
const handleAliPay = async () => {
  aliPayDialog = window.$dialog.create({
    title: window.$t('wb.orders.pay_tip'),
    content: window.$t('wb.orders.has_pay_finish'),
    closable: false,
    closeOnEsc: false,
    maskClosable: false,
    positiveText: window.$t('wb.orders.pay_finish'),
    negativeText: window.$t('wb.orders.pay_align'),
    onPositiveClick: handleBack,
    onNegativeClick: () => {
      timer && clearTimeout(timer)
    }
  })
}
const backLoading = ref(false)
const handleBack = async () => {
  timer && clearTimeout(timer)
  backLoading.value = true
  try {
    await companyStore.getCompanyInfo()
  } finally {
    backLoading.value = false
  }
  if (props.dialog) {
    props.dialog.destroy()
    return
  }
  let backName = 'enterpriseOrders'
  const { back } = route.query
  if (back) backName = back as string
  backName && router.replace({ name: backName })
}
const handleCancel = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.cashier {
  width: 100vw;
  padding-bottom: 30px;
  background-color: #eeeeee;
  &.modal {
    width: 100%;
    height: 100%;
    .container {
      width: 100%;
      .info-box {
        margin-top: 0;
      }
    }
  }
  :deep(.ib-full-header) .ib-logo {
    cursor: pointer;
  }
  .container {
    position: relative;
    width: 1200px;
    min-height: 300px;
    margin: 0 auto;
    margin-top: 30px;
    padding-bottom: 48px;
    background-color: #ffffff;
    overflow: hidden;
    border-radius: 8px;
    &.loading {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &.modal {
      width: 100%;
    }
  }
  .content {
    width: 600px;
    margin: 0 auto;
  }
  .info-box {
    margin-top: 70px;
    padding-bottom: 24px;
    .item-info {
      display: flex;
      align-items: baseline;
      & + .item-info {
        margin-top: 30px;
      }
      .label {
        width: 150px;
        text-align: right;
        font-size: 18px;
        font-weight: bold;
      }
      .value {
        font-size: 18px;
        margin-left: 24px;
        &.money {
          display: flex;
          align-items: baseline;
          font-size: 22px;
          color: red;
          .currency {
            font-size: 16px;
            margin-right: 4px;
          }
        }
      }
      &.order-status {
        .value {
          &.paid,
          &.invoiced {
            color: var(--success-color);
          }
        }
      }
    }
  }
  .payment-box {
    padding-top: 24px;
    padding-bottom: 24px;
    border-top: 1px dashed var(--border-color);
    .title-payment {
      font-size: 18px;
      font-weight: bold;
    }
    .payment-list {
      display: flex;
      margin-top: 24px;
    }
    .item-payment {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 175px;
      height: 60px;
      border: 1px solid #cccccc;
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.2s var(--bezier);
      &.active {
        border-color: #0c72f7;
      }
      & + .item-payment {
        margin-left: 37px;
      }
    }
    .name-payment {
      font-size: 18px;
      margin-left: 12px;
    }
    .pay-btn {
      min-width: 100px;
    }
  }
  .alipay-form {
    display: none;
  }
  .wechat-pay-form {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 600px;
    height: 200px;
    margin-top: 20px;
    box-sizing: content-box;
    padding: 24px 0;
    border-top: 1px dashed #cccccc;
    .bg-box {
      position: relative;
      width: 200px;
      height: 200px;
      background-image: url('@/assets/bg-wechat.jpg');
      background-size: cover;
      background-repeat: no-repeat;
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        right: -50px;
        margin-top: -40px;
        width: 1px;
        height: 80px;
        background-color: #cccccc;
      }
    }
    .qrcode-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 200px;
      height: 200px;
      .qrcode-tip {
        margin-bottom: 24px;
      }
    }
  }
}
</style>
