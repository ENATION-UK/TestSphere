<template>
  <div class="enterprise-members">
    <div class="members-menus">
      <div class="search-view">
        <n-input
          ref="searchInputRef"
          v-model:value="keywords"
          :disabled="activeMenu !== 'all'"
          :placeholder="$t('wb.manage.enterprise.search_members')"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <n-icon>
              <IosSearch />
            </n-icon>
          </template>
        </n-input>
      </div>
      <div class="menus-view">
        <div class="title-menus">{{ $t('wb.manage.enterprise.member_list') }}</div>
        <div class="body-menus">
          <n-button quaternary @click="handleClickMenu('all')" :class="{ active: activeMenu === 'all' }">
            {{ $t('wb.manage.enterprise.all_member') }}
          </n-button>
          <n-button quaternary @click="handleClickMenu('invited')" :class="{ active: activeMenu === 'invited' }">
            {{ $t('wb.manage.enterprise.invited_member') }}
          </n-button>
        </div>
      </div>
    </div>
    <MemberList v-if="activeMenu === 'all'" ref="memberListRef" />
    <InvitedMembers v-else-if="activeMenu === 'invited'" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IosSearch from '@vicons/ionicons4/IosSearch'
import { InputInst } from 'naive-ui'
import InvitedMembers from './InvitedMembers.vue'
import MemberList from './MemberList.vue'

const searchInputRef = ref<InputInst>()
const memberListRef = ref<InstanceType<typeof MemberList>>()
const activeMenu = ref('all')
const handleClickMenu = (type: string) => {
  activeMenu.value = type
}
const keywords = ref('')
const handleSearch = () => {
  if (activeMenu.value !== 'all') return
  memberListRef.value?.getMembers({ key: keywords.value })
}
</script>

<style scoped lang="scss">
.enterprise-members {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}
.members-menus {
  width: 220px;
  height: 100%;
  min-height: 600px;
  border-right: 1px solid var(--border-color);
  padding: 24px;
  .menus-view {
    margin-top: 12px;
    .title-menus {
    }
    .body-menus {
      margin-top: 12px;
      :deep(.n-button) {
        width: 100%;
        justify-content: flex-start;
        margin-bottom: 10px;
        &.active {
          font-weight: bold !important;
          color: var(--ib-main-color);
          background-color: var(--ib-main-hover-color);
        }
      }
    }
  }
}
</style>
