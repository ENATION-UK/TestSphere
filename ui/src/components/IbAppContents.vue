<template></template>

<script setup lang="tsx">
import { useI18n } from 'vue-i18n'
import { DialogOptions, useDialog, useMessage, useNotification } from 'naive-ui'
import { IBDialogApi } from '@/types/global'
import usePrompt from './usePrompt'
import usePromptSelect from './usePromptSelect'

const { t } = useI18n()

window.$t = t

// Dialog基础配置
const getDialogOptions = (options: DialogOptions): DialogOptions => {
  if (options.autoFocus === undefined) options.autoFocus = false
  if (options.closable === undefined) options.closable = false
  if (options.closeOnEsc === undefined) options.closeOnEsc = false
  if (options.maskClosable === undefined) options.maskClosable = false
  if (options.transformOrigin === undefined) options.transformOrigin = 'center'
  if (options.style === undefined) options.style = `width: 330px;`
  if (options.positiveText === undefined) options.positiveText = t('confirm')
  if (options.negativeText === undefined) options.negativeText = t('cancel')
  return options
}
window.$message = useMessage()
const dialog = useDialog()
window.$dialog = {} as IBDialogApi
window.$dialog.destroyAll = dialog.destroyAll
window.$dialog.create = dialog.create
window.$dialog.success = (options) => {
  if (typeof options === 'string') {
    options = { content: options }
  }
  if (options.negativeText === undefined) options.negativeText = ''
  options = getDialogOptions(options)
  return dialog.success(options)
}
window.$dialog.info = (options) => {
  if (typeof options === 'string') {
    options = { content: options }
  }
  if (!options.title) options.title = t('info')
  options = getDialogOptions(options)
  return dialog.info(options)
}
window.$dialog.warning = (options) => {
  if (typeof options === 'string') {
    options = { content: options }
  }
  if (!options.title) options.title = t('warning')
  if (options.negativeText === undefined) options.negativeText = ''
  options = getDialogOptions(options)
  return dialog.warning(options)
}
window.$dialog.error = (options) => {
  if (typeof options === 'string') {
    options = { content: options }
  }
  if (!options.title) options.title = t('error')
  if (options.negativeText === undefined) options.negativeText = ''
  options = getDialogOptions(options)
  options.style = 'margin-top:50px'
  return dialog.error(options)
}
window.$notification = useNotification()

window.$confirm = (content, options, callback) => {
  return new Promise((resolve, reject) => {
    const dialog = window.$dialog.create({
      type: 'warning',
      title: t('tip'),
      content: content,
      positiveText: t('confirm'),
      negativeText: t('cancel'),
      autoFocus: false,
      onPositiveClick: async () => {
        if (typeof callback !== 'function') return resolve()
        dialog.loading = true
        try {
          await callback()
          resolve()
        } finally {
          dialog.loading = false
        }
      },
      onNegativeClick: () => reject('cancel'),
      iconPlacement: 'left',
      transformOrigin: 'center',
      closable: false,
      maskClosable: false,
      style: 'width: 380px;',
      ...options
    })
  })
}
window.$prompt = usePrompt
window.$promptSelect = usePromptSelect
</script>

<style lang="scss" scoped></style>
