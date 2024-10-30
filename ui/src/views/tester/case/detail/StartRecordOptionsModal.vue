<template>
  <n-modal
    v-model:show="showModal"
    :auto-focus="false"
    :closable="false"
    :show-icon="false"
    :close-on-esc="false"
    :mask-closable="false"
    :negative-text="$t('cancel')"
    :positive-text="$t('confirm')"
    transform-origin="center"
    preset="dialog"
    @negative-click="handleNegativeClick"
    @positive-click="handlePositiveClick"
  >
    <n-form ref="formRef" :model="form" :rules="formRules" label-placement="top">
      <n-form-item :label="$t('tester.test_url')" path="url">
        <n-input
          ref="urlInputRef"
          v-model:value="form.url"
          :placeholder="$t('tester.test_url_placeholder')"
          @keyup.enter="handlePositiveClick"
        />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { FormInst, FormRules, InputInst } from 'naive-ui'
import { regExp } from '@/utils'

const showModal = ref(false)
let promise = {} as { resolve?: (value: Record<string, any>) => void; reject?: () => void }

const urlInputRef = ref<InputInst>()
const show = (): Promise<Record<string, any>> => {
  form.value.url = ''
  showModal.value = true
  nextTick(() => urlInputRef.value?.focus())
  return new Promise((resolve, reject) => {
    promise.resolve = resolve
    promise.reject = reject
  })
}
const form = ref({ url: '' })
const formRef = ref<FormInst>()
const formRules: FormRules = {
  url: {
    required: true,
    validator: (rule, value: string) => {
      if (!value) return new Error(window.$t('tester.test_url_placeholder'))
      return true
    },
    trigger: 'blur'
  }
}

const handlePositiveClick = async () => {
  await formRef.value?.validate()
  const data = cloneDeep(form.value)
  promise.resolve && promise.resolve(data)
  showModal.value = false
  delete promise.resolve
}
const handleNegativeClick = () => {
  promise.reject && promise.reject()
  showModal.value = false
  delete promise.reject
}

defineExpose({ show })
</script>

<style scoped lang="scss"></style>
