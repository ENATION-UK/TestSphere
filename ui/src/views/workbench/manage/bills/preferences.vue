<template>
  <div class="preferences" :class="{ modal }">
    <div class="tips">
      <i18n-t keypath="wb.manage.bills.preferences_tips"> ar@itbuilder.ai</i18n-t>
    </div>
    <n-form ref="formRef" :model="form" :rules="rules" :show-label="false">
      <div class="title require">{{ $t('wb.manage.bills.preferences_title_email') }}</div>
      <div class="tips">{{ $t('wb.manage.bills.preferences_title_email_tip') }}</div>
      <n-form-item path="email">
        <n-input v-model:value="form.email" style="width: 300px" placeholder="" />
      </n-form-item>
      <div class="title require">{{ $t('wb.manage.bills.preferences_title_address') }}</div>
      <div class="tips">{{ $t('wb.manage.bills.preferences_title_address_tip') }}</div>
      <div id="stripe-address" class="stripe-address"></div>
      <div class="title" style="margin-top: 24px">{{ $t('wb.manage.bills.preferences_title_business_tax_ID') }}</div>
      <div class="tips">{{ $t('wb.manage.bills.preferences_title_business_tax_ID_tip') }}</div>
      <n-form-item path="tax.taxId">
        <n-select v-model:value="form.tax.taxType" :options="taxOptions" filterable clearable style="width: 120px" />
        <n-input v-model:value="form.tax.taxId" clearable style="width: 170px; margin-left: 10px" placeholder="" />
      </n-form-item>
    </n-form>
    <n-button type="info" size="small" :loading="saveLoading" style="width: 70px" @click="onSaveForm">
      {{ $t('wb.save') }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Stripe, StripeAddressElementOptions } from '@stripe/stripe-js'
import { DialogReactive, FormInst, FormRules } from 'naive-ui'
import { IBBillsAddress, IBBillsPreferences, IBBillsPreferencesDetail } from '@/types/workbench'
import { regExp } from '@/utils'
import { useUserStore } from '@/store'
import { useIbStripe } from '@/hooks/useIbStripe'
import { BillsApi } from '@/api/workbench'
import { taxOptions } from './helper'

const props = defineProps<{
  modal?: boolean
  dialog?: DialogReactive
}>()

const formRef = ref<FormInst>()
const form = ref(<IBBillsPreferences>{
  email: useUserStore().user?.email || '',
  billAddress: {},
  tax: {
    taxType: '',
    taxId: ''
  }
})
const rules: FormRules = {
  email: {
    validator: (rule, value) => {
      if (!value) return new Error(window.$t('wb.manage.bills.preferences_email_required'))
      if (!regExp.email.test(value)) return new Error(window.$t('wb.manage.bills.preferences_email_format_error'))
      return true
    },
    trigger: 'blur'
  }
}
let stripe: Stripe | null = null
const ibStripe = useIbStripe()
const mountStripe = async (preferences: IBBillsPreferencesDetail | null) => {
  stripe = await ibStripe.loadStripe()
  const elements = stripe!.elements({})
  const options: StripeAddressElementOptions = {
    mode: 'billing',
    display: {
      name: 'organization'
    }
  }
  if (preferences) {
    options.defaultValues = {
      name: preferences.name,
      address: {
        country: preferences.country,
        city: preferences.city,
        state: preferences.stateProvince,
        postal_code: preferences.postcode,
        line1: preferences.streetLine1,
        line2: preferences.streetLine2
      }
    }
  }
  const addressEle = elements.create('address', options)
  addressEle.mount('#stripe-address')
  addressEle.on('change', (event) => {
    form.value.billAddress = (<unknown>event.value) as IBBillsAddress
  })
}
const getPreferences = async () => {
  try {
    const res = await BillsApi.preferencesDetail()
    if (res) {
      form.value.email = res.email
      form.value.tax = {
        taxType: res.taxIdType,
        taxId: res.taxId
      }
    }
    await mountStripe(res)
  } catch (e) {
    // console.log('账单地址加载失败: ', e)
  }
}
onMounted(() => getPreferences())
const saveLoading = ref(false)
// 保存表单
const onSaveForm = async () => {
  try {
    await formRef.value?.validate()
  } catch (e) {
    return window.$message.error(window.$t('form_error'))
  }
  try {
    saveLoading.value = true
    await BillsApi.savePreferences(form.value)
    props.dialog && props.dialog.destroy()
    window.$message.success(window.$t('save_success'))
  } finally {
    saveLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.preferences {
  width: 600px;
  padding-bottom: 50px;
  .tips {
    font-size: 12px;
    color: #565869;
    margin-top: 12px;
    margin-bottom: 12px;
  }
  .title {
    position: relative;
    font-size: 14px;
    font-weight: bold;
    &.require::after {
      content: '*';
      color: red;
      position: absolute;
      margin-left: 4px;
    }
  }
  .stripe-address {
    width: 300px;
  }
}
</style>
