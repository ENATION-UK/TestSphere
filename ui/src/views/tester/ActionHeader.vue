<template>
  <IbAppHeader class="tester-header">
    <template #left>
      <div class="back-view">
        <n-tooltip placement="bottom">
          <template #trigger>
            <div class="back-btn" @click="handleBack">
              <n-icon :size="20">
                <IosArrowBack />
              </n-icon>
            </div>
          </template>
          {{ $t('back_workbench') }}
        </n-tooltip>
        <div class="back-divider" />
        <n-tooltip placement="bottom">
          <template #trigger>
            <div class="back-btn" @click="handleSetting">
              <n-icon :size="20">
                <Settings24Regular />
              </n-icon>
            </div>
          </template>
          {{ $t('pj.setting') }}
        </n-tooltip>
      </div>
      <ExtChecker />
    </template>
    <template #center>
      <n-dropdown
        trigger="hover"
        :options="[Menus.rename, Menus.del]"
        :show-arrow="true"
        @select="handleSelectProjectMenu"
      >
        <div class="project-name">
          <span>{{ projectStore.project?.name }}</span>
          <n-icon :size="18">
            <IosArrowDown />
          </n-icon>
        </div>
      </n-dropdown>
    </template>
    <template #right>
      <n-space class="right-op">
        <IbHeaderUpgrade />
        <IbHeaderInviteFriends />
        <IbHeaderHelp />
        <IbHeaderDocs doc-url="/docs/autotest/intro" />
      </n-space>
    </template>
  </IbAppHeader>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Settings24Regular from '@vicons/fluent/Settings24Regular'
import IosArrowBack from '@vicons/ionicons4/IosArrowBack'
import IosArrowDown from '@vicons/ionicons4/IosArrowDown'
import { NDropdown, NIcon } from 'naive-ui'
import { MenuKey, Menus } from '@/utils'
import { useTesterProjectsStore, useTesterProjectStore } from '@/store/tester'
import { TesterProjectApi } from '@/api/tester'
import IbAppHeader from '@/components/IbAppHeader.vue'
import IbHeaderDocs from '@/components/IbHeaderDocs.vue'
import IbHeaderHelp from '@/components/IbHeaderHelp.vue'
import IbHeaderInviteFriends from '@/components/IbHeaderInviteFriends.vue'
import IbHeaderUpgrade from '@/components/IbHeaderUpgrade.vue'
import ExtChecker from './ExtChecker.vue'

const router = useRouter()
const projectStore = useTesterProjectStore()
const projectsStore = useTesterProjectsStore()
const handleBack = () => {
  router.replace({ name: 'testerProjects' })
}
const handleSetting = () => {
  router.replace({ name: 'testerSettings' })
}
// 项目重命名
const handleRenameProject = () => {
  const { id, name } = projectStore.project!
  window.$prompt(
    {
      title: window.$t('pj.rename'),
      defaultValue: name,
      inputLabel: window.$t('pj.name'),
      placeholder: window.$t('pj.new_name'),
      validator: (value) => {
        if (!value) return window.$t('pj.name_required')
      }
    },
    async (newName) => {
      await TesterProjectApi.update(id, { name: newName })
      await projectStore.getProject(id)
    }
  )
}
// 删除项目
const handleDeleteProject = async () => {
  await window.$confirm(window.$t('tester.confirm_delete_project'), { style: 'width: 400px' }, async () => {
    await TesterProjectApi.delete(projectStore.project!.id)
    await projectsStore.getProjects()
  })
  handleBack()
}
const handleSelectProjectMenu = async (key: MenuKey) => {
  switch (key) {
    case 'rename':
      return handleRenameProject()
    case 'delete':
      return handleDeleteProject()
  }
}
</script>

<style scoped lang="scss">
.tester-header {
  width: 1440px;
  min-width: 1440px;
  margin: 0 auto;
  height: 50px;
}
:deep(.right-op) {
  flex-shrink: 0;
  align-items: center;
  padding: 0 12px;
  > div[role='none'] {
    display: flex;
    align-items: center;
  }
}
.back-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  background-color: var(--hover-color);
  border-radius: 4px;
  margin-left: 5px;
  margin-right: 12px;
  transition: background-color 0.2s var(--bezier);
  .back-divider {
    flex-shrink: 0;
    width: 1px;
    height: 18px;
    margin: 0 3px;
    background-color: #bbbbbb;
  }
  .back-btn {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    cursor: pointer;
    transition: background-color 0.2s var(--bezier);
    padding: 0 5px;
    &:hover {
      background-color: var(--pressed-color);
    }
  }
}
.project-name {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
}
</style>
