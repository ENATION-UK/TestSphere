<template>
  <div class="payments">
    <div v-for="item in paymentMethods" :key="item.id" class="payment-method-item">
      <div class="content-box">
        <div class="icon-box">
          <n-ellipsis>{{ item.cardBrand.toUpperCase() }}</n-ellipsis>
        </div>
        <div class="info-box">
          <div class="card-number">{{ item.cardBrand }} **** {{ item.cardLast4 }}</div>
          <div class="card-exp">Expires {{ formatExpStr(item) }}</div>
        </div>
      </div>
      <div class="action-box">
        <n-button text :disabled="paymentMethods?.length === 1" type="info" @click="onRemovePaymentMethod(item)">
          {{ $t('wb.manage.bills.payment_remove_btn') }}
        </n-button>
        <n-button text type="info" disabled @click="onUpdatePaymentMethod(item)">
          {{ $t('wb.manage.bills.payment_update_btn') }}
        </n-button>
      </div>
    </div>
  </div>
  <n-button :loading="addBtnLoading" @click="onAddPaymentMethod" class="add-payment-method-btn">
    {{ $t('wb.manage.bills.payment_add_btn') }}
  </n-button>
  <AddPaymentMethodModal ref="addPaymentMethodModalRef" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { IBPaymentMethod } from '@/types/workbench'
import { PaymentMethodApi } from '@/api/workbench'
import AddPaymentMethodModal from './AddPaymentMethodModal.vue'

const router = useRouter()
const addPaymentMethodModalRef = ref<InstanceType<typeof AddPaymentMethodModal>>()
const paymentMethods = ref<IBPaymentMethod[]>()
const loading = ref(false)
const getPaymentMethods = async () => {
  try {
    loading.value = true
    paymentMethods.value = await PaymentMethodApi.list()
  } finally {
    loading.value = false
  }
}
const formatExpStr = (item: IBPaymentMethod) => {
  const m = item.cardExpMonth < 10 ? '0' + item.cardExpMonth : item.cardExpMonth
  const y = String(item.cardExpYear).substring(2, 4)
  return `${m}/${y}`
}

onMounted(() => getPaymentMethods())

const addBtnLoading = ref(false)
const onAddPaymentMethod = async () => {
  addBtnLoading.value = true
  try {
    addBtnLoading.value = false
    await addPaymentMethodModalRef.value?.show()
    await getPaymentMethods()
  } finally {
    addBtnLoading.value = false
  }
}
const onRemovePaymentMethod = async (item: IBPaymentMethod) => {
  if (paymentMethods.value?.length === 1) {
    window.$dialog.error({
      title: window.$t('error'),
      content: window.$t('wb.manage.bills.payment_keep_least_one'),
      autoFocus: false,
      maskClosable: false,
      transformOrigin: 'center',
      style: 'margin-top:50px'
    })
    return
  }
  await window.$confirm(window.$t('wb.manage.bills.payment_confirm_remove'), { type: 'error' }, async () => {
    await PaymentMethodApi.delete(item.id)
    await getPaymentMethods()
    window.$message.success(window.$t('delete_success'))
  })
}
const onUpdatePaymentMethod = async (item: IBPaymentMethod) => {
  // await addPaymentMethodModalRef.value?.show(item)
  // await getPaymentMethods()
}
</script>

<style scoped lang="scss">
.payments {
  display: flex;
}
.payment-method-item {
  display: flex;
  flex-direction: column;
  padding: 12px 24px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  margin-right: 24px;
  min-width: 320px;
  box-sizing: border-box;
  .content-box {
    display: flex;
    align-items: center;
    padding: 6px 12px 0;
  }
  .icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    width: 50px;
    height: 50px;
    overflow: hidden;
    color: #ffffff;
    background-color: #35599b;
    border-radius: 6px;
  }
  .info-box {
    margin-left: 20px;
  }
  .card-number {
    font-size: 18px;
    font-weight: bold;
  }
  .card-exp {
    color: #999999;
  }
  .action-box {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    :deep(.n-button) {
      font-weight: bold;
      margin-right: 12px;
    }
  }
}
.add-payment-method-btn {
  margin-top: 24px;
}
</style>
