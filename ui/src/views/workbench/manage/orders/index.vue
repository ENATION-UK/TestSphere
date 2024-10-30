<template>
  <div class="enterprise-orders">
    <div v-if="routeName === 'enterpriseOrders'">
      <div v-if="company" class="owner">
        <div class="title">{{ $t('wb.manage.orders.enterprise_owner') }}</div>
        <div class="user-info">
          <WorkbenchAvatar :src="company.logo" :name="company.companyName" company />
          <span>{{ company.companyName }}</span>
        </div>
      </div>
      <PlanInfoDb />
      <PlanInfoAt />
    </div>
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCompanyStore } from '@/store/workbench'
import WorkbenchAvatar from '../../WorkbenchAvatar.vue'
import PlanInfoAt from './PlanInfoAt.vue'
import PlanInfoDb from './PlanInfoDb.vue'

const route = useRoute()
const routeName = computed(() => route.name)
const companyStore = useCompanyStore()

const company = computed(() => companyStore.company)
onMounted(() => companyStore.getSubscriptions())
</script>

<style scoped lang="scss">
.enterprise-orders {
  .owner {
    padding: 24px;
    background-color: #ffffff;
    border-radius: 8px;
    .title {
      color: #222222;
      font-size: 16px;
      font-weight: bold;
    }
    .user-info {
      display: flex;
      align-items: center;
      margin-top: 24px;
      .avatar {
        width: 40px;
        height: 40px;
        margin-right: 12px;
      }
    }
  }
}
</style>
