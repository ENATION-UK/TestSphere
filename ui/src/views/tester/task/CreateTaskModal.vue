<template>
  <n-modal
    v-model:show="showModal"
    :title="$t('tester.create_task')"
    :mask-closable="false"
    :close-on-esc="false"
    :show-icon="false"
    :auto-focus="false"
    :loading="createLoading"
    :negative-text="$t('cancel')"
    :positive-text="$t('confirm')"
    @positive-click="handleCreateTask"
    preset="dialog"
    transform-origin="center"
    style="width: 450px"
  >
    <div class="modal-hr top" />
    <n-form ref="formRef" :model="form" :rules="formRules">
      <n-form-item :label="$t('tester.task_name')" path="taskName">
        <n-input
          ref="nameInputRef"
          v-model:value="form.taskName"
          :maxlength="20"
          :placeholder="$t('tester.task_name_placeholder')"
          @keyup.enter="handleCreateTask"
        />
      </n-form-item>
      <n-form-item :label="$t('tester.case_group')" path="groupId" class="group">
        <n-tree-select
          v-model:value="form.groupId"
          :options="groupList"
          :placeholder="$t('tester.task_name_placeholder')"
        />
        <div class="case-total">{{ $t('tester.task_run_case_count', { count: caseCount }) }}</div>
      </n-form-item>
    </n-form>
    <div class="modal-hr bottom" />
  </n-modal>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import { FormInst, FormRules, InputInst } from 'naive-ui'
import { useCasesStore } from '@/store/tester'
import { CaseApi, GroupApi } from '@/api/tester'
import { groupAll, mapGroupTree, runCaseCountLimit } from '@/views/tester/case/helper'

const showModal = ref(false)
const caseCount = ref(0)
const createLoading = ref(false)
const caseTotalLoading = ref(false)
const form = ref({ taskName: '', groupId: 'all' })
const formRef = ref<FormInst>()
const formRules: FormRules = {
  taskName: { required: true, message: window.$t('tester.task_name_placeholder'), trigger: 'blur' },
  groupId: {
    key: 'groupId',
    required: true,
    validator: (rule, value) => {
      if (!value) return new Error(window.$t('tester.task_group_placeholder'))
      if (!caseCount.value) return new Error(window.$t('tester.task_group_empty_case'))
      return true
    },
    trigger: 'change'
  }
}

const casesStore = useCasesStore()
const groupList = computed(() => {
  const { groupTree } = casesStore
  if (!groupTree || !groupTree.length) return [groupAll]
  const list = mapGroupTree(groupTree)
  list.splice(0, 0, groupAll)
  return list
})

const nameInputRef = ref<InputInst>()
let callback: () => Promise<void> | null = null
const show = (call: () => Promise<void>) => {
  callback = call
  casesStore.getGroupTree()
  form.value.taskName = ''
  showModal.value = true
  nextTick(() => {
    nameInputRef.value?.focus()
  })
}
const getCaseTotal = async () => {
  caseTotalLoading.value = true
  try {
    let { groupId } = form.value
    if (groupId === 'all') groupId = ''
    caseCount.value = await GroupApi.caseCount(groupId)
    formRef.value?.validate(
      () => {},
      (rule) => rule.key === 'groupId'
    )
  } finally {
    caseTotalLoading.value = false
  }
}
watch(
  () => form.value.groupId,
  () => getCaseTotal(),
  { immediate: true }
)
const handleCreateTask = async () => {
  try {
    await formRef.value?.validate()
    createLoading.value = true
    const params = cloneDeep(form.value)
    if (params.groupId === 'all') params.groupId = ''
    await CaseApi.runGroup(params.groupId, params.taskName)
    window.$message.success(window.$t('tester.run_group_success'))
    if (callback !== null) await callback()
    showModal.value = false
  } catch (e) {
    if (!e.code) return false
    runCaseCountLimit(e)
    return false
  } finally {
    createLoading.value = false
  }
}
defineExpose({ show })
</script>

<style scoped lang="scss">
:deep(.n-form-item.group) {
  .n-form-item-blank {
    flex-direction: column;
    align-items: flex-start;
  }
}
.case-total {
  color: #666666;
  font-size: 13px;
  margin-top: 10px;
}
.modal-hr.bottom {
  margin-top: 10px;
}
</style>
