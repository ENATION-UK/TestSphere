<template>
  <div class="workbench-project">
    <ProjectList
      type="dbdesign"
      :loading="projectsStore.loading"
      :projects="projectsStore.projects"
      :menu-options="menuOptions"
      @handle-menu="handleMenu"
      @handle-add="handleAddProject"
      @handle-search="handleSearch"
      @handle-to-detail="handleToProjectDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IBProject } from '@/types/project'
import Menus, { MenuOption } from '@/utils/menus'
import { useProjectsStore } from '@/store'
import { useIbModal } from '@/hooks'
import { ProjectApi } from '@/api/project'
import ProjectList from './ProjectList.vue'

const router = useRouter()
const projectsStore = useProjectsStore()
const handleSearch = (keyword: string) => {
  projectsStore.getProjects({ keyword })
}

const handleToProjectDetail = (item: IBProject) => {
  router.push({ name: 'projectDetail', params: { id: item.id } })
}

const ibModal = useIbModal()

const handleAddProject = () => {
  ibModal.createProjectModalRef.value?.show()
}
const menuOptions = [Menus.rename, Menus.del] as MenuOption[]
// 编辑项目
const handleRenameProject = (project: IBProject) => {
  window.$prompt(
    {
      title: window.$t('pj.rename'),
      defaultValue: project.name,
      inputLabel: window.$t('pj.name'),
      placeholder: window.$t('pj.new_name'),
      validator: (value) => {
        if (!value) return window.$t('pj.name_required')
      }
    },
    async (name) => {
      await ProjectApi.update(project.id, name)
      await projectsStore.getProjects()
    }
  )
}
// 删除项目
const handleDeleteProject = (project: IBProject) => {
  window.$confirm(
    window.$t('confirm_delete_project'),
    {
      style: 'width: 400px'
    },
    async () => {
      await ProjectApi.delete(project.id)
      await projectsStore.getProjects()
    }
  )
}
const handleMenu = (key: string, project: IBProject) => {
  switch (key) {
    case 'rename':
      return handleRenameProject(project)
    case 'delete':
      return handleDeleteProject(project)
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
