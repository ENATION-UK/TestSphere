<template>
  <div class="invited-members">
    <div class="title-list">
      <div class="numbers">
        {{ $t('wb.manage.enterprise.invited_member') }}&nbsp;&bull;&nbsp;{{ statusMap[params.status] }}
      </div>
    </div>
    <div class="body-list" :class="{ empty: invitePageRes?.records.length === 0 }">
      <n-table v-if="invitePageRes?.records.length !== 0" :bordered="false" :single-line="false">
        <thead>
          <tr>
            <th>{{ $t('wb.manage.enterprise.name') }}</th>
            <th>{{ $t('wb.manage.enterprise.role') }}</th>
            <th>{{ $t('wb.invite_time') }}</th>
          </tr>
        </thead>
        <tbody v-if="invitePageRes">
          <tr v-for="item in invitePageRes.records" :key="item.id">
            <td>{{ item.inviteeName }}</td>
            <td>{{ item.inviteeRole ? roleMap[item.inviteeRole] : '--' }}</td>
            <td>{{ item.createTime ? formatUnix(item.createTime) : '--' }}</td>
          </tr>
        </tbody>
      </n-table>
      <n-empty v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import { IBPagerReq, IBPagerRes } from '@/types/base'
import { IBInviteRecord, IBInviteStatusQuery } from '@/types/workbench'
import { formatUnix } from '@/utils'
import { InviteApi } from '@/api/workbench'

const params = ref<IBPagerReq & { status: IBInviteStatusQuery }>({
  pageNo: 1,
  pageSize: 10,
  status: 'ALL'
})
const invitePageRes = ref<IBPagerRes<IBInviteRecord>>()
const getInvitedMembers = async () => {
  const p = cloneDeep(params.value)
  if (p.status === 'ALL') {
    delete p.status
  }
  invitePageRes.value = await InviteApi.invitedMembers(p)
}
watch(
  () => params.value.status,
  () => {
    params.value.pageNo = 1
    getInvitedMembers()
  },
  { immediate: true }
)
const roleMap = computed(() => ({
  USER: window.$t('wb.manage.role_user'),
  ADMIN: window.$t('wb.manage.role_admin')
}))
const statusMap = computed(() => ({
  ALL: window.$t('wb.manage.all'),
  INVITER: window.$t('wb.manage.inviter'),
  AGREE: window.$t('wb.manage.agree'),
  REFUSE: window.$t('wb.manage.refuse')
}))
</script>

<style scoped lang="scss">
.invited-members {
  padding-top: 24px;
  width: 100%;
  .title-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    width: 100%;
    .numbers {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .body-list {
    padding: 24px;
    &.empty {
      padding-top: 100px;
    }
    :deep(.n-table) {
      th {
        background-color: transparent;
        border: none;
      }
      td {
        border: none;
      }
    }
    .user-info {
      display: flex;
      align-items: center;
      .user-name {
        margin-left: 12px;
      }
    }
  }
}
</style>
