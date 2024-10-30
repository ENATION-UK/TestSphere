<template>
  <n-modal
    v-model:show="showModal"
    :title="$t('wb.manage.bills.subscribe_buy_title')"
    :show-icon="false"
    :close-on-esc="false"
    :mask-closable="false"
    :auto-focus="false"
    @close="handleCloseModal"
    transform-origin="center"
    preset="dialog"
    style="width: 500px"
  >
    <div class="modal-hr top"></div>
    <n-alert type="warning" :show-icon="false">
      {{ $t('wb.manage.bills.subscribe_buy_tip') }}
    </n-alert>
    <div class="buy-bum">
      <n-form-item
        size="large"
        :label="$t('wb.manage.bills.subscribe_buy_label')"
        label-placement="left"
        label-align="left"
        :show-feedback="false"
      >
        <n-input-number
          v-model:value="buyNum"
          :step="1000"
          :min="1000"
          :max="100000000000"
          button-placement="both"
          placeholder=""
        />
      </n-form-item>
    </div>
    <div class="modal-hr bottom"></div>
    <template #action>
      <div class="amount">{{ amount }}</div>
      <n-button size="small" type="primary" :disabled="buyNum < 1000" :loading="buyLoading" @click="onCheckout">
        {{ $t('wb.manage.bills.subscribe_buy_btn') }}
      </n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, h, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { IBConfig } from '@/config'
import { useCompanyStore } from '@/store/workbench'
import { AiPointApi } from '@/api/workbench'

const showModal = ref(false)
const modalCashier = ref(false)
const buyLoading = ref(false)
const companyStore = useCompanyStore()
let oldAiPoint = companyStore.company?.aiPoint || 0
const show = (modal = false) => {
  modalCashier.value = modal
  buyNum.value = 1000
  oldAiPoint = companyStore.company?.aiPoint || 0
  buyLoading.value = false
  showModal.value = true
}
const router = useRouter()
const buyNum = ref(1000)
watch(
  () => buyNum.value,
  (newVal) => {
    if (!newVal) {
      buyNum.value = 1000
    }
  }
)
watch(
  () => showModal.value,
  (newVal) => {
    if (newVal) return
    if (aiPointTimer) clearTimeout(aiPointTimer)
  }
)
const amount = computed(() => {
  return `${IBConfig.APP_CHINA ? '￥' : '$'}${(buyNum.value * (IBConfig.APP_CHINA ? 1 : 0.5)) / 1000}`
})
let aiPointTimer: any = null
onUnmounted(() => {
  if (aiPointTimer) clearTimeout(aiPointTimer)
})
const handleCloseModal = () => {
  companyStore.getCompanyInfo()
  buyLoading.value = false
  if (aiPointTimer) clearTimeout(aiPointTimer)
}
const getAiPointLoop = async () => {
  if (aiPointTimer) clearTimeout(aiPointTimer)
  await companyStore.getCompanyInfo()
  const newAiPoint = companyStore.company!.aiPoint
  if (newAiPoint === oldAiPoint) {
    aiPointTimer = setTimeout(getAiPointLoop, 1000)
  } else {
    clearTimeout(aiPointTimer)
    buyLoading.value = false
    showModal.value = false
  }
}
const cashierPage = defineAsyncComponent(() => import('@/views/workbench/cashier.vue'))
const onCheckout = async () => {
  if (buyLoading.value) return
  buyLoading.value = true
  try {
    if (!IBConfig.APP_CHINA) {
      const url = await AiPointApi.buyGlobal(buyNum.value)
      if (!modalCashier.value) {
        window.location.href = url
      } else {
        getAiPointLoop()
        window.open(url, '_blank')
      }
      return
    }
    const orderId = await AiPointApi.buyChina(buyNum.value)
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
    buyLoading.value = false
    setTimeout(() => {
      showModal.value = false
    }, 500)
  } catch (e) {
    buyLoading.value = false
  }
}
defineExpose({ show })
</script>

<style scoped lang="scss">
.plan-list {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.buy-bum {
  display: flex;
  justify-content: center;
  margin: 12px 0;
  :deep(.n-input) {
    text-align: center;
  }
}
.amount {
  display: flex;
  align-items: center;
  color: red;
  font-size: 16px;
  font-weight: bold;
}
</style>
