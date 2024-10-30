<template>
  <n-input
    v-if="showInput"
    v-model:value="inputVal"
    ref="inputRef"
    size="small"
    placeholder=""
    :autosize="true"
    :passively-activated="true"
    :minlength="1"
    @keyup.enter="handleInputEnter"
    @change="handleInputChange"
    @blur="handleInputBlur"
    @mousedown.stop
    class="dbl-click-input"
  />
  <span v-else class="text-span" @dblclick="handleDblclick">
    <n-ellipsis v-if="ellipsis" :tooltip="false">
      <span class="dbl-click-span">{{ value }}</span>
    </n-ellipsis>
    <span v-else class="dbl-click-span">{{ value }}</span>
    <span v-if="prompt" class="icon-dots" @click="handleShowPrompt">
      <n-icon :component="IconDots" />
    </span>
  </span>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import IconDots from '@vicons/tabler/Dots'
import type { InputInst } from 'naive-ui'

const props = defineProps<{
  value: string | number | undefined
  ellipsis?: boolean
  prompt?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:value', value: string): void
  (e: 'change', value: string): void
}>()

const inputVal = ref('')
const showInput = ref(false)
const inputRef = ref<InputInst>()

watch(
  () => props.value,
  (newVal) => {
    inputVal.value = String(newVal || '')
  },
  { immediate: true }
)

// 回车
const handleInputEnter = () => {
  inputRef.value?.blur()
}

// 失去焦点
const handleInputBlur = () => {
  showInput.value = false
}

// 值更新
const handleInputChange = () => {
  emit('update:value', inputVal.value)
  emit('change', inputVal.value)
}

// 双击666
const handleDblclick = (e: MouseEvent) => {
  e.stopPropagation()
  inputVal.value = String(props.value || '')
  showInput.value = true
  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

// 显示Prompt输入框
const handleShowPrompt = () => {
  window.$prompt(
    {
      title: '',
      placeholder: '',
      maxlength: 10000,
      showCount: true,
      defaultValue: inputVal.value,
      type: 'textarea',
      autosize: {
        minRows: 3,
        maxRows: 6
      }
    },
    async (value) => {
      inputVal.value = value
      handleInputChange()
    }
  )
}
</script>

<style lang="scss" scoped>
.text-span {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  &:hover {
    :deep(.n-ellipsis) {
      text-overflow: clip !important;
    }
    .icon-dots {
      display: flex;
    }
  }
  .icon-dots {
    display: none;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    width: 20px;
    height: 20px;
    :deep(.n-icon) {
      color: var(--primary-color);
      font-size: 20px;
      font-weight: bold;
    }
  }
}
.dbl-click-span,
:deep(.dbl-click-span) {
  width: 100%;
  padding: 0 5px;
  cursor: text;
  font-size: 12px;
  line-height: normal;
}
.dbl-click-input {
  border: none;
  outline: none;
  cursor: text;
  min-width: 30px;
  text-align: center;
  user-select: inherit;
  background-color: inherit;
  line-height: normal;
  font-size: 12px;
  &.n-input--focus {
    background-color: var(--base-color);
    :deep(.n-input__border) {
      display: inherit;
      border-style: dashed;
    }
  }
  :deep(.n-input-wrapper) {
    padding-left: 5px;
    padding-right: 5px;
    .n-input__input-el {
      cursor: text;
    }
  }
  :deep(.n-input__border),
  :deep(.n-input__state-border) {
    display: none;
  }
}
</style>
