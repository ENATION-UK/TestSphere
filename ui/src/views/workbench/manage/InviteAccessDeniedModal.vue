<template>
  <div class="modal-hr top"></div>
  <div class="content">
    <i18n-t keypath="wb.manage.invite_access_denied">
      <strong>{{ company.subscribeTypeDb ? $t(IBSubscribeTypeDbMap[company.subscribeTypeDb]) : '/' }}</strong>
      <n-button v-if="!userStore.aliYunUser" text type="info" @click="upgradePlan">
        {{ $t('wb.manage.click_here') }}
      </n-button>
      <strong>{{ $t('wb.manage.team') }}</strong>
    </i18n-t>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { DialogReactive } from 'naive-ui'
import { IBSubscribeTypeDbMap } from '@/types/workbench'
import { IBConfig } from '@/config'
import { useUserStore } from '@/store'
import { useCompanyStore } from '@/store/workbench'

defineProps<{
  title: string
  dialog: DialogReactive
}>()

const router = useRouter()
const userStore = useUserStore()
const company = computed(() => useCompanyStore().company!)
const upgradePlan = () => {
  dialog.destroy()
  router.replace({ name: IBConfig.APP_CHINA ? 'enterpriseOrders' : 'billsSubscription' })
}
</script>

<style scoped lang="scss">
.content {
  word-break: break-all;
  margin-top: -12px;
}
</style>
