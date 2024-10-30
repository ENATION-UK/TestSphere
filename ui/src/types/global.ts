import { ComposerTranslation } from 'vue-i18n'
import type { DialogOptions, DialogReactive, InputProps, MessageApi, NotificationApi, SelectOption } from 'naive-ui'
import type { MenuKey, MenuOption } from '@/utils/menus'

export type IBDialogApi = {
  destroyAll: () => void
  create: (options: DialogOptions) => DialogReactive
  success: (options: DialogOptions | string) => DialogReactive
  warning: (options: DialogOptions | string) => DialogReactive
  error: (options: DialogOptions | string) => DialogReactive
  info: (options: DialogOptions | string) => DialogReactive
}

export type IBConfirm = (content: string, options?: DialogOptions, callback?: Function) => Promise<void>

declare global {
  type PromptSelect = (options: SelectOption[], option: PromptSelectOption) => Promise<SelectOption>

  type AppDropdown = {
    options: MenuOption[]
    select: (key: MenuKey, e?: MouseEvent, data?: any) => void | Promise<void>
    showDropdown: boolean
    data?: any
    cacheEvent?: MouseEvent
    targetElement?: HTMLElement
    handleContextMenu: (e: MouseEvent, targetEle?: HTMLElement) => void
  }

  // 拓展Window
  interface Window {
    $t: ComposerTranslation
    $message: MessageApi
    $dialog: IBDialogApi
    $notification: NotificationApi
    $confirm: IBConfirm
    $prompt: (option: PromptOptions, callback: (value: string) => Promise<void>) => Promise<void>
    $promptSelect: PromptSelect
    $sleep: (timer: number) => Promise<unknown>
    $AppDropdown: AppDropdown
    $IBAttaches: {
      dragging_mark?: string
      dragging_data?: any
      dragging_position?: {
        x: number
        y: number
      }
      clear: () => void
    } & {
      [key in string]: any
    }
  }

  interface ConfirmOptions extends Record<string, any> {
    title?: string
    type?: 'error' | 'warning'
    positiveText?: string
    negativeText?: string
  }

  type PromptOptions = InputProps & {
    title: string
    validator?: (value: string) => string | undefined | boolean
    inputLabel?: string
    dialogWidth?: number
  }

  interface PromptSelectOption {
    title: string
    placeholder?: string
    selectWidth?: number
    creatable?: boolean
  }

  /**
   * 参数选择<br>
   * T为接口类型<br>
   * R为必选字段<br>
   * O为可选字段
   */
  type ParamsPick<T, R extends keyof T, O extends keyof T = any> = Pick<T, R> & Partial<Pick<T, O>>
}
