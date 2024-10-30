<template>
  <div class="step-container">
    <div class="tools-bar">
      <div class="left-tools">
        <div class="back-icon" @click="onBack">
          <n-icon size="20"><ChevronBack /></n-icon>
        </div>
        <router-link
          v-if="recordInfo"
          :to="{ name: 'testerCaseDetail', params: { caseId: recordInfo.testCaseId } }"
          class="underline"
        >
          {{ recordInfo.testCaseName }}
        </router-link>
      </div>
      <div class="right-tools"></div>
    </div>
    <div class="content-box">
      <div v-if="stepList.length" class="step-list">
        <StepItem
          v-for="(item, index) in stepList"
          :key="item.id"
          :index="index"
          :step="item"
          :active="item.id === stepForm?.id"
          :is-open-browser="isOpenBrowser(stepList, index)"
          :class="item.lastRunStatus"
          readonly
          @click="onEditStep(item)"
        />
        <div v-if="params.pageNo !== pageRes?.pages" class="load-more">
          <n-button :loading="stepListLoading" text type="info" size="small" @click="loadMore">
            {{ $t('tester.load_more') }}...
          </n-button>
        </div>
      </div>
      <div v-else class="step-list-empty">
        <n-empty :description="$t('tester.no_step')" />
      </div>
      <div class="step-info">
        <StepForm readonly />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChevronBack from '@vicons/ionicons5/ChevronBack'
import { NIcon } from 'naive-ui'
import { IBPagerRes } from '@/types'
import { IBCaseRecord, IBCaseRecordStepsQuery, IBCaseStep } from '@/types/tester'
import { RecordApi } from '@/api/tester'
import StepForm from '../case/detail/StepForm.vue'
import StepItem from '../case/detail/StepItem.vue'
import { isOpenBrowser } from '../case/helper'

const router = useRouter()
const route = useRoute()
const onBack = () => {
  router.back()
}
const recordId = computed(() => route.params.historyId as string)
const recordInfo = ref<IBCaseRecord>()
const recordInfoLoading = ref(false)
const getRecordInfo = async () => {
  try {
    recordInfoLoading.value = true
    recordInfo.value = await RecordApi.detail(recordId.value)
  } finally {
    recordInfoLoading.value = false
  }
}
onMounted(() => getRecordInfo())
const params = ref<IBCaseRecordStepsQuery>({
  pageNo: 1,
  pageSize: 30,
  recordId: route.params.historyId as string
})
const pageRes = ref<IBPagerRes>()
const stepList = ref<IBCaseStep[]>([])
const stepListLoading = ref(false)
const getSteps = async () => {
  try {
    stepListLoading.value = true
    const res = await RecordApi.steps(params.value)
    pageRes.value = res
    if (params.value.pageNo === 1) {
      stepList.value = res.records
    } else {
      stepList.value.push(...res.records)
    }
  } finally {
    stepListLoading.value = false
  }
}
onMounted(() => getSteps())
const loadMore = () => {
  params.value.pageNo += 1
  getSteps()
}
const stepForm = ref<IBCaseStep>()
const onEditStep = (item: IBCaseStep) => {
  stepForm.value = item
}
</script>

<style scoped lang="scss">
.step-container {
  width: 100%;
  height: 100%;
  padding-top: 24px;
  box-sizing: border-box;
}
.tools-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid var(--border-color);
}
.left-tools {
  display: flex;
  align-items: center;
  gap: 8px 12px;
  .back-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 1px solid var(--border-color);
    box-sizing: border-box;
    border-radius: 4px;
    cursor: pointer;
  }
}
.right-tools {
  display: flex;
  align-items: center;
  gap: 8px 12px;
}
.content-box {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc(100% - 60px);
  .step-list {
    flex: 1;
  }
  .step-info {
    position: relative;
    z-index: 2;
    width: 220px;
    flex-shrink: 0;
    padding: 24px 12px;
    box-sizing: border-box;
    :deep(.n-input--disabled) {
      border: none;
      color: #333333 !important;
      background-color: #ffffff;
      .n-input__input-el,
      .n-input__textarea-el {
        color: inherit !important;
      }
    }
  }
}
.step-list {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding-top: 24px;
  padding-right: 12px;
  border-right: 1px solid #dfdfdf;
  box-sizing: border-box;
}
.load-more {
  padding-top: 12px;
  padding-left: 20px;
}
.step-list-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 300px;
}
</style>
