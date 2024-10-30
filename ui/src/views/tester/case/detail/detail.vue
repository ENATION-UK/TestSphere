<template>
  <div class="step-container">
    <div class="tools-bar" :class="caseStatus" :style="`--status-color: ${caseStatusColor}`">
      <div class="left-tools">
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="back-icon" @click="onBack">
              <n-icon size="20"><ChevronBack /></n-icon>
            </div>
          </template>
          {{ $t('tester.back_to_list') }}
        </n-tooltip>
        <n-ellipsis v-if="caseStore.case" class="project-name">{{ caseStore.case!.name }}</n-ellipsis>
        <CaseConfigBar />
      </div>
      <div class="right-tools">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button :disabled="caseStore.notFound || recordRunning" text @click="onStartRecord">
              <div
                class="record-icon"
                :class="{ recording: recordStore.recording, running: recordRunning, disabled: caseStore.notFound }"
              >
                <i class="inner-circle"></i>
              </div>
            </n-button>
          </template>
          {{ recordRunning ? $t('tester.stop_record') : $t('tester.start_record') }}
        </n-tooltip>
        <n-tooltip v-if="showSaveBtn" trigger="hover">
          <template #trigger>
            <n-button size="small" round :loading="saveLoading" @click="onSaveSteps">
              <template #icon>
                <n-icon size="20"><CloudUpload /></n-icon>
              </template>
              {{ $t('save') }}
            </n-button>
          </template>
          {{ $t('tester.save_record_steps') }}
        </n-tooltip>
        <n-dropdown
          v-if="guideIng"
          show
          trigger="manual"
          :options="runOptions"
          :disabled="caseStore.notFound || recordRunning"
          show-arrow
          @select="handleSelectRunMode"
        >
          <div class="play-menu">
            <div class="play-icon" :class="{ running: recordRunning }" @click.stop="onRunOrStopCase">
              <n-icon size="18" class="icon-play">
                <LogoChrome v-if="recordRunning && runMode === 'local'" class="local-running-icon" />
                <CloudyOutline v-else-if="recordRunning && runMode === 'remote'" class="remote-running-icon" />
                <IbSpinLoading v-else-if="runLoading" />
                <IconPlay v-else />
              </n-icon>
              <n-icon size="18" class="icon-stop">
                <IconStop />
              </n-icon>
            </div>
            <span v-if="recordRunning" class="text">{{ $t('tester.running') }}...</span>
            <span v-else class="text">
              {{ runMode === 'local' ? $t('tester.local_run') : $t('tester.remote_run') }}
            </span>
            <n-icon size="18"><IosArrowDown /></n-icon>
          </div>
        </n-dropdown>
        <n-dropdown
          v-else
          trigger="click"
          :options="runOptions"
          :disabled="caseStore.notFound || recordRunning"
          show-arrow
          @select="handleSelectRunMode"
        >
          <div class="play-menu" :class="{ disabled: caseStore.notFound }">
            <div class="play-icon" :class="{ running: recordRunning }" @click.stop="onRunOrStopCase">
              <n-icon size="18" class="icon-play">
                <LogoChrome v-if="recordRunning && runMode === 'local'" class="local-running-icon" />
                <CloudyOutline v-else-if="recordRunning && runMode === 'remote'" class="remote-running-icon" />
                <IbSpinLoading v-else-if="runLoading" />
                <IconPlay v-else />
              </n-icon>
              <n-icon size="18" class="icon-stop"><IconStop /></n-icon>
            </div>
            <span v-if="recordRunning" class="text">{{ $t('tester.running') }}...</span>
            <span v-else class="text">
              {{ runMode === 'local' ? $t('tester.local_run') : $t('tester.remote_run') }}
            </span>
            <n-icon size="18"><IosArrowDown /></n-icon>
          </div>
        </n-dropdown>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              circle
              quaternary
              :disabled="caseStore.notFound || recordRunning"
              type="default"
              @click="handleClearAllSteps"
            >
              <template #icon>
                <n-icon size="20"><ClearOutlined /></n-icon>
              </template>
            </n-button>
          </template>
          {{ $t('tester.clear_all_steps') }}
        </n-tooltip>
      </div>
      <div class="status-box">{{ formatTesterStatus(caseStatus) }}</div>
    </div>
    <div class="content-box">
      <n-empty v-if="caseStore.notFound" :description="$t('tester.case_not_found')" class="step-list-empty" />
      <div v-else-if="!caseStore.loading && !caseStore.stepsLoading && stepList.length === 0" class="step-list-empty">
        <n-empty :description="$t('tester.no_step')">
          <template #extra>
            <n-button-group>
              <n-button size="small" type="info" ghost round dashed @click="onStartRecord">
                <template #icon>
                  <n-icon><Record20Regular /></n-icon>
                </template>
                {{ recordStore.recording ? $t('tester.stop_record') : $t('tester.start_record') }}
              </n-button>
              <n-button :loading="addLoading" size="small" type="info" ghost round dashed @click="addStep">
                <template #icon>
                  <n-icon v-if="!addLoading"><AddCircleOutline /></n-icon>
                </template>
                {{ $t('tester.add_step') }}
              </n-button>
            </n-button-group>
          </template>
        </n-empty>
      </div>
      <n-spin v-else :show="caseStore.stepsLoading" :description="`${$t('loading')}...`" :delay="300">
        <div class="step-list">
          <StepItem
            v-for="(item, index) in stepList"
            :key="item.id"
            :index="index"
            :step="item"
            :active="item.id === stepStore.step?.id"
            :is-open-browser="isOpenBrowser(stepList, index)"
            :readonly="recordRunning"
            :class="runCaseStore.statusMap[item.id]"
          />
        </div>
      </n-spin>
      <div class="step-info">
        <StepForm v-if="stepStore.stepForm.id" :readonly="recordRunning" />
        <n-empty v-else :description="$t('tester.step_form_empty_tip')">
          <template #icon>
            <n-icon size="35"><SelectWindow /></n-icon>
          </template>
        </n-empty>
      </div>
    </div>
  </div>
  <StartRecordOptionsModal ref="startRecordOptionsModalRef" />
</template>

<script setup lang="ts">
import { computed, h, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ClearOutlined from '@vicons/antd/ClearOutlined'
import SelectWindow from '@vicons/carbon/SelectWindow'
import Record20Regular from '@vicons/fluent/Record20Regular'
import IosArrowDown from '@vicons/ionicons4/IosArrowDown'
import AddCircleOutline from '@vicons/ionicons5/AddCircleOutline'
import ChevronBack from '@vicons/ionicons5/ChevronBack'
import CloudyOutline from '@vicons/ionicons5/CloudyOutline'
import LogoChrome from '@vicons/ionicons5/LogoChrome'
import IconPlay from '@vicons/ionicons5/Play'
import IconStop from '@vicons/ionicons5/Stop'
import CloudUpload from '@vicons/tabler/CloudUpload'
import { cloneDeep } from 'lodash-es'
import { NIcon } from 'naive-ui'
import { v4 as uuid } from 'uuid'
import { IBGuide } from '@/types'
import { IBCaseRunMode, IBCaseStep } from '@/types/tester'
import { IBConfig } from '@/config'
import { useGuideStore } from '@/store'
import { useCaseStepStore, useCaseStore, useRecordStore, useRunCaseStore } from '@/store/tester'
import { useTesterExt, useUnsavedConfirm } from '@/hooks'
import { CaseApi, RecordApi, StepApi } from '@/api/tester'
import IbSpinLoading from '@/components/IbSpinLoading.vue'
import { setTitle } from '@/plugins/vue-title'
import { formatTesterStatus } from '../../helpers'
import { isOpenBrowser, runCaseCountLimit } from '../helper'
import CaseConfigBar from './CaseConfigBar.vue'
import StartRecordOptionsModal from './StartRecordOptionsModal.vue'
import StepForm from './StepForm.vue'
import StepItem from './StepItem.vue'

const route = useRoute()
const router = useRouter()
const caseStore = useCaseStore()
const stepStore = useCaseStepStore()
const runCaseStore = useRunCaseStore()
const recordStore = useRecordStore()
const testerExt = useTesterExt()
const caseId = computed(() => route.params.caseId as string)
const recordId = ref(uuid())
// 需要组合已有步骤和录制的步骤
const stepList = computed(() => {
  let steps = cloneDeep(caseStore.steps)
  const recordSteps = cloneDeep(recordStore.steps)
  if (recordSteps.length) {
    steps.splice(recordStore.startIndex, 0, ...recordSteps)
  }
  steps = steps.map((item) => {
    const step = runCaseStore.steps.find((s) => s.id === item.id)
    return step || item
  })
  return steps
})
const showSaveBtn = computed(() => {
  return !recordStore.recording && recordStore.steps.length
})
const getCaseDetail = async () => {
  const c = await caseStore.getCase(caseId.value)
  runCaseStore.case = cloneDeep(c)
  setTitle(c.name)
}

onMounted(async () => {
  await getCaseDetail()
  await caseStore.getSteps()
  runCaseStore.getRunningRecord()
})

// const runMode = computed(() => runCaseStore.runMode)
const runMode = ref<IBCaseRunMode>('local')
const runOptions = [
  {
    label: window.$t('tester.local_run'),
    key: 'local',
    icon: () => h(NIcon, null, { default: () => h(LogoChrome) })
  },
  {
    label: window.$t('tester.remote_run'),
    key: 'remote',
    icon: () => h(NIcon, null, { default: () => h(CloudyOutline) })
  }
]
const handleSelectRunMode = (key: IBCaseRunMode) => {
  // runCaseStore.runMode = key
  runMode.value = key
  onRunOrStopCase()
}
const onBack = () => {
  router.back()
}
const startRecordOptionsModalRef = ref<InstanceType<typeof StartRecordOptionsModal>>()
const findOpenStep = (list: IBCaseStep[]) => {
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item.actionType === 'OPEN_URL') return item
    if (item.stepType === 'test_case' && item.childSteps) {
      return findOpenStep(item.childSteps)
    }
  }
  return null
}
const onStartRecord = async () => {
  if (caseStore.notFound || recordStore.recording) {
    recordStore.stop()
    return
  }
  if (!testerExt.checker()) return
  let url: string
  const openStep = findOpenStep(stepList.value)
  if (openStep) {
    url = openStep.actionValue
  } else if (caseStore.baseUrl) {
    url = caseStore.baseUrl
  } else {
    const options = (await startRecordOptionsModalRef.value!.show()) as Record<string, any>
    url = options.url
  }
  recordStore.start(
    caseId.value,
    url,
    { width: caseStore.case?.screenWidth || 1920, height: caseStore.case?.screenHeight || 1080 },
    stepList.value.length
  )
}
const addLoading = ref(false)
const addStep = async () => {
  addLoading.value = true
  try {
    await caseStore.addEmptyStep()
    await caseStore.getSteps()
  } finally {
    addLoading.value = false
  }
}
const saveLoading = ref(false)
const onSaveSteps = async () => {
  try {
    saveLoading.value = true
    const prevStepId = caseStore.steps[caseStore.steps.length - 1]?.id
    await StepApi.batchAdd(recordStore.steps, caseId.value, prevStepId)
    recordStore.$reset()
    await caseStore.getSteps()
  } finally {
    saveLoading.value = false
  }
}
const runLoading = ref(false)
const recordRunning = computed(() => {
  return runCaseStore.record?.status === 'running'
})
const onRunOrStopCase = async () => {
  // 如果正在运行
  if (recordRunning.value) {
    if (runMode.value === 'remote') {
      await RecordApi.stop(recordId.value)
      window.$message.success(window.$t('tester.stopped_run'))
      runCaseStore.changeRecordStatus(recordId.value, 'terminated')
    } else {
      runCaseStore.stopRun(recordId.value)
    }
    return
  }
  // 判断有没有未保存的录制，有的话先保存
  if (recordStore.steps.length !== 0) {
    await window.$confirm(
      window.$t(window.$t('tester.save_recorded_steps_first')),
      {
        type: 'warning',
        negativeText: window.$t('cancel'),
        positiveText: window.$t('save')
      },
      onSaveSteps
    )
  }
  if (runMode.value === 'remote') {
    runLoading.value = true
    try {
      const res = await CaseApi.run(caseId.value)
      recordId.value = res.id
    } catch (e) {
      if (!e.code) return
      runCaseCountLimit(e)
      return
    } finally {
      runLoading.value = false
    }
  }
  if (runMode.value === 'local' && !testerExt.checker()) return
  await runCaseStore.runCase({
    recordId: recordId.value,
    steps: stepList.value,
    remote: runMode.value === 'remote'
  })
}
const caseStatus = computed(() => runCaseStore.case?.lastRunStatus)
const caseStatusColor = computed(() => {
  const status = caseStatus.value
  if (!status) return 'transparent'
  switch (status) {
    case 'success':
      return '#6cb015'
    case 'starting':
    case 'running':
      return '#1b73f8'
    case 'failed':
    case 'error':
      return '#e6000f'
  }
})

/**
 * 清空所有步骤，包含未保存步骤
 */
const handleClearAllSteps = async () => {
  await window.$confirm(window.$t('tester.clear_all_steps_confirm'), { type: 'warning' }, async () => {
    await recordStore.clearSteps()
    await caseStore.clearSteps()
  })
}

useUnsavedConfirm({
  basis: () => recordStore.steps.length !== 0,
  onSave: onSaveSteps
})

// 导览
const guideIng = ref(false)
const guideStore = useGuideStore()
const text = IBConfig.APP_CHINA ? 'itbuilder' : 'softfactory'
const guideItems: IBGuide = {
  key: 'caseDetail',
  steps: [
    {
      title: window.$t('tester.guide_record_title'),
      content: window.$t('tester.guide_record_content'),
      tip: window.$t('tester.guide_record_tip'),
      tipUrl: IBConfig.DOCS_URL + `/docs/autotest/record-test/why-${text}-extension`,
      placement: 'bottom-end',
      selector: '#app .inner-detail > .step-container .right-tools > button:nth-child(1)'
    },
    {
      title: window.$t('tester.guide_run_title'),
      content: window.$t('tester.guide_run_content'),
      tip: window.$t('tester.guide_run_tip'),
      tipUrl: IBConfig.DOCS_URL + '/docs/autotest/running-test/run-limitations',
      placement: 'bottom-end',
      selector: 'body > div.v-binder-follower-container > div > div > div:nth-child(2)',
      offset: { x: -30, y: 10 },
      beforeShow: () => {
        guideIng.value = true
      },
      afterShow: () => {
        guideIng.value = false
      }
    }
  ]
}
onMounted(() => guideStore.addGuide(guideItems))

onUnmounted(() => {
  runCaseStore.record = null
  caseStore.$reset()
  caseStore.$dispose()
  stepStore.$reset()
  stepStore.$dispose()
  runCaseStore.$reset()
  runCaseStore.$dispose()
  recordStore.stop()
  recordStore.$reset()
  recordStore.$dispose()
})
</script>

<style src="./detail.scss" scoped lang="scss"></style>
