<template>
  <div class="manage-menus">
    <router-link to="/manage/enterprise-members">
      <n-button quaternary>
        <template #icon>
          <n-icon>
            <PersonSettings20Regular />
          </n-icon>
        </template>
        {{ $t('wb.manage.menus.members') }}
      </n-button>
    </router-link>
    <router-link v-if="inChina" to="/manage/enterprise-orders">
      <n-button quaternary>
        <template #icon>
          <n-icon>
            <Receipt20Regular />
          </n-icon>
        </template>
        {{ $t('wb.manage.menus.enterprise_orders') }}
      </n-button>
    </router-link>
    <router-link v-if="!inChina" to="/manage/bills-subscription">
      <n-button quaternary>
        <template #icon>
          <n-icon>
            <Receipt20Regular />
          </n-icon>
        </template>
        {{ $t('wb.manage.menus.bills_subscription') }}
      </n-button>
    </router-link>
    <router-link v-if="!inChina" to="/manage/bills">
      <n-button quaternary>
        <template #icon>
          <n-icon>
            <ReceiptMoney20Regular />
          </n-icon>
        </template>
        {{ $t('wb.manage.menus.bills') }}
      </n-button>
    </router-link>
    <!--<router-link v-if="!inChina" to="/manage/bills-payments">
      <n-button quaternary>
        <template #icon>
          <n-icon :component="Payment20Regular" />
        </template>
        {{ $t('wb.manage.menus.bills_payments') }}
      </n-button>
    </router-link>-->
    <router-link v-if="!inChina" to="/manage/bills-preferences">
      <n-button quaternary>
        <template #icon>
          <n-icon>
            <MoneySettings20Regular />
          </n-icon>
        </template>
        {{ $t('wb.manage.menus.bills_preferences') }}
      </n-button>
    </router-link>
    <router-link to="/manage/enterprise-profile">
      <n-button quaternary>
        <template #icon>
          <n-icon>
            <ContactCardGroup20Regular />
          </n-icon>
        </template>
        {{ $t('wb.manage.menus.enterprise_profile') }}
      </n-button>
    </router-link>
    <router-link to="/manage/invite-details">
      <n-button quaternary>
        <template #icon>
          <n-icon>
            <People20Regular />
          </n-icon>
        </template>
        {{ $t('wb.manage.menus.invite_details') }}
      </n-button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import ContactCardGroup20Regular from '@vicons/fluent/ContactCardGroup20Regular'
import MoneySettings20Regular from '@vicons/fluent/MoneySettings20Regular'
import People20Regular from '@vicons/fluent/People20Regular'
import PersonSettings20Regular from '@vicons/fluent/PersonSettings20Regular'
import Receipt20Regular from '@vicons/fluent/Receipt20Regular'
import ReceiptMoney20Regular from '@vicons/fluent/ReceiptMoney20Regular'
import IconCoin from '@vicons/tabler/Coin'
import { IBConfig } from '@/config'

const inChina = IBConfig.APP_CHINA
</script>

<style scoped lang="scss">
.manage-menus {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 24px 24px 0;
  width: 220px;
  height: 100%;
  border-right: 1px solid var(--border-color);
  :deep(.router-link-active) {
    .n-button {
      color: var(--ib-main-color);
    }
  }
  :deep(.n-button) {
    justify-content: flex-start;
    width: 100%;
    font-weight: bold !important;
  }
}
</style>
