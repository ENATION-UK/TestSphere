import { DialogReactive, NSelect, SelectOption } from 'naive-ui'

export default function (options: SelectOption[], option: PromptSelectOption): Promise<SelectOption> {
  option.title = option.title || window.$t('please_input_content')
  option.selectWidth = option.selectWidth || 100
  option.placeholder = option.placeholder || ''
  if (option.creatable === undefined) {
    option.creatable = false
  }
  const dialogWidth = option.selectWidth + 100

  let selectValue: string | number
  let dialog: DialogReactive

  return new Promise((resolve, reject) => {
    dialog = window.$dialog.create({
      title: option.title,
      showIcon: false,
      iconPlacement: 'top',
      positiveText: window.$t('confirm'),
      negativeText: window.$t('cancel'),
      closable: false,
      maskClosable: false,
      style: `width: ${dialogWidth}px`,
      content: () => {
        return (
          <NSelect
            v-model:value={selectValue}
            placeholder={option.placeholder}
            style={`width: ${option.selectWidth}px; margin: 0 auto;`}
            options={options}
            filterable={option.creatable}
            tag={option.creatable}></NSelect>
        )
      },
      onPositiveClick: async () => {
        console.log('selectValue: ', selectValue)
        console.log('options: ', options)
        // await resolve(selectOption)
      },
      onNegativeClick: reject
    })
  })
}
