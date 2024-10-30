<template>
  <n-modal
    v-model:show="showModal"
    :closable="false"
    :show-icon="false"
    :close-on-esc="false"
    :mask-closable="false"
    :negative-text="$t('cancel')"
    :positive-text="$t('confirm')"
    transform-origin="center"
    preset="dialog"
    @positive-click="confirmSubmit"
  >
    <n-form ref="formRef" :model="form" :rules="formRules" label-placement="top" @keyup.enter="confirmSubmit">
      <n-form-item :label="$t('tester.case_name')" path="name">
        <n-input
          v-model:value="form.name"
          :placeholder="$t('tester.case_name_placeholder')"
          maxlength="20"
          clearable
          show-count
        />
      </n-form-item>
      <n-form-item :label="$t('tester.case_group')" path="groupId">
        <n-tree-select
          v-model:value="form.groupId"
          :options="casesStore.groupTree"
          key-field="id"
          label-field="name"
          show-path
          :placeholder="$t('tester.case_group_placeholder')"
        />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInst, FormRules } from 'naive-ui'
import { IBCase } from '@/types/tester'
import { useCasesStore } from '@/store/tester'
import { CaseApi } from '@/api/tester'

const casesStore = useCasesStore()
const showModal = ref(false)
const promise = { resolve: (value?: IBCase): void => {}, reject: (e: any): void => {} }
const show = (item?: Partial<IBCase>): Promise<IBCase | unknown> => {
  return new Promise((resolve, reject) => {
    form.value.id = item?.id || ''
    form.value.name = item?.name || ''
    form.value.groupId = item?.groupId || ''
    form.value.groupSn = item?.groupSn || ''
    if (form.value.groupId === 'all') form.value.groupId = ''
    promise.resolve = resolve
    promise.reject = reject
    showModal.value = true
  })
}
const form = ref({
  id: '',
  name: '',
  groupId: '',
  groupSn: ''
})
const formRef = ref<FormInst>()
const formRules: FormRules = {
  name: { required: true, message: window.$t('tester.case_name_placeholder'), trigger: 'blur' },
  groupId: { required: true, message: window.$t('tester.case_group_placeholder'), trigger: 'change' }
}

const submitLoading = ref(false)
const confirmSubmit = async () => {
  await formRef.value?.validate()
  try {
    submitLoading.value = true
    const { id, ...data } = form.value
    const groupSn = casesStore.groupIdSnMapping[data.groupId]
    if (groupSn) data.groupSn = groupSn
    if (id) {
      await CaseApi.update(id, data)
      promise.resolve()
    } else {
      const caseInfo = await CaseApi.add(data)
      promise.resolve(caseInfo)
    }
    showModal.value = false
  } catch (e) {
    promise.reject(e)
  } finally {
    submitLoading.value = false
  }
}

defineExpose({ show })
</script>

<style scoped lang="scss"></style>
