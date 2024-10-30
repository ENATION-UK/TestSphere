<template>

  <div class="workbench-project">
    <ProjectList
      type="autotest"
      :loading="projectsStore.loading"
      :projects="projectsStore.projects"
      :menu-options="projectMenuOptions"
      @handle-menu="handleMenu"
      @handle-add="handleAddProject"
      @handle-search="handleSearch"
      @handle-to-detail="handleToProjectDetail"
    >
      <template #title-before>
        <ExtChecker />
      </template>
    </ProjectList>
    <TesterYoutubeVideo v-if="!IBConfig.APP_CHINA" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IBTesterProject } from '@/types/tester'
import { IBConfig } from '@/config'
import Menus, { MenuOption } from '@/utils/menus'
import { useTesterProjectsStore } from '@/store/tester'
import ProjectList from '@/views/workbench/project/ProjectList.vue'
import ExtChecker from './ExtChecker.vue'
import TesterYoutubeVideo from './TesterYoutubeVideo.vue'
import IbLogo from "@/components/IbLogo.vue";

const router = useRouter()
const projectsStore = useTesterProjectsStore()

const handleSearch = (keyword: string) => {
  projectsStore.getProjects({ keyword })
}

const projectMenuOptions = [Menus.rename, Menus.del] as MenuOption[]
const handleToProjectDetail = (item: IBTesterProject) => {
  router.push({ name: 'testerProjectDetail', params: { id: item.id } })
}

const handleAddProject = () => {
  window.$prompt(
    {
      title: window.$t('wb.project.new'),
      placeholder: window.$t('wb.project_name_placeholder'),
      validator: (name) => !!name
    },
    async (name: string) => {
      await projectsStore.createProject({ name })
      await projectsStore.getProjects()
    }
  )
}
const handleDeleteProject = (item: IBTesterProject) => {
  window.$confirm(
    window.$t('tester.confirm_delete_project'),
    {
      style: 'width: 400px'
    },
    async () => {
      await projectsStore.deleteProject(item.id)
      await projectsStore.getProjects()
    }
  )
}
const handleRenameProject = async (project: IBTesterProject) => {
  window.$prompt(
    {
      title: window.$t('wb.project_name'),
      defaultValue: project.name,
      placeholder: window.$t('wb.project_name_placeholder'),
      validator: (name) => !!name
    },
    async (name: string) => {
      await projectsStore.updateProject(project.id, name)
      await projectsStore.getProjects()
    }
  )
}
const handleMenu = (key: string, item: IBTesterProject) => {
  switch (key) {
    case 'rename':
      return handleRenameProject(item)
    case 'delete':
      return handleDeleteProject(item)
  }
}
onMounted(() => {
  if (projectsStore.projects.length === 0) {
    projectsStore.getProjects()
  }
})
</script>

<style scoped lang="scss">
.workbench-project {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
