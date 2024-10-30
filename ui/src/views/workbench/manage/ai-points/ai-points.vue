<template>
  <div class="ai-points">
    <div class="card ai-points-header">
      <div class="title">{{ $t('wb.manage.menus.ai_points') }}</div>
      <div class="info-list">
        <div class="item">
          <div class="label">{{ $t('wb.manage.ai_point_residual') }}:</div>
          <div class="value">
            <div style="font-weight: bold">{{ companyStore.company?.aiPoint }}</div>
            <div style="margin-top: 12px">
              <n-button size="tiny" text type="info" class="buy-btn" @click="handleBuyAiPoints">
                {{ $t('buy_ai_point') }}
              </n-button>
              <n-button size="tiny" text type="info" class="buy-btn" @click="handleInviteFriends">
                {{ $t('invite_friends_earn_ai_point') }}
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card ai-points-body">
      <div class="title">{{ $t('wb.manage.ai_point_logs') }}</div>
      <n-data-table :data="logs" :columns="columns" :pagination="logsPagination" style="padding-top: 30px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DataTableColumns } from 'naive-ui'
import { IBPagerRes } from '@/types'
import { IBAiPointLog, IBAiPointLogQuery } from '@/types/workbench'
import { formatUnix } from '@/utils'
import { useCompanyStore } from '@/store/workbench'
import { useIbModal, useInviteFriendsModalModal } from '@/hooks'
import { AiPointApi } from '@/api/workbench'

const companyStore = useCompanyStore()
const ibModal = useIbModal()

const handleInviteFriends = () => {
  useInviteFriendsModalModal()
}

const handleBuyAiPoints = () => {
  ibModal.buyAiPointModalRef.value?.show(true)
}

const logs = ref<IBAiPointLog[]>([])
const logsParams = ref<IBAiPointLogQuery>({ pageNo: 1, pageSize: 10 })
const logsLoading = ref(false)
const logsRes = ref<IBPagerRes>({ current: 0, pages: 0, records: [], size: 0, total: 0 })
const logsPagination = computed(() => ({
  page: logsParams.value.pageNo,
  pageSize: logsParams.value.pageSize,
  pageCount: logsRes.value.pages
}))
const getAiPointLogs = async () => {
  try {
    logsLoading.value = true
    const res = await AiPointApi.logs(logsParams.value)
    logs.value = res.records
  } finally {
    logsLoading.value = false
  }
}
onMounted(() => getAiPointLogs())
const columns: DataTableColumns<IBAiPointLog> = [
  {
    title: window.$t('num'),
    key: 'aiPoint',
    render(row) {
      return row.aiPoint < 0 ? row.aiPoint : `+${row.aiPoint}`
    }
  },
  {
    title: window.$t('reason'),
    key: 'reason'
  },
  {
    title: window.$t('date'),
    key: 'createAt',
    render(row) {
      return formatUnix(row.createAt)
    }
  }
]
</script>

<style scoped lang="scss">
.ai-points .card {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;
  & + .card {
    margin-top: 12px;
  }
  .title {
    color: #222222;
    font-size: 16px;
    font-weight: bold;
  }
  .info-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 24px;
    padding-right: 200px;
    .item {
      display: flex;
      align-items: flex-start;
      width: 33.33333%;
      .label {
        color: #999999;
        margin-right: 12px;
      }
      .value {
        .buy-btn {
          text-decoration: underline;
          & + .buy-btn {
            margin-left: 12px;
          }
        }
      }
    }
  }
}
</style>
