<template>
  <n-modal
    v-model:show="showModal"
    :close-on-esc="false"
    :mask-closable="false"
    :show-icon="false"
    :auto-focus="false"
    transform-origin="center"
    preset="dialog"
    style="width: 620px"
  >
    <div class="invoicing-modal">
      <div class="title">{{ $t('wb.manage.orders.select_invoice_order') }}</div>
      <div class="body empty">
        <n-empty>
          <div class="empty-content">
            <div class="text">{{ $t('wb.manage.orders.no_can_invoice') }}</div>
            <n-button text type="info" class="history-btn" @click="handleViewInvoiceHistory">
              {{ $t('wb.manage.orders.view_invoice_history') }}
            </n-button>
          </div>
        </n-empty>
      </div>
      <div class="footer">
        <div class="invoicing-price">
          <span>{{ $t('wb.manage.orders.invoice_price') }}</span>
          <span class="price">0.00</span>
          <span>元</span>
        </div>
        <div class="agreement-submit">
          <div class="agreement">
            <n-checkbox v-model:checked="agreeNotice" size="small"></n-checkbox>
            <div class="text" @click="agreeNotice = !agreeNotice">
              {{ $t('wb.orders.read_and_agreed') }}
              <n-button text>《开票须知》</n-button>
            </div>
          </div>
          <n-button disabled>{{ $t('wb.manage.orders.apply_invoice') }}</n-button>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const showModal = ref(false)
const show = () => {
  showModal.value = true
}
const agreeNotice = ref(false)
const router = useRouter()
const handleViewInvoiceHistory = () => {
  showModal.value = false
  router.push({ name: 'invoiceHistory' })
}

defineExpose({ show })
</script>

<style scoped lang="scss">
.invoicing-modal {
  .title {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
  }
  .body {
    min-height: 360px;
    &.empty {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      .empty-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .text {
        color: #999999;
        margin-top: 12px;
      }
      .history-btn {
        font-size: 12px !important;
        margin-top: 12px;
      }
    }
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 20px;
    border-top: 1px solid var(--border-color);
    .invoicing-price {
      display: flex;
      align-items: center;
      font-size: 12px;
      .price {
        color: #222222;
        font-size: 18px;
        font-weight: bold;
        margin: 0 6px;
      }
    }
    .agreement-submit {
      display: flex;
      align-items: center;
      font-size: 12px;
      .agreement {
        display: flex;
        align-items: center;
        margin-right: 12px;
        .text {
          display: block;
          padding-left: 6px;
          cursor: pointer;
        }
        :deep(.n-button) {
          margin-left: 6px;
          font-size: 12px !important;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
