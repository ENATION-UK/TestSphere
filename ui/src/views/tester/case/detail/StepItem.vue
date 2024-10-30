<template>
  <div class="step-item">
    <div v-if="index === 0 && !readonly" class="arrow-box enable-add first-add" @click="addStep(true)">
      <n-icon :component="PlayOutline" size="22" color="#999999" class="icon-play" />
      <n-tooltip trigger="hover">
        <template #trigger>
          <IbSpinLoading v-if="addLoading" class="icon-add" />
          <n-icon v-else :component="AddCircleSharp" size="22" color="#5083F8" class="icon-add" />
        </template>
        {{ $t('tester.insert_step') }}
      </n-tooltip>
    </div>
    <div class="step-badge">
      <n-icon size="16">
        <LogoChrome v-if="isOpenBrowser" />
        <Board28Filled v-else-if="step.stepType === 'test_case'" />
        <BracesVariable24Filled v-else-if="step.stepType === 'variable'" />
        <WarningRound v-else-if="step.stepType === 'check'" />
        <MouseRound v-else-if="step.actionType === 'UI_CLICK'" />
        <CursorHover24Filled v-else-if="step.actionType === 'UI_HOVER'" />
        <KeyboardRound v-else-if="step.actionType === 'UI_KEY'" />
        <TextEditStyle20Filled v-else-if="step.actionType === 'UI_INPUT'" />
        <RadioButtonOnOutline v-else-if="step.actionType === 'UI_CHANGE'" />
        <Selector v-else-if="step.actionType === 'UI_SELECT'" />
        <PhoneVerticalScroll24Filled v-else-if="step.actionType === 'UI_SCROLL'" />
        <DriveFolderUploadRound v-else-if="step.actionType === 'UI_FILE'" />
        <BackspaceRound v-else-if="step.actionType === 'TAB_CLOSE'" />
        <AddLinkSharp v-else-if="step.actionType === 'OPEN_URL'" />
        <Javascript20Filled v-else-if="step.actionType === 'JAVASCRIPT'" />
        <template v-else-if="step.actionType === 'BROWSER_STORAGE'">
          <CookieOutlined v-if="step.valueType === 'Cookie'" />
          <BlockStorageAlt v-else />
        </template>
      </n-icon>
      <svg class="step-spinner" width="38px" height="38px" viewBox="-19 -19 38 38" xmlns="http://www.w3.org/2000/svg">
        <circle
          class="step-spinner-circle"
          fill="none"
          stroke-width="3"
          stroke-linecap="round"
          cx="-.5"
          cy="-.5"
          r="17"
        ></circle>
      </svg>
    </div>
    <div class="step-name" :class="{ active }" @click="clickStep">
      <n-ellipsis style="max-width: 120px" :tooltip="false"> {{ index + 1 }}.&nbsp;{{ step.name }}</n-ellipsis>
      <div v-if="!readonly" class="delete-box" @click.stop="handleClose">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-icon :component="TrashOutline" class="icon-close" />
          </template>
          {{ $t('tester.del_step') }}
        </n-tooltip>
      </div>
    </div>
    <div v-if="readonly" class="arrow-box">
      <n-icon :component="PlayOutline" size="22" color="#999999" class="icon-play" />
    </div>
    <div v-else class="arrow-box enable-add" @click="addStep(false)">
      <n-icon :component="PlayOutline" size="22" color="#999999" class="icon-play" />
      <n-tooltip trigger="hover">
        <template #trigger>
          <IbSpinLoading v-if="addLoading" class="icon-add" />
          <n-icon v-else :component="AddCircleSharp" size="22" color="#5083F8" class="icon-add" />
        </template>
        {{ $t('tester.insert_step') }}
      </n-tooltip>
    </div>
    <div v-if="step.lastRunStatus === 'failed' && step.failReason" class="failed-box">
      <n-ellipsis :tooltip="false" style="max-width: 120px">{{ getFailReasonStr(step.failReason) }}</n-ellipsis>
      <n-button text size="tiny" @click="seeDetail(step)">{{ $t('tester.detail') }}</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import BlockStorageAlt from '@vicons/carbon/BlockStorageAlt'
import Board28Filled from '@vicons/fluent/Board28Filled'
import BracesVariable24Filled from '@vicons/fluent/BracesVariable24Filled'
import CursorHover24Filled from '@vicons/fluent/CursorHover24Filled'
import Javascript20Filled from '@vicons/fluent/Javascript20Filled'
import PhoneVerticalScroll24Filled from '@vicons/fluent/PhoneVerticalScroll24Filled'
import TextEditStyle20Filled from '@vicons/fluent/TextEditStyle20Filled'
import Timer24Filled from '@vicons/fluent/Timer24Filled'
import AddCircleSharp from '@vicons/ionicons5/AddCircleSharp'
import LogoChrome from '@vicons/ionicons5/LogoChrome'
import PlayOutline from '@vicons/ionicons5/PlayOutline'
import RadioButtonOnOutline from '@vicons/ionicons5/RadioButtonOnOutline'
import TrashOutline from '@vicons/ionicons5/TrashOutline'
import AddLinkSharp from '@vicons/material/AddLinkSharp'
import BackspaceRound from '@vicons/material/BackspaceRound'
import CookieOutlined from '@vicons/material/CookieOutlined'
import DriveFolderUploadRound from '@vicons/material/DriveFolderUploadRound'
import KeyboardRound from '@vicons/material/KeyboardRound'
import MouseRound from '@vicons/material/MouseRound'
import WarningRound from '@vicons/material/WarningRound'
import Selector from '@vicons/tabler/Selector'
import { NIcon, NImage } from 'naive-ui'
import { IBCaseStep } from '@/types/tester'
import { useCaseStepStore, useCaseStore, useRecordStore } from '@/store/tester'
import { StepApi } from '@/api/tester'
import IbSpinLoading from '@/components/IbSpinLoading.vue'
import { isRecordStep } from '../helper'

const props = withDefaults(
  defineProps<{
    step: IBCaseStep
    active: boolean
    index: number
    readonly?: boolean
    isOpenBrowser?: boolean
  }>(),
  {
    readonly: false
  }
)
// 防止有些错误信息是对象
const getFailReasonStr = (failReason: any) => {
  if (!failReason) return ''
  if (typeof failReason === 'string') return failReason
  if (typeof failReason === 'object') return JSON.stringify(failReason)
  return failReason
}
const seeDetail = (step: IBCaseStep) => {
  window.$dialog.create({
    title: window.$t('tester.failed_detail'),
    showIcon: false,
    autoFocus: false,
    transformOrigin: 'center',
    content: () =>
      h('div', null, [
        h(
          'div',
          { style: 'word-break: break-all; color: #f73c3c; margin-bottom: 12px;' },
          { default: () => getFailReasonStr(step.failReason) }
        ),
        step.failScreenshot ? h(NImage, { src: step.failScreenshot, width: 150 }) : undefined
      ])
  })
}
// 删除步骤
const handleClose = async () => {
  const stepId = props.step.id
  if (isRecordStep(stepId)) {
    await window.$confirm(window.$t('tester.del_step_confirm'), { type: 'warning' })
    useRecordStore().deleteStep(stepId)
  } else {
    useCaseStore().deleteStep(stepId)
  }
}
const clickStep = () => {
  useCaseStepStore().setForm(props.step)
}
// 添加步骤
const addLoading = ref(false)
const addStep = async (before: boolean) => {
  const recordStore = useRecordStore()
  const caseStore = useCaseStore()
  if (recordStore.steps.length !== 0) {
    await window.$confirm(
      window.$t(window.$t('tester.save_recorded_steps_first')),
      {
        type: 'warning',
        negativeText: window.$t('cancel'),
        positiveText: window.$t('save')
      },
      async () => {
        const prevStepId = caseStore.steps[caseStore.steps.length - 1]?.id
        await StepApi.batchAdd(recordStore.steps, caseStore.case!.id, prevStepId)
        recordStore.$reset()
        await caseStore.getSteps()
      }
    )
  }
  try {
    addLoading.value = true
    const prevStepId = props.index === 0 && before ? undefined : props.step.id
    await caseStore.addEmptyStep(prevStepId)
    let addIndex = -1
    if (prevStepId !== undefined) {
      addIndex = caseStore.steps.findIndex((item) => item.id === prevStepId)
      if (addIndex === -1) return
    }
    addIndex += 1
    const addStep = caseStore.steps[addIndex]
    if (!addStep) return
    useCaseStepStore().setForm(addStep)
  } finally {
    addLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.step-item {
  position: relative;
  display: flex;
  align-items: center;
  width: 25%;
  margin-bottom: 35px;
  padding-left: 2%;
  box-sizing: border-box;
  user-select: none;
  &.running {
    .step-spinner {
      display: block !important;
    }
  }
  &.success {
    .step-badge {
      color: #ffffff;
      background-color: #5fad65;
    }
    .step-name {
      border-color: #5fad65;
      border-width: 2px;
    }
  }
  &.failed {
    .step-badge {
      color: #ffffff;
      background-color: #f73c3c;
    }
    .step-name {
      border-color: #f73c3c;
      border-width: 2px;
    }
  }
  .step-badge {
    position: absolute;
    z-index: 2;
    top: -12px;
    left: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1px solid #e3e0e0;
    border-radius: 50%;
    background-color: #ffffff;
    color: #666666;
    @keyframes step_rotator {
      0% {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      to {
        transform: translate(-50%, -50%) rotate(270deg);
      }
    }
    @keyframes step_step-icon-draw {
      0% {
        stroke-dashoffset: 81.15506;
      }
      50% {
        stroke-dashoffset: 20.28876;
        transform: rotate(135deg);
      }
      to {
        stroke-dashoffset: 81.15506;
        transform: rotate(450deg);
      }
    }
    .step-spinner {
      display: none;
      position: absolute;
      animation: step_rotator 2s linear infinite;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      transform-origin: calc(50% - 0.5px) calc(50% - 0.5px);
      &-circle {
        stroke-dashoffset: 0;
        stroke: #3d5afe;
        stroke-dasharray: 106.12585;
        animation: 2s ease-in-out infinite;
        animation-name: step_step-icon-draw;
        transform-origin: -0.5px -0.5px;
      }
    }
  }
  .step-name {
    display: flex;
    align-items: center;
    position: relative;
    width: 80%;
    height: 48px;
    flex-shrink: 0;
    border: 1px solid #e3e0e0;
    padding: 12px 10px;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: 4px;
    &.active {
      border-color: #4f73ec;
    }
    &:hover {
      .delete-box {
        opacity: 1;
      }
    }
    .delete-box {
      opacity: 0;
      position: absolute;
      right: -10px;
      top: -10px;
      transition: opacity 0.2s ease;
      :deep(.n-icon) {
        font-size: 14px !important;
        color: #ffffff;
        background-color: #e70b0b;
        border-radius: 50%;
        padding: 4px;
        border: 2px solid #fff;
        box-sizing: content-box;
      }
    }
  }
  .arrow-box {
    flex: 1;
    margin-left: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .icon-play,
    .icon-add {
      position: absolute;
      transition: opacity 0.2s ease;
    }
    &.enable-add {
      cursor: pointer;
      &:hover {
        .icon-play {
          opacity: 0;
        }
        .icon-add {
          opacity: 1;
        }
      }
    }
    .icon-play {
      opacity: 1;
    }
    .icon-add {
      opacity: 0;
    }
  }
  .first-add {
    position: absolute;
    margin-left: 0;
    left: -10px;
    height: 100%;
  }
  .failed-box {
    position: absolute;
    bottom: -22px;
    color: #f73c3c;
    font-size: 12px;
  }
}
.step-info {
  padding: 12px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-left: 1px solid #c7c7c7;
}
</style>
