<template>
  <div class="step-form">
    <n-form ref="formRef" :model="stepStore.stepForm" :rules="formRules" size="small">
      <n-form-item :label="$t('tester.step_name')" path="name">
        <n-input
          v-model:value="stepStore.stepForm.name"
          :disabled="readonly"
          :placeholder="$t('tester.step_name_placeholder')"
        />
      </n-form-item>
      <n-form-item :label="$t('tester.step_type')">
        <n-select
          v-model:value="stepStore.stepForm.stepType"
          :options="stepTypes"
          :disabled="readonly"
          @update:value="handleStepTypeChange"
        />
      </n-form-item>
      <!--步骤表单-->
      <template v-if="form.stepType === 'step'">
        <n-form-item :label="$t('tester.step_action')">
          <template #label>
            <div style="display: flex; align-items: center">
              <span style="margin-right: 5px">{{ $t('tester.step_action') }}</span>
              <n-tooltip v-if="form.actionType === 'UI_HOVER'">
                <div style="max-width: 210px; word-break: break-all">{{ $t('tester.step_action_hover_tip') }}</div>
                <template #trigger>
                  <n-icon color="var(--error-color)" style="cursor: pointer"><WarningOutlined /></n-icon>
                </template>
              </n-tooltip>
            </div>
          </template>
          <n-select
            v-model:value="stepStore.stepForm.actionType"
            :options="actionTypes"
            :disabled="readonly"
            :placeholder="$t('tester.step_action_placeholder')"
            @update:value="handleActionTypeChange"
          />
        </n-form-item>
        <n-form-item v-if="showActionValue" path="actionValue" class="action-value">
          <template #label>
            <span>{{ getActionLabel(stepStore.stepForm.actionType) }}</span>
            <n-checkbox
              v-if="stepStore.stepForm.actionType === 'UI_INPUT'"
              v-model:checked="stepStore.stepForm.valueType as boolean"
              checked-value="Javascript"
              :unchecked-value="null"
              :disabled="readonly"
              size="small"
            >
              {{ $t('tester.javascript') }}
            </n-checkbox>
            <n-button
              v-if="stepStore.stepForm.actionType === 'JAVASCRIPT'"
              text
              :disabled="readonly"
              @click="handleFullscreen('javascript')"
            >
              <template #icon>
                <n-icon><FullscreenOutlined /></n-icon>
              </template>
            </n-button>
          </template>
          <n-input
            v-model:value="stepStore.stepForm.actionValue"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            :disabled="readonly"
            placeholder=""
          />
        </n-form-item>
        <template v-if="showXpathForm">
          <n-form-item :label="$t('tester.locator')" path="actionTarget" class="action-value">
            <template #label>
              <span>{{ $t('tester.locator') }}</span>
              <n-button text :disabled="readonly" @click="handleFullscreen('locator')">
                <template #icon>
                  <n-icon><FullscreenOutlined /></n-icon>
                </template>
              </n-button>
            </template>
            <n-input
              v-model:value="stepStore.stepForm.actionTarget"
              type="textarea"
              :disabled="stepStore.stepForm.actionType === 'RUN_CASE' || readonly"
              :autosize="{ minRows: 3, maxRows: 6 }"
              :placeholder="$t('tester.step_selector_placeholder')"
            />
          </n-form-item>
        </template>
        <!--数据存储-->
        <template v-if="stepStore.stepForm.actionType === 'BROWSER_STORAGE'">
          <n-form-item :label="$t('tester.storage_type')">
            <n-select v-model:value="stepStore.stepForm.valueType" :options="storageTypes" />
          </n-form-item>
          <n-form-item label="Name" required>
            <n-input
              v-model:value="storageJson.name"
              :disabled="readonly"
              :maxlength="100"
              :placeholder="$t('tester.storage_name_placeholder')"
            />
          </n-form-item>
          <n-form-item required>
            <template #label>
              <span>Value</span>
              <n-button
                text
                :disabled="readonly"
                @click="handleFullscreen('storageJson.value')"
                class="storage-fullscreen-btn"
              >
                <template #icon>
                  <n-icon><FullscreenOutlined /></n-icon>
                </template>
              </n-button>
            </template>
            <n-input
              v-model:value="storageJson.value"
              type="textarea"
              :disabled="readonly"
              :autosize="{ minRows: 3, maxRows: 6 }"
              :maxlength="9999"
              :placeholder="$t('tester.storage_value_placeholder')"
            />
          </n-form-item>
          <template v-if="stepStore.stepForm.valueType === 'Cookie'">
            <n-form-item label="Domain">
              <n-input
                v-model:value="storageJson.domain"
                :disabled="readonly"
                placeholder="*.example.com"
                :maxlength="100"
              />
            </n-form-item>
            <n-form-item label="Path">
              <n-input v-model:value="storageJson.path" :disabled="readonly" :maxlength="100" placeholder="" />
            </n-form-item>
            <n-form-item label="Expires">
              <n-select
                v-model:value="storageJson.expires"
                :options="cookieExpiresOptions"
                :disabled="readonly"
                clearable
                placeholder=""
              />
            </n-form-item>
            <n-form-item label="SameSite">
              <n-select
                v-model:value="storageJson.sameSite"
                :options="sameSiteOptions"
                :disabled="readonly"
                clearable
                placeholder=""
              />
            </n-form-item>
            <n-form-item label="Secure" label-placement="left">
              <n-checkbox v-model:checked="storageJson.secure" :disabled="readonly" />
            </n-form-item>
          </template>
        </template>
      </template>
      <!--用例表单-->
      <template v-else-if="form.stepType === 'test_case'">
        <n-form-item :label="$t('tester.test_case')" path="actionValue">
          <n-tag v-if="form.actionTarget" type="info" closable @close="onRemoveCase">
            <n-ellipsis style="max-width: 173px">{{ form.actionTarget || $t('tester.select_case') }}</n-ellipsis>
          </n-tag>
          <n-button v-else type="default" @click="onPickCase">{{ $t('tester.select_case') }}</n-button>
        </n-form-item>
      </template>
      <!--创建变量表单-->
      <template v-else-if="form.stepType === 'variable'">
        <n-form-item path="actionValue">
          <template #label>
            <div style="display: flex; align-items: center">
              <span style="margin-right: 5px">{{ $t('tester.var_name') }}</span>
              <n-tooltip>
                {{ varNameLabel }}
                <template #trigger>
                  <n-icon style="cursor: pointer"><QuestionCircleOutlined /></n-icon>
                </template>
              </n-tooltip>
            </div>
          </template>
          <n-input
            v-model:value="stepStore.stepForm.actionValue"
            :disabled="readonly"
            :placeholder="$t('tester.var_name_placeholder')"
          />
        </n-form-item>
        <n-form-item :label="$t('tester.var_type')" path="valueType">
          <n-select
            v-model:value="stepStore.stepForm.valueType"
            :options="variableTypes"
            :disabled="readonly"
            @update:value="stepStore.stepForm.actionTarget = ''"
            :placeholder="$t('tester.var_type_placeholder')"
          />
        </n-form-item>
        <template v-if="stepStore.stepForm.valueType === 'DateTime'">
          <n-form-item>
            <template #label>
              {{ $t('tester.var_date_format') }}
              <n-button
                tag="a"
                target="_blank"
                size="tiny"
                text
                href="https://day.js.org/docs/zh-CN/display/format"
                type="info"
              >
                {{ $t('tester.var_date_format_docs') }}
              </n-button>
            </template>
            <n-select
              v-model:value="dateJson.format"
              tag
              filterable
              :options="dateFormatterTypes"
              :disabled="readonly"
              :placeholder="$t('tester.var_date_format_placeholder')"
            />
          </n-form-item>
          <n-form-item :label="$t('tester.var_date_diff')">
            <n-input-group>
              <n-input-number
                ref="differenceRef"
                v-model:value="dateJson.difference"
                :max="differenceMaxMin.max"
                :min="differenceMaxMin.min"
                :disabled="readonly"
              />
              <n-select
                v-model:value="dateJson.differenceType"
                :options="differenceTypes"
                :disabled="readonly"
                @update:value="handleDifferenceTypeChange"
              />
            </n-input-group>
          </n-form-item>
        </template>
        <template v-else-if="stepStore.stepForm.valueType === 'Random'">
          <n-form-item :label="$t('tester.var_random_type')">
            <n-select v-model:value="randomJson.type" :options="randomTypes" :disabled="readonly" />
          </n-form-item>
          <n-form-item v-if="randomJson.type === 'email'" :label="$t('tester.var_random_email')">
            <n-input-group size="small">
              <n-input-group-label size="small">@</n-input-group-label>
              <n-input
                v-model:value="randomJson.domain"
                size="small"
                :disabled="readonly"
                :placeholder="$t('tester.var_random_email_domain')"
              />
            </n-input-group>
          </n-form-item>
          <n-form-item v-else-if="!['phone'].includes(randomJson.type)" :label="$t('tester.var_random_fixed_len')">
            <n-input-number v-model:value="randomJson.length" :min="1" :disabled="readonly" />
          </n-form-item>
          <n-form-item v-if="!['email', 'phone'].includes(randomJson.type)" :label="$t('tester.var_random_pre_suf')">
            <n-input-group>
              <n-input
                v-model:value="randomJson.prefix"
                :disabled="readonly"
                size="small"
                :placeholder="$t('tester.var_random_pre')"
              />
              <n-input-group-label :disabled="readonly" size="small">
                {{ $t('tester.var_random_val') }}
              </n-input-group-label>
              <n-input
                v-model:value="randomJson.suffix"
                :disabled="readonly"
                size="small"
                :placeholder="$t('tester.var_random_suf')"
              />
            </n-input-group>
          </n-form-item>
        </template>
        <template v-else-if="stepStore.stepForm.valueType === 'Javascript'">
          <n-form-item :label="$t('tester.script_val')">
            <n-input
              v-model:value="stepStore.stepForm.actionTarget"
              type="textarea"
              :disabled="readonly"
              :placeholder="$t('tester.script_val_placeholder')"
            />
          </n-form-item>
        </template>
      </template>
      <!--校验表单-->
      <template v-if="form.stepType === 'check'">
        <n-form-item :label="$t('tester.assert_type')" path="valueType">
          <n-select
            v-model:value="stepStore.stepForm.valueType"
            :options="validateTypes"
            :disabled="readonly"
            :placeholder="$t('tester.assert_type_placeholder')"
          />
        </n-form-item>
        <n-form-item :label="$t('tester.locator')" path="actionTarget">
          <n-input
            v-model:value="stepStore.stepForm.actionTarget"
            type="textarea"
            :disabled="readonly"
            :autosize="{ minRows: 3, maxRows: 6 }"
            :placeholder="$t('tester.step_selector_placeholder')"
          />
        </n-form-item>
        <n-form-item v-if="stepStore.stepForm.valueType === 'TextVisible'" path="actionValue">
          <template #label>
            <div style="display: flex; align-items: center; width: 200px">
              <span style="flex-shrink: 0">{{ $t('tester.text_content') }}</span>
              <n-select
                v-model:value="checkJson.check_type"
                :options="checkTextOptions"
                placeholder=""
                size="tiny"
                style="width: 120px; margin-left: 5px"
              />
            </div>
          </template>
          <n-input
            v-model:value="checkJson.attr_value"
            :disabled="readonly"
            :placeholder="$t('tester.text_content_placeholder')"
          />
        </n-form-item>
        <n-form-item v-if="stepStore.stepForm.valueType === 'ElementAttribute'" :label="$t('tester.ele_attr')">
          <n-input-group>
            <n-input v-model:value="checkJson.attr_name" placeholder=""></n-input>
            <n-input-group-label>=</n-input-group-label>
            <n-input v-model:value="checkJson.attr_value" placeholder=""></n-input>
          </n-input-group>
        </n-form-item>
      </template>
      <!--执行条件-->
      <template v-if="showRunOn">
        <div style="margin-bottom: 10px">
          <n-checkbox
            v-model:checked="stepStore.stepForm.runOnCondition as boolean"
            :checked-value="1"
            :unchecked-value="0"
            :disabled="readonly"
          >
            {{ $t('tester.run_on_condition') }}
          </n-checkbox>
        </div>
      </template>
      <template v-if="stepStore.stepForm.runOnCondition === 1">
        <n-form-item :show-label="false">
          <n-select
            v-model:value="checkJson.valueType"
            :options="validateTypes"
            :disabled="readonly"
            :placeholder="$t('tester.assert_type_placeholder')"
          />
        </n-form-item>
        <n-form-item :label="$t('tester.locator')" class="action-value">
          <template #label>
            <span>{{ $t('tester.locator') }}</span>
            <n-button text :disabled="readonly" @click="handleFullscreen('checkJson.actionTarget')">
              <template #icon>
                <n-icon><FullscreenOutlined /></n-icon>
              </template>
            </n-button>
          </template>
          <n-input
            v-model:value="checkJson.actionTarget"
            type="textarea"
            :disabled="readonly"
            :autosize="{ minRows: 3, maxRows: 6 }"
            :placeholder="$t('tester.step_selector_placeholder')"
          />
        </n-form-item>
        <n-form-item v-if="checkJson.valueType === 'TextVisible'">
          <template #label>
            <div style="display: flex; align-items: center; width: 200px">
              <span style="flex-shrink: 0">{{ $t('tester.text_content') }}</span>
              <n-select
                v-model:value="checkJson.check_type"
                :options="checkTextOptions"
                placeholder=""
                size="tiny"
                style="width: 120px; margin-left: 5px"
              />
            </div>
          </template>
          <n-input
            v-model:value="checkJson.attr_value"
            :disabled="readonly"
            :placeholder="$t('tester.text_content_placeholder')"
          />
        </n-form-item>
        <n-form-item v-if="checkJson.valueType === 'ElementAttribute'" :label="$t('tester.ele_attr')">
          <n-input-group>
            <n-input v-model:value="checkJson.attr_name" placeholder=""></n-input>
            <n-input-group-label>=</n-input-group-label>
            <n-input v-model:value="checkJson.attr_value" placeholder=""></n-input>
          </n-input-group>
        </n-form-item>
      </template>
    </n-form>
  </div>
  <div v-if="stepStore.step && !readonly" class="btn-box">
    <n-button type="info" size="small" :loading="saveLoading" @click="onSaveStepForm" class="save-btn">
      {{ $t('save') }}
    </n-button>
    <n-button size="small" secondary @click="stepStore.resetForm" class="save-btn">
      {{ $t('cancel') }}
    </n-button>
  </div>
  <CasePicker ref="casePickerRef" />
  <IbHugeEditor ref="ibHugeEditorRef" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, ref, watch } from 'vue'
import FullscreenOutlined from '@vicons/antd/FullscreenOutlined'
import QuestionCircleOutlined from '@vicons/antd/QuestionCircleOutlined'
import WarningOutlined from '@vicons/antd/WarningOutlined'
import { cloneDeep } from 'lodash-es'
import { FormInst, FormRules, InputNumberInst } from 'naive-ui'
import { IBCase } from '@/types/tester'
import { useCaseStepStore, useCaseStore } from '@/store/tester'
import CasePicker from '../CasePicker.vue'
import {
  actionTypes,
  dateFormatterTypes,
  differenceTypes,
  getActionLabel,
  randomTypes,
  stepTypes,
  storageTypes,
  validateTypes,
  variableTypes
} from '../helper'

defineProps<{
  readonly?: boolean
}>()

const IbHugeEditor = defineAsyncComponent(() => import('@/components/IbHugeEditor.vue'))
const casePickerRef = ref<InstanceType<typeof CasePicker> | null>(null)
const stepStore = useCaseStepStore()

const form = computed(() => stepStore.stepForm)
const formRef = ref<FormInst>()
const formRules = computed(() => {
  const rules = {} as FormRules
  if (form.value.stepType === 'test_case') {
    rules.actionValue = { required: true, message: window.$t('tester.select_case_placeholder') }
  }
  return rules
})
const handleStepTypeChange = (value: string) => {
  if (value === 'test_case') {
    stepStore.stepForm.actionType = 'RUN_CASE'
  } else if (value === 'variable') {
    stepStore.stepForm.actionType = 'CREATE_VARIABLE'
    stepStore.stepForm.valueType = 'DateTime'
  } else if (value === 'check') {
    stepStore.stepForm.valueType = 'TextVisible'
  } else {
    stepStore.stepForm.actionType = 'UI_INPUT'
  }
  stepStore.stepForm.actionValue = ''
  stepStore.stepForm.actionTarget = ''
}
const handleActionTypeChange = (type: string) => {
  stepStore.stepForm.actionValue = ''
  if (type === 'BROWSER_STORAGE') {
    stepStore.stepForm.valueType = 'Cookie'
  }
  if (type === 'UI_KEY') {
    stepStore.stepForm.actionValue = 'Enter'
  }
}
const onPickCase = async () => {
  const caseId = useCaseStore().case?.id
  const c = (await casePickerRef.value?.show({ caseId })) as IBCase
  stepStore.stepForm.actionValue = c.id
  stepStore.stepForm.actionTarget = c.name
}
const onRemoveCase = () => {
  stepStore.stepForm.actionValue = ''
  stepStore.stepForm.actionTarget = ''
}
const showXpathForm = computed(() => {
  const { actionType } = stepStore.stepForm
  if (!actionType) return true
  return !['OPEN_URL', 'BROWSER_STORAGE', 'TAB_CLOSE', 'CREATE_VARIABLE', 'JAVASCRIPT'].includes(actionType)
})
const showActionValue = computed(() => {
  const { actionType } = stepStore.stepForm
  if (!actionType) return true
  return !['UI_CLICK', 'UI_HOVER', 'BROWSER_STORAGE', 'UI_KEY'].includes(actionType)
})
const showRunOn = computed(() => ['step', 'test_case'].includes(stepStore.stepForm.stepType as string))

// 日期时间相关JSON
const emptyDateJson = {
  format: 'timestamp(s)',
  difference: 0,
  differenceType: 's'
}
const dateJson = ref(cloneDeep(emptyDateJson))
const differenceRef = ref<InputNumberInst>()
const differenceMaxMin = computed(() => {
  const { differenceType: t } = dateJson.value
  if (t === 'ms') return { min: -999, max: 999 }
  if (t === 's' || t === 'm') return { min: -59, max: 59 }
  if (t === 'h') return { min: -23, max: 23 }
  return { min: undefined, max: undefined }
})
// 改变类型后，更新限制
const handleDifferenceTypeChange = () => {
  differenceRef.value?.focus()
  nextTick().then(() => {
    differenceRef.value?.blur()
  })
}

const varNameLabel = computed(() => {
  return window.$t('tester.step_use_var', { name: stepStore.stepForm.actionValue || window.$t('tester.var_name') })
})
// 随机相关JSON
const emptyRandomJson = {
  type: 'number',
  length: 4,
  prefix: '',
  suffix: '',
  domain: '',
  areaCode: ''
}
const randomJson = ref(cloneDeep(emptyRandomJson))

interface CheckJson {
  attr_name: string
  attr_value: string
  check_type: 'contains' | 'equal'
  valueType: string
  actionTarget: string
}

const emptyCheckJson: CheckJson = {
  attr_name: '',
  attr_value: '',
  check_type: 'contains',
  valueType: '',
  actionTarget: ''
}
// 断言校验文本或元素属性是否等于某个值
const checkJson = ref(cloneDeep(emptyCheckJson))
const checkTextOptions = computed(() => {
  return [
    { label: window.$t('tester.contains'), value: 'contains' },
    { label: window.$t('tester.equal'), value: 'equal' }
  ]
})

// 数据储存相关
interface StorageJson {
  name: string
  value: string
  domain: string
  path: string
  expires: number
  secure: boolean
  sameSite: 'Strict' | 'Lax' | 'None' | ''
}
const emptyStorageJson = {
  name: '',
  value: ''
} as StorageJson
const storageJson = ref(cloneDeep(emptyStorageJson))
const cookieExpiresOptions = [
  { label: `5${window.$t('tester.minutes')}`, value: 5 * 60 * 1000 },
  { label: `10${window.$t('tester.minutes')}`, value: 10 * 60 * 1000 },
  { label: `1${window.$t('tester.hours')}`, value: 60 * 60 * 1000 },
  { label: `2${window.$t('tester.hours')}`, value: 2 * 60 * 60 * 1000 }
]
const sameSiteOptions = [
  { label: 'Strict', value: 'Strict' },
  { label: 'Lax', value: 'Lax' },
  { label: 'None', value: 'None' }
]

// 保存步骤
const saveLoading = ref(false)
const onSaveStepForm = async () => {
  await formRef.value?.validate()
  try {
    saveLoading.value = true
    const { stepType, actionType, valueType, runOnCondition } = stepStore.stepForm
    if (stepType === 'variable' && actionType === 'CREATE_VARIABLE') {
      if (valueType === 'DateTime') {
        stepStore.stepForm.actionTarget = JSON.stringify(dateJson.value)
      } else if (valueType === 'Random') {
        stepStore.stepForm.actionTarget = JSON.stringify(randomJson.value)
      } else if (valueType === 'Javascript') {
        //
      }
    }
    if (actionType === 'BROWSER_STORAGE') {
      const { name, value } = storageJson.value
      if (!name) return window.$message.error(window.$t('tester.storage_name_placeholder'))
      if (!value) return window.$message.error(window.$t('tester.storage_value_placeholder'))
      let json = cloneDeep(storageJson.value) as Record<string, any>
      if (valueType !== 'Cookie') {
        json = { name: json.name, value: json.value }
      }
      stepStore.stepForm.actionTarget = JSON.stringify(json)
    }
    if (stepType === 'check') {
      const json = cloneDeep(checkJson.value)
      delete json['valueType']
      delete json['actionTarget']
      stepStore.stepForm.actionValue = JSON.stringify(json)
    }
    if (Number(runOnCondition) === 1) {
      stepStore.stepForm.runCondition = JSON.stringify(checkJson.value)
    }
    await stepStore.saveStepForm()
    window.$message.success(window.$t('save_success'))
  } finally {
    saveLoading.value = false
  }
}

// 初始化变量JSON配置
const initVarJson = () => {
  const { stepType, actionType, actionValue, actionTarget, valueType, runOnCondition, runCondition } =
    stepStore.stepForm
  checkJson.value = cloneDeep(emptyCheckJson)
  dateJson.value = cloneDeep(emptyDateJson)
  randomJson.value = cloneDeep(emptyRandomJson)
  storageJson.value = cloneDeep(emptyStorageJson)
  if (actionType === 'BROWSER_STORAGE') {
    storageJson.value = JSON.parse(actionTarget)
    return
  }
  if (stepType === 'check' && actionValue) {
    checkJson.value = JSON.parse(actionValue)
    return
  }
  if (Number(runOnCondition) === 1 && runCondition) {
    checkJson.value = JSON.parse(runCondition)
  }
  if (stepType !== 'variable' || actionType !== 'CREATE_VARIABLE') return
  if (valueType === 'DateTime' && actionTarget) {
    dateJson.value = JSON.parse(actionTarget)
  } else if (valueType === 'Random' && actionTarget) {
    randomJson.value = JSON.parse(actionTarget)
  }
}

const ibHugeEditorRef = ref<InstanceType<typeof IbHugeEditor>>()
const handleFullscreen = (type: string) => {
  let title = ''
  let value = ''
  if (type === 'locator') {
    title = window.$t('tester.locator')
    value = stepStore.stepForm.actionTarget
  }
  if (type === 'javascript') {
    title = window.$t('tester.script_val')
    value = stepStore.stepForm.actionValue
  }
  if (type === 'storageJson.value') {
    title = 'Value'
    value = storageJson.value.value
  }
  if (type === 'checkJson.actionTarget') {
    title = window.$t('tester.locator')
    value = checkJson.value.actionTarget
  }
  ibHugeEditorRef.value?.show({
    title,
    value,
    handleChange(value) {
      if (type === 'storageJson.value') {
        storageJson.value.value = value
      }
      if (type === 'locator') {
        stepStore.stepForm.actionTarget = value
      }
      if (type === 'javascript') {
        stepStore.stepForm.actionValue = value
      }
      if (type === 'checkJson.actionTarget') {
        checkJson.value.actionTarget = value
      }
    }
  })
}

watch(
  () => stepStore.stepForm.id,
  () => {
    initVarJson()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.step-form {
  position: relative;
  max-height: calc(100vh - 65px - 24px - 60px - 45px);
  overflow: auto;
  padding: 24px 12px 24px;
}
.btn-box {
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--divider-color);
  background-color: var(--body-color);
  padding-left: 12px;
  .save-btn {
    min-width: 85px;
  }
}
.action-value {
  :deep(.n-form-item-label__text) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .n-checkbox {
      font-size: 12px;
    }
  }
}
:deep(.n-input) {
  .n-input__textarea-el {
    word-break: break-all;
  }
}
.storage-fullscreen-btn {
  position: absolute;
  right: 12px;
}
</style>
