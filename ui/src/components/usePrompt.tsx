import { ref } from 'vue'
import { DialogReactive, InputInst, NInput } from 'naive-ui'
import { isFunction } from '@/utils'

export default function (options: PromptOptions, onConfirm: (value: string) => Promise<void>): Promise<void> {
  let { dialogWidth, inputLabel, validator, ...inputOptions } = options
  const title = options.title || window.$t('please_input_content')
  const dw = dialogWidth ? `width: ${dialogWidth}px` : ''
  const promise = { resolve: (value?: void) => {}, reject: () => {} }

  const inputRef = ref<InputInst | null>(null)
  let inputValue = (options.defaultValue as string) || ''
  let dialog: DialogReactive
  const validStatus = ref<'success' | 'error' | 'warning' | undefined>()
  const validRes = ref<string>()

  const handleInput = (value: string) => {
    inputValue = value
    callValidator()
  }

  const callValidator = () => {
    if (!isFunction(validator)) return
    const res = validator(inputValue)
    if (typeof res === 'boolean') {
      validStatus.value = res ? undefined : 'error'
      validRes.value = ''
    } else {
      validStatus.value = res ? 'error' : undefined
      validRes.value = res
    }
  }

  const handlePositiveClick = async () => {
    if (dialog.loading === true) return
    callValidator()
    if (validStatus.value === 'error') {
      inputRef.value?.focus()
      return false
    }
    try {
      dialog.loading = true
      await onConfirm(inputValue)
      promise.resolve()
      dialog.destroy()
    } catch (e) {
      dialog.loading = false
      if (e) {
        validStatus.value = 'error'
        validRes.value = typeof e === 'string' ? e : typeof e.message === 'string' ? e.message : ''
      }
      inputRef.value?.focus()
      promise.reject()
      return false
    }
  }
  const handleNegativeClick = () => {
    promise.reject()
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (dialog.loading === true) return
    if (e.key.toLowerCase() !== 'enter') return
    if (options.type === 'textarea') return
    handlePositiveClick()
  }
  const hrStyles = {
    width: 'calc(100% + 56px)',
    height: '1px',
    marginLeft: '-28px',
    backgroundColor: 'var(--divider-color)'
  }
  const topHrStyles = { ...hrStyles, marginBottom: '24px' }
  const bottomHrStyles = { ...hrStyles, marginTop: '24px' }
  const labelStyles = { display: 'block', marginBottom: '12px' }
  const errorStyles = { color: 'var(--error-color)', marginTop: '12px' }

  dialog = window.$dialog.create({
    title: title,
    showIcon: false,
    iconPlacement: 'left',
    positiveText: window.$t('confirm'),
    negativeText: window.$t('cancel'),
    closable: false,
    maskClosable: false,
    transformOrigin: 'center',
    style: `${dw}; border-radius: 8px;`,
    content: () => {
      return (
        <div style={'width: 100%'}>
          <div style={topHrStyles}></div>
          {inputLabel && <label style={labelStyles}>{inputLabel}</label>}
          <NInput
            ref={inputRef}
            autosize
            clearable
            style={`width: 100%`}
            onUpdateValue={handleInput}
            onKeyup={handleKeyUp}
            v-model:status={validStatus.value}
            {...inputOptions}
          />
          {validRes.value && <div style={errorStyles}>{validRes.value}</div>}
          <div style={bottomHrStyles}></div>
        </div>
      )
    },
    onPositiveClick: handlePositiveClick,
    onNegativeClick: handleNegativeClick
  })
  return new Promise((resolve, reject) => {
    promise.resolve = resolve
    promise.reject = reject
  })
}
