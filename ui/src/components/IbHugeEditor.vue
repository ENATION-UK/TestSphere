<template>
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    transform-origin="center"
    :title="modalTitle"
    :show-icon="false"
    :auto-focus="false"
    :mask-closable="false"
    :close-on-esc="false"
    class="huge-editor-modal"
    style="width: calc(100vw - 400px); max-height: calc(100vh - 140px); margin-top: 100px"
  >
    <div ref="editorBodyRef" class="editor-body"></div>
  </n-modal>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import ace from 'ace-builds'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/ext-language_tools'

interface Options {
  title?: string
  value?: string
  handleChange?: (value: string) => void
}

const emit = defineEmits<{
  (e: 'handle-change', value: string)
}>()

const modalTitle = ref(window.$t('edit_content'))
const showModal = ref(false)
const show = async (options?: Options) => {
  if (options?.title) modalTitle.value = options.title
  showModal.value = true
  await nextTick()
  initAceEditor(options)
}
const editorBodyRef = ref<HTMLElement>()
const initAceEditor = (options?: Options) => {
  const aceEditor = ace.edit(editorBodyRef.value as Element, {
    tabSize: 2,
    useWorker: false,
    showPrintMargin: false,
    fontSize: 14,
    value: options?.value || '',
    theme: 'ace/theme/monokai',
    mode: 'ace/mode/javascript',
    newLineMode: 'unix',
    enableLiveAutocompletion: true,
    enableBasicAutocompletion: true
  })
  aceEditor.getSession().setUseWrapMode(true)
  aceEditor.on('change', () => {
    const value = aceEditor.getValue()
    if (typeof options?.handleChange === 'function') {
      options.handleChange(value)
    }
    emit('handle-change', value)
  })
  aceEditor.commands.addCommand({
    name: 'save',
    bindKey: { win: 'Ctrl-S', mac: 'Cmd-S' },
    exec: () => window.$message.success(window.$t('saved'))
  })
}

defineExpose({
  show
})
</script>

<style scoped lang="scss">
.editor-body {
  height: calc(100vh - 200px);
  background-color: #1d2124;
}
</style>
<style lang="scss">
.huge-editor-modal {
  overflow: hidden;
  padding: 0;
  .n-dialog__close {
    margin-top: calc((46px - 22px) / 2);
    margin-right: 20px;
  }
  .n-dialog__title {
    height: 46px;
    padding-left: 20px;
  }
  .n-dialog__content {
    margin: 0;
  }
}
</style>
