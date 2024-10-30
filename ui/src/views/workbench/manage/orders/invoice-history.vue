<template>
  <div class="invoice-history">
    <div class="enterprise">
      <div class="enterprise-info">
        <WorkbenchAvatar :src="company.logo" :name="company.companyName" company :round="false" />
        <div class="info">
          <div class="name">{{ company.companyName }}</div>
          <div class="exp">
            <span v-if="company.subscribeTypeDb">
              {{ $t('wb.version_info_tip') }}{{ $t(IBSubscribeTypeDbMap[company.subscribeTypeDb]) }}
            </span>
            <span v-if="company.expiryTime">
              , {{ $t('wb.expiration_time_is') }} {{ formatUnix(company.expiryTime) }}
            </span>
          </div>
        </div>
      </div>
      <n-button>{{ $t('wb.manage.orders.apply_invoice') }}</n-button>
    </div>
    <div class="invoice-list">
      <InvoiceList />
    </div>
    <div class="invoice-tips" :class="{ expand: noticeExpand }">
      <div class="title">
        <div class="tit">
          <n-icon size="16" color="#1b86e0">
            <information-circle-outline />
          </n-icon>
          <span class="text">{{ $t('wb.manage.orders.invoice_instructions') }}</span>
        </div>
        <div class="expand-box" @click="noticeExpand = !noticeExpand">
          <span>{{ noticeExpand ? $t('wb.manage.orders.stow') : $t('wb.manage.orders.expand') }}</span>
          <n-icon size="16" class="icon-expand">
            <keyboard-arrow-down-round />
          </n-icon>
        </div>
      </div>
      <div class="tips">
        <n-collapse-transition :show="noticeExpand">
          <div class="tip">
            <div class="label">{{ $t('wb.manage.orders.invoice_time') }}</div>
            <div class="text">
              <i18n-t keypath="wb.manage.orders.invoice_time_tip">
                <strong>{{ $t('wb.manage.orders.working_days') }}</strong>
              </i18n-t>
            </div>
          </div>
          <div class="tip">
            <div class="label">{{ $t('wb.manage.orders.invoice_type') }}</div>
            <div class="text">
              <i18n-t keypath="wb.manage.orders.invoice_type_tip">
                <n-button text size="tiny" style="text-decoration: underline">
                  {{ $t('wb.manage.orders.online_customer_service') }}
                </n-button>
              </i18n-t>
            </div>
          </div>
          <div class="tip">
            <div class="label">{{ $t('wb.manage.orders.service_name') }}</div>
            <div class="text">
              <i18n-t keypath="wb.manage.orders.service_name_tip">
                <strong>软件-在线产品原型设计软件</strong>
                <n-button text size="tiny" style="text-decoration: underline">
                  {{ $t('wb.manage.orders.invoice_sample') }}
                </n-button>
              </i18n-t>
            </div>
          </div>
          <div class="tip">
            <div class="label">{{ $t('wb.manage.orders.invoice_tax_rate') }}</div>
            <div class="text">
              <i18n-t keypath="wb.manage.orders.invoice_tax_rate_tip">
                <strong>13%</strong>
              </i18n-t>
            </div>
          </div>
          <div class="tip">
            <div class="label">{{ $t('wb.manage.orders.special_instructions') }}</div>
            <div class="text">
              <i18n-t keypath="wb.manage.orders.special_instructions_tip">
                <n-button text size="tiny" style="text-decoration: underline">
                  {{ $t('wb.manage.orders.online_customer_service') }}
                </n-button>
              </i18n-t>
            </div>
          </div>
        </n-collapse-transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import InformationCircleOutline from '@vicons/ionicons5/InformationCircleOutline'
import KeyboardArrowDownRound from '@vicons/material/KeyboardArrowDownRound'
import { IBSubscribeTypeDbMap } from '@/types/workbench'
import { formatUnix } from '@/utils'
import { useCompanyStore } from '@/store/workbench'
import WorkbenchAvatar from '../../WorkbenchAvatar.vue'
import InvoiceList from '../InvoiceList.vue'

const company = computed(() => useCompanyStore().company!)
const noticeExpand = ref(true)
</script>

<style scoped lang="scss">
.invoice-history {
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
  .enterprise {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px dashed var(--border-color);
    .enterprise-info {
      display: flex;
      align-items: center;
      .avatar {
        width: 50px;
        height: 50px;
        background-color: #0d8ddf;
      }
      .info {
        display: flex;
        flex-direction: column;
        margin-left: 12px;
        .name {
          color: #222222;
          font-size: 16px;
          font-weight: bold;
        }
        .exp {
          color: #999999;
          font-size: 12px;
          margin-top: 4px;
        }
      }
    }
  }
  .invoice-list {
    margin-top: 12px;
    thead th {
      background-color: #ededf1;
      border-top: 1px solid var(--border-color);
    }
    thead th:first-child,
    tbody td:first-child {
      border-left: 1px solid var(--border-color);
    }
    thead th:last-child,
    tbody td:last-child {
      border-right: 1px solid var(--border-color);
    }
    tbody tr:last-child td {
      border-bottom: 1px solid var(--border-color);
    }
  }
  .invoice-tips {
    margin-top: 24px;
    background-color: #e5f2fc;
    padding: 12px;
    border-radius: 4px;
    overflow: hidden;
    &.expand .icon-expand {
      transform: rotate(180deg);
    }
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tit {
      display: flex;
      align-items: center;
      .text {
        display: block;
        font-size: 12px;
        font-weight: bold;
        margin-left: 4px;
      }
    }
    .expand-box {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: bold;
      color: #1b86e0;
      cursor: pointer;
    }
    .tips {
      font-size: 12px;
      margin-left: 30px;
      .tip {
        display: flex;
        margin-top: 12px;
      }
      .label {
        position: relative;
        width: 90px;
        flex-shrink: 0;
        font-weight: bold;
        &:before {
          content: '';
          position: absolute;
          left: -12px;
          top: 6px;
          width: 5px;
          height: 5px;
          background-color: #0d8ddf;
          border-radius: 100%;
        }
      }
    }
  }
}
</style>
