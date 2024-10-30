<template>
  <n-modal
    v-model:show="showModal"
    :title="$t('wb.manage.orders.buy_seats')"
    :close-on-esc="false"
    :mask-closable="false"
    :show-icon="false"
    :auto-focus="false"
    :negative-text="$t('cancel')"
    :loading="submitLoading"
    :positive-text="$t('wb.manage.buy_seats.submit_order')"
    @positive-click="submitOrder"
    transform-origin="center"
    preset="dialog"
  >
    <div class="modal-hr top"></div>
    <div class="buy-seats-modal">
      <div class="plan-info">
        <div class="info-item">
          <div class="label">{{ $t('wb.manage.orders.version_info') }}:</div>
          <div class="value">{{ subscriptionText }}</div>
        </div>
        <div class="info-item">
          <div class="label">{{ $t('wb.manage.orders.exp_time') }}:</div>
          <div class="value">{{ expiryTime }}</div>
        </div>
        <div v-if="remainingText" class="info-item">
          <div class="label">{{ $t('wb.duration') }}:</div>
          <div class="value">{{ remainingText }}</div>
        </div>
      </div>
      <div class="buy-box">
        <div class="buy-item">
          <div class="label">{{ $t('wb.manage.buy_seats.buy_num') }}</div>
          <div class="value">
            <n-input-number
              v-model:value="buyNum"
              size="small"
              :min="1"
              button-placement="both"
              style="width: 100px; text-align: center"
              placeholder=""
            />
          </div>
        </div>
        <div class="buy-item">
          <div class="label">{{ $t('wb.orders.need_pay') }}</div>
          <div class="value price">
            <span class="currency">￥</span>
            <span class="money">{{ priceDetail?.finalPrice }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-hr bottom"></div>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { IBOrderPriceDetail, IBSubscribeTypeDbMap } from '@/types/workbench'
import { formatUnix } from '@/utils'
import { useCompanyStore } from '@/store/workbench'
import { OrderApi } from '@/api/workbench'

const router = useRouter()
const companyStore = useCompanyStore()

const showModal = ref(false)
const buyNum = ref(1)
const priceDetail = ref<IBOrderPriceDetail>()
const expiryTime = computed(() => {
  if (!companyStore.subscriptionDb) return '/'
  return formatUnix(companyStore.subscriptionDb.expiryTime, '/', 'YYYY-MM-DD')
})
const subscriptionText = computed(() => {
  if (!companyStore.subscriptionDb) return ''
  const subType = companyStore.subscriptionDb.subscribeType || 'FREE'
  return window.$t(IBSubscribeTypeDbMap[subType])
})
const remainingText = computed<string>(() => {
  if (!priceDetail.value) return ''
  let text = ''
  const { yearRemaining, monthRemaining, dayRemaining } = priceDetail.value!
  if (yearRemaining) text += `${yearRemaining}${window.$t('wb.orders.year').toLowerCase()}`
  if (monthRemaining) text += `${monthRemaining}${window.$t('wb.orders.month').toLowerCase()}`
  if (dayRemaining) text += `${dayRemaining}${window.$t('wb.orders.day').toLowerCase()}`
  return text
})
const computedSeatPrice = async () => {
  if (!showModal.value) return
  priceDetail.value = await OrderApi.computedSeatPrice(buyNum.value)
}
watch(
  () => buyNum.value,
  () => computedSeatPrice(),
  { deep: true }
)

const submitLoading = ref(false)
const submitOrder = async () => {
  submitLoading.value = true
  try {
    const orderId = await OrderApi.createSeatOrder(buyNum.value)
    showModal.value = false
    await router.push(`/cashier?orderId=${orderId}`)
  } finally {
    submitLoading.value = false
  }
}

const show = () => {
  showModal.value = true
  buyNum.value = 1
  companyStore.getSubscriptions()
  computedSeatPrice()
}
defineExpose({ show })
</script>

<style scoped lang="scss">
.plan-info {
  .info-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-bottom: 4px;
    .value {
      font-weight: bold;
      margin-left: 15px;
    }
  }
}
.buy-box {
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px dashed var(--border-color);
  font-size: 16px;
  font-weight: bold;
  .buy-item {
    display: flex;
    align-items: center;
    &:not(:last-child) {
      margin-bottom: 4px;
    }
    .value {
      margin-left: 15px;
      &.price {
        color: red;
        .currency {
          font-size: 12px;
          font-weight: normal;
        }
        .money {
          font-size: 18px;
        }
      }
    }
  }
}
</style>
