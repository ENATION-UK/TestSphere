<template>
  <n-layout class="layout-container">
    <n-layout-header bordered>
      <ActionHeader />
    </n-layout-header>
    <div class="inner-detail">
      <TesterMenus />
      <router-view v-if="projectStore.project" />
    </div>
  </n-layout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import {
  useCasesStore,
  useCaseStepStore,
  useHistoryStore,
  useTasksStore,
  useTaskStore,
  useTesterProjectStore
} from '@/store/tester'
import { useTesterParams } from '@/hooks/useTesterParams'
import { setTitle } from '@/plugins/vue-title'
import ActionHeader from './ActionHeader.vue'
import { initTesterSocket } from './tester-socket'
import TesterMenus from './TesterMenus.vue'

const socket = initTesterSocket()
const projectStore = useTesterProjectStore()
const { projectId } = useTesterParams()
onMounted(async () => {
  const project = await projectStore.getProject(projectId)
  setTitle(project.name)
})
onUnmounted(() => {
  socket.close()
  projectStore.$reset()
  projectStore.$dispose()
  const casesStore = useCasesStore()
  casesStore.$reset()
  casesStore.$dispose()
  const caseStepStore = useCaseStepStore()
  caseStepStore.$reset()
  caseStepStore.$dispose()
  const taskStore = useTaskStore()
  taskStore.$reset()
  taskStore.$dispose()
  const tasksStore = useTasksStore()
  tasksStore.$reset()
  tasksStore.$dispose()
  const historyStore = useHistoryStore()
  historyStore.$reset()
  historyStore.$dispose()
})
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
}
.inner-detail {
  display: flex;
  width: 1440px;
  height: calc(100vh - 45px);
  margin: 0 auto;
}
</style>
