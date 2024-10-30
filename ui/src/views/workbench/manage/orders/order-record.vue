<template>
  <div class="order-record">
    <div class="top-nav">
      <div class="enterprise">
        <WorkbenchAvatar :src="company.logo" :name="company.companyName" :round="false" company class="logo" />
        <div class="info">
          <div class="name">{{ company.companyName }}</div>
          <div class="capacity">{{ capacity }}</div>
        </div>
      </div>
      <!--<n-button @click="handleInvoicing">{{ $t('wb.manage.orders.apply_invoice') }}</n-button>-->
    </div>
    <div class="record-list">
      <n-table :bordered="false">
        <thead>
          <tr>
            <th>{{ $t('wb.orders.order_type') }}</th>
            <th>{{ $t('wb.orders.product_type') }}</th>
            <th>{{ $t('wb.orders.order_details') }}</th>
            <th>{{ $t('wb.discount') }}</th>
            <th>{{ $t('wb.orders.payment_method') }}</th>
            <th>{{ $t('wb.orders.pay_price') }}</th>
            <th>{{ $t('wb.orders.order_status') }}</th>
            <th>{{ $t('operation') }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in orders" :key="item.id">
            <tr class="head-tr">
              <td colspan="8">
                <div class="order-head">
                  <div class="empty"></div>
                  <div class="content">
                    <div class="date-sn">
                      <span class="date">{{ formatUnix(item.orderDate) }}</span>
                      <span class="sn">{{ $t('wb.orders.order_number') }}：{{ item.id }}</span>
                    </div>
                    <span class="payer"></span>
                  </div>
                </div>
              </td>
            </tr>
            <tr class="body-tr">
              <td>{{ $t(`wb.orders.order_type_${item.orderType}`) }}</td>
              <td>{{ productTypeText(item) }}</td>
              <td>{{ orderDetails(item) }}</td>
              <td>--</td>
              <td>{{ item.paymentMethod ? $t(IBOrderPaymentMethodMap[item.paymentMethod]) : '--' }}</td>
              <td>{{ IBConfig.APP_CHINA ? '¥' : '$' }}{{ item.totalPrice }}</td>
              <td>{{ item.orderStatus ? $t(IBOrderStatusMap[item.orderStatus]) : '--' }}</td>
              <td v-if="item.orderStatus === 'pending'">
                <n-button text type="info" size="tiny" class="underline" @click="goToPay(item)">
                  {{ $t('wb.orders.to_pay') }}
                </n-button>
              </td>
              <td v-else>--</td>
            </tr>
          </template>
        </tbody>
      </n-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { IBProductTypeMap } from '@/types'
import {
  IBMergeSubscribeTypeMap,
  IBOrder,
  IBOrderPaymentMethodMap,
  IBOrderPlanDurationMap,
  IBOrderStatusMap,
  IBSubscribeTypeDbMap
} from '@/types/workbench'
import { IBConfig } from '@/config'
import { formatUnix } from '@/utils'
import { useCompanyStore } from '@/store/workbench'
import { OrderApi } from '@/api/workbench'
import WorkbenchAvatar from '../../WorkbenchAvatar.vue'

const router = useRouter()
const company = computed(() => useCompanyStore().company!)
const capacity = computed(() => {
  const { subscribeTypeDb, expiryTime } = company.value
  let text = subscribeTypeDb ? window.$t(IBSubscribeTypeDbMap[subscribeTypeDb]) : ''
  if (company.value.subscribeTypeDb !== 'FREE' && expiryTime) {
    text += `, ${window.$t('wb.expiration_time_is')} ${formatUnix(expiryTime)}`
  }
  return text
})

const orders = ref<IBOrder[]>([])
const loading = ref(false)
const getOrderList = async () => {
  loading.value = true
  try {
    orders.value = await OrderApi.list()
  } finally {
    loading.value = false
  }
}
onMounted(() => getOrderList())

const orderDetails = (item: IBOrder) => {
  const { orderType, aiPoints, planType, planDuration, seatQuantity } = item
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
}
const productTypeText = (item: IBOrder) => {
  if (item.orderType === 'point') return window.$t('dbDesigner')
  if (!item.productType) return '--'
  return window.$t(IBProductTypeMap[item.productType])
}
const goToPay = (item: IBOrder) => {
  router.push({ name: 'cashier', query: { orderId: item.id } })
}
</script>

<style scoped lang="scss">
.order-record {
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
  .top-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .enterprise {
      display: flex;
      align-items: center;
      .logo {
        width: 50px;
        height: 50px;
        font-weight: bold;
      }
      .info {
        display: flex;
        flex-direction: column;
        margin-left: 20px;
      }
      .name {
        color: #222222;
        font-size: 14px;
        font-weight: bold;
      }
      .capacity {
        color: #999999;
        font-size: 12px;
        margin-top: 5px;
      }
    }
  }
  .record-list {
    margin-top: 24px;
    th,
    td {
      text-align: center;
    }
    .head-tr {
      :deep(td) {
        padding: 0;
      }
    }
    .order-head {
      .empty {
        height: 24px;
        background-color: #ffffff;
      }
      .content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #eeeeee;
        border: 1px solid var(--border-color);
        padding: 6px 12px 6px 24px;
        border-bottom: none;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        color: #333333;
        font-size: 14px;
        .sn {
          margin-left: 24px;
        }
        .payer {
          color: #333333;
          font-size: 12px;
          font-weight: bold;
          padding-right: 24px;
        }
      }
    }
    .body-tr {
      td:first-child {
        border-left: 1px solid var(--border-color);
        border-bottom-left-radius: 8px;
      }
      td:last-child {
        border-right: 1px solid var(--border-color);
        border-bottom-right-radius: 8px;
      }
      td {
        border-bottom: 1px solid var(--border-color);
      }
    }
  }
}
</style>
