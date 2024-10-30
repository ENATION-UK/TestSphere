<template>
  <div class="config-bar">
    <div class="item">
      <span>{{ $t('tester.resolution') }}: </span>
      <n-button size="tiny" round quaternary :focusable="false" :disabled="disabled" @click="onConfigResolution">
        {{ caseStore.resolution }}
        <div class="icon-pen">
          <n-icon color="#ffffff">
            <Edit20Regular />
          </n-icon>
        </div>
      </n-button>
    </div>
    <div class="item">
      <span>{{ $t('base_url') }}: </span>
      <n-button size="tiny" round quaternary :focusable="false" :disabled="disabled" @click="onConfigBaseUrl">
        {{ caseStore.baseUrl || $t('not_configured') }}
        <div class="icon-pen">
          <n-icon color="#ffffff">
            <Edit20Regular />
          </n-icon>
        </div>
      </n-button>
    </div>
  </div>
  <n-modal
    v-model:show="showResolutionModal"
    :title="$t('tester.config_screen_resolution')"
    :show-icon="false"
    :close-on-esc="false"
    :mask-closable="false"
    :auto-focus="false"
    :positive-text="$t('confirm')"
    :loading="saveResolutionLoading"
    @positiveClick="handleConfirmResolution"
    transform-origin="center"
    preset="dialog"
    style="width: 350px"
  >
    <div class="config-resolution">
      <n-select v-model:value="resolution" :options="screenResolutionOptions" />
    </div>
  </n-modal>
  <n-modal
    v-model:show="showBaseUrlModal"
    :title="$t('tester.config_base_url')"
    :show-icon="false"
    :close-on-esc="false"
    :mask-closable="false"
    :auto-focus="false"
    :positive-text="$t('confirm')"
    :loading="saveBaseUrlModalLoading"
    @positiveClick="handleConfirmBaseUrl"
    transform-origin="center"
    preset="dialog"
    style="width: 400px"
  >
    <n-form ref="urlFormRef" :model="urlForm" :rules="urlFormRules">
      <n-form-item path="baseUrl">
        <n-input
          ref="urlInputRef"
          v-model:value="urlForm.baseUrl"
          clearable
          :placeholder="$t('tester.test_url_placeholder')"
          @keyup.enter="handleConfirmBaseUrl"
        />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Edit20Regular from '@vicons/fluent/Edit20Regular'
import { FormInst, FormRules } from 'naive-ui'
import { IBCase } from '@/types/tester'
import { useCaseStore } from '@/store/tester'
import { screenResolutionOptions } from '../../helpers'

const caseStore = useCaseStore()

const disabled = computed(() => caseStore.notFound)
const resolution = ref('')
const showResolutionModal = ref(false)
const onConfigResolution = () => {
  const sp = caseStore.resolution.split('x')
  if (sp && sp.length === 2) {
    resolution.value = `${sp[0]}x${sp[1]}`
  } else {
    resolution.value = ''
  }
  showResolutionModal.value = true
}
const saveResolutionLoading = ref(false)
const handleConfirmResolution = async () => {
  if (!resolution.value) return false
  const sps = resolution.value.split('x')
  const params: Partial<IBCase> = { screenWidth: Number(sps[0]), screenHeight: Number(sps[1]) }
  saveResolutionLoading.value = true
  try {
    await caseStore.updateCase(caseStore.case!.id, params)
    showResolutionModal.value = false
    window.$message.success(window.$t('save_success'))
  } finally {
    saveResolutionLoading.value = false
  }
}

const urlForm = ref({ baseUrl: '' })
const urlFormRef = ref<FormInst>()
const urlFormRules: FormRules = {
  baseUrl: {
    required: true,
    validator: (rule, value: string) => {
      if (!value) return new Error(window.$t('tester.test_url_placeholder'))
      return true
    },
    trigger: 'blur'
  }
}
const baseUrl = ref('')
const showBaseUrlModal = ref(false)
const onConfigBaseUrl = () => {
  const url = caseStore.baseUrl
  if (url) {
    urlForm.value.baseUrl = url
  }
  showBaseUrlModal.value = true
}
const saveBaseUrlModalLoading = ref(false)
const handleConfirmBaseUrl = async () => {
  await urlFormRef.value?.validate()
  saveBaseUrlModalLoading.value = true
  const params: Partial<IBCase> = { baseUrl: urlForm.value.baseUrl }
  try {
    await caseStore.updateCase(caseStore.case!.id, params)
    showBaseUrlModal.value = false
    window.$message.success(window.$t('save_success'))
  } finally {
    saveBaseUrlModalLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.config-bar {
  display: flex;
  align-items: center;
  margin-left: auto;
  .item {
    & + .item {
      margin-left: 12px;
    }
    &:last-child {
      margin-right: 12px;
    }
    :deep(.n-button) {
      padding-right: 0;
      &:not(.n-button--disabled):hover {
        background-color: #e8e9f0;
        .icon-pen {
          opacity: 1;
        }
      }
    }
    .icon-pen {
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      width: 22px;
      height: 22px;
      margin-left: 5px;
      border-radius: 50%;
      background-color: #9ea0ab;
      transition: opacity 0.2s var(--bezier);
    }
  }
}
</style>
