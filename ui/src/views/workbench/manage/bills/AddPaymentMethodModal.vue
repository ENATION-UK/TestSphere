<template>
  <n-modal
    v-model:show="showModal"
    :closable="false"
    :show-icon="false"
    :close-on-esc="false"
    :mask-closable="false"
    :auto-focus="false"
    :loading="saveLoading"
    transform-origin="center"
    :negative-text="$t('cancel')"
    :positive-text="$t('confirm')"
    :positive-button-props="{ disabled: !cardComplete || !addressComplete }"
    @negative-click="promise.reject"
    @positive-click="handlePositiveClick"
    preset="dialog"
    style="width: 650px"
  >
    <n-form ref="formRef" :model="form" :rules="formRules" show-require-mark label-placement="top">
      <n-form-item label="Gard information" path="card">
        <div class="stripe-element card" id="card-element"></div>
      </n-form-item>
      <n-form-item label="Billing address" path="address">
        <div class="stripe-element" id="address-element"></div>
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { Stripe, StripeAddressElement, StripeCardElement } from '@stripe/stripe-js'
import { FormInst, FormRules } from 'naive-ui'
import { useIbStripe } from '@/hooks/useIbStripe'
import { PaymentMethodApi } from '@/api/workbench'

const promise = {
  resolve: (value?: any) => {},
  reject: (e?: any) => {}
}
const showModal = ref(false)
const show = () => {
  return new Promise((resolve, reject) => {
    promise.resolve = resolve
    promise.reject = reject
    showModal.value = true
    loadStripeElements()
  })
}

const cardComplete = ref(false)
const addressComplete = ref(false)
const form = ref<Record<string, any>>({
  billAddress: {}
})
const formRules: FormRules = {}
const formRef = ref<FormInst>()
let stripe: Stripe | null
let cardElement: StripeCardElement
let addressElement: StripeAddressElement
const ibStripe = useIbStripe()
const loadStripeElements = async () => {
  stripe = await ibStripe.loadStripe()
  if (!stripe) return
  const elements = stripe.elements({})
  cardElement = elements.create('card')
  cardElement.mount('#card-element')
  cardElement.on('change', (event) => {
    cardComplete.value = event.complete
  })
  addressElement = elements.create('address', {
    mode: 'billing',
    display: { name: 'organization' }
  })
  addressElement.mount('#address-element')
  addressElement.on('change', (event) => {
    addressComplete.value = event.complete
    form.value['billAddress'] = event.value
  })
}
const saveLoading = ref(false)
const handlePositiveClick = async () => {
  if (!stripe) return false
  saveLoading.value = true
  try {
    const address = (await addressElement.getValue()) as Record<string, any>
    if (!address.complete) return false
    delete address['isNewAddress']
    delete address['complete']
    delete address['value']
    const res = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: address
    })
    const { id } = res.paymentMethod || {}
    if (!id) return
    await PaymentMethodApi.add(id)
    window.$message.success(window.$t('save_success'))
    promise.resolve(res)
  } catch (e) {
    return false
  } finally {
    saveLoading.value = false
  }
}

onUnmounted(() => {
  cardElement?.destroy()
  addressElement?.destroy()
})
defineExpose({ show })
</script>

<style scoped lang="scss">
.stripe-element {
  width: 100%;
  height: 100%;
  &.card {
    display: flex;
    align-items: center;
    padding: 0 12px;
    box-sizing: border-box;
    border: 1px solid #e6e6e6;
    box-shadow:
      0 1px 1px rgba(0, 0, 0, 0.03),
      0 3px 6px rgba(0, 0, 0, 0.02);
    & > :deep(div) {
      width: 100%;
    }
  }
}
</style>
