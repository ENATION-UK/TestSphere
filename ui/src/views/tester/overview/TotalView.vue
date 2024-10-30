<template>
  <div class="total-view">
    <div class="card-total project-info">
      <div class="title-card">{{ $t('project_info') }}</div>
      <div class="content-card">
        <div class="item-info">
          <div class="label">{{ $t('name') }}</div>
          <div class="value">{{ projectStore.project?.name }}</div>
        </div>
        <div class="item-info">
          <div class="label">{{ $t('base_url') }}</div>
          <div class="value">{{ projectStore.project?.baseUrl }}</div>
        </div>
        <div class="item-info">
          <div class="label">{{ $t('tester.resolution') }}</div>
          <div class="value">{{ projectStore.resolutionText }}</div>
        </div>
        <div class="setting-box">
          <router-link :to="{ name: 'testerSettings' }" class="setting-btn underline">{{ $t('setting') }}</router-link>
        </div>
      </div>
    </div>
    <div class="card-total case-stat">
      <div class="title-card">{{ $t('tester.test_stat') }}</div>
      <div class="content-card">
        <div class="stat-item">
          <div class="label">
            <div class="dot"></div>
            {{ $t('tester.test_total') }}
          </div>
          <div class="value">{{ caseStat?.caseTotal || 0 }}</div>
        </div>
        <div class="stat-item">
          <div class="label">
            <div class="dot"></div>
            <span>{{ $t('tester.success_case_total') }}</span>
          </div>
          <div class="value">{{ caseStat?.successTotal || 0 }}</div>
        </div>
        <div class="stat-item">
          <div class="label">
            <div class="dot"></div>
            <span>{{ $t('tester.failure_case_total') }}</span>
          </div>
          <div class="value">{{ caseStat?.failedTotal || 0 }}</div>
        </div>
      </div>
    </div>
    <div class="card-total run-limit">
      <div class="title-card">{{ $t('tester.run_count') }}</div>
      <div class="content-card">
        <div class="limit-box">
          <div class="item-limit">
            <div class="label">{{ $t('tester.been_run') }}</div>
            <div class="value">{{ runTotalTimes }}</div>
          </div>
          <div class="item-limit">
            <div class="label">{{ $t('tester.residual') }}</div>
            <div class="value">{{ residualTimes }}</div>
          </div>
        </div>
        <div class="other-box">
          <n-button color="#785FE4" :focusable="false" class="upgrade-btn linear-gradient-btn" @click="handleUpgrade">
            {{ $t('upgrade_vip_earn_run_limit') }}
          </n-button>
          <n-button
            text
            color="#785FE4"
            :focusable="false"
            class="invite-btn underline"
            @click="useInviteFriendsModalModal()"
          >
            {{ $t('invite_friends_earn_run_limit') }}
          </n-button>
        </div>
      </div>
    </div>
    <div class="card-total recent">
      <div class="title-card">
        {{ $t('tester.recently_run') }}
        <router-link
          :to="{ name: 'testerHistoryList' }"
          class="more-link underline"
          @click="useHistoryStore().resetParams()"
        >
          {{ $t('more') }}
        </router-link>
      </div>
      <div class="content-card">
        <n-spin :show="recordsLoading">
          <n-table :bordered="false" single-column size="small">
            <thead>
              <tr>
                <th class="name">{{ $t('tester.case') }}</th>
                <th class="duration">{{ $t('tester.duration') }}</th>
                <th class="status">{{ $t('status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in records"
                :key="item.id"
                :style="`--status-color: ${getTesterStatusColor(item.status)}`"
              >
                <td class="name">
                  <div class="dot"></div>
                  <router-link :to="{ name: 'testerHistoryDetail', params: { historyId: item.id } }">
                    <n-ellipsis>{{ item.testCaseName }}</n-ellipsis>
                  </router-link>
                </td>
                <td>{{ formatSeconds(item.duration) }}</td>
                <td class="status">
                  {{ formatTesterStatus(item.status, true) }}
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-spin>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { IBCaseRecord, IBCaseStat } from '@/types/tester'
import { IBConfig } from '@/config'
import { formatSeconds } from '@/utils'
import { useHistoryStore, useTesterProjectStore } from '@/store/tester'
import { useCompanyStore } from '@/store/workbench'
import { useInviteFriendsModalModal, useSubscriptionAtModal, useTesterBuyConsultModal } from '@/hooks'
import { CaseApi, RecordApi } from '@/api/tester'
import { formatTesterStatus, getTesterStatusColor } from '../helpers'

const projectStore = useTesterProjectStore()
const companyStore = useCompanyStore()
const caseStat = ref<IBCaseStat>()
const residualTimes = computed(() => {
  if (!companyStore.company) return 0
  return companyStore.company.remainCountMonthly
})
const runTotalTimes = computed(() => {
  if (!companyStore.company) return 0
  return companyStore.company.runTotalMonthly
})

const totalLoading = ref(false)
const getCaseTotal = async () => {
  totalLoading.value = true
  try {
    caseStat.value = await CaseApi.overview()
  } finally {
    totalLoading.value = false
  }
}

const recordsLoading = ref(false)
const records = ref<IBCaseRecord[]>([])
const getRecords = async () => {
  recordsLoading.value = true
  try {
    const res = await RecordApi.list({ pageNo: 1, pageSize: 5 })
    records.value = res.records
  } finally {
    recordsLoading.value = false
  }
}

const handleUpgrade = () => {
  if (IBConfig.APP_CHINA) {
    useTesterBuyConsultModal()
  } else {
    useSubscriptionAtModal()
  }
}

onMounted(() => {
  companyStore.getCompanyInfo()
  getCaseTotal()
  getRecords()
})
</script>

<style scoped lang="scss">
.total-view {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-top: 10px;
  .card-total {
    flex: 1;
    min-width: 0;
    padding: 16px 20px;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: var(--box-shadow-1);
    .title-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
      height: 20px;
    }
    .content-card {
      width: 100%;
      height: calc(100% - 35px);
    }
  }
  .project-info {
    .item-info {
      .label {
        font-size: 12px;
        color: #999999;
      }
      .value {
        margin-top: 3px;
        font-size: 13px;
        font-weight: bold;
        word-break: break-all;
        word-wrap: break-word;
      }
    }
    .setting-box {
      display: flex;
      justify-content: flex-end;
      .setting-btn {
        color: #999999;
      }
    }
  }
  .case-stat {
    .content-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .stat-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1;
      width: 100%;
      border-radius: 8px;
      padding-left: 10px;
      padding-right: 12px;
      font-weight: bold;
      &:nth-child(1) {
        color: #122d78;
        background-color: #ccdef8;
        .value {
          background-color: #e0eafc;
        }
      }
      &:nth-child(2) {
        color: #401772;
        background-color: #deccfa;
        .value {
          background-color: #ece0fc;
        }
      }
      &:nth-child(3) {
        color: #6b1d6f;
        background-color: #f9c9f2;
        .value {
          background-color: #fdddf7;
        }
      }
      .label {
        display: flex;
        align-items: center;
      }
      .dot {
        width: 8px;
        height: 8px;
        border: 1px solid #8f99ad;
        border-radius: 999999px;
        margin-right: 10px;
      }
      .value {
        text-align: center;
        min-width: 56px;
        padding: 4px 10px;
        border-radius: 99999px;
      }
    }
  }
  .run-limit {
    .limit-box {
      display: flex;
      justify-content: center;
      width: 100%;
      .item-limit {
        display: flex;
        flex-direction: column;
        align-items: center;
        & + .item-limit {
          margin-left: 50px;
        }
      }
      .label {
        color: #999999;
      }
      .value {
        font-size: 20px;
        font-weight: bold;
        color: #333333;
        margin-top: 6px;
      }
    }
    .other-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin-top: 14px;
      .upgrade-btn {
        border-radius: 8px;
        min-width: 200px;
      }
      .invite-btn {
        margin-top: 12px;
      }
    }
  }
  .recent {
    flex: 1.3;
    .more-link {
      font-size: 12px;
      color: #999999;
    }
    thead {
      th {
        text-align: center;
        border-bottom: none;
        background-color: transparent;
        color: #999999;
      }
      .name {
        width: 130px;
        text-align: left;
        padding-left: 24px;
      }
      .duration {
        width: 50px;
      }
      .status {
        width: 80px;
      }
    }
    tbody td {
      text-align: center;
      font-size: 13px;
      padding: 2px 6px;
      border-bottom: none;
      &.name {
        display: flex;
        align-items: center;
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 99999px;
          background-color: var(--status-color);
          margin-right: 5px;
        }
        :deep(.n-ellipsis) {
          max-width: 110px;
          vertical-align: top;
        }
      }
      &.status {
        color: var(--status-color);
      }
    }
  }
}
</style>
