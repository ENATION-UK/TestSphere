import { IBSubscribeTypeDb } from '@/types/workbench'

/**
 * 订阅类型
 * @param subType
 */
export const subTypeName = (subType: IBSubscribeTypeDb) => {
  switch (subType) {
    case 'FREE':
      return window.$t('wb.version_free')
    case 'TEAM_MONTHLY':
    case 'TEAM_YEARLY':
      return window.$t('wb.version_team')
    case 'PERSONAL_MONTHLY':
    case 'PERSONAL_YEARLY':
      return window.$t('wb.version_personal')
    default:
      return ''
  }
}
