import { IBTableColumn } from '@/types/project'

const TABLE_PREFIX = 't:'
const TABLE_NAME = 0
const TABLE_COMMENT = 1
const COL_PREFIX = 'c:'
const COL_NAME = 0
const COL_DATATYPE = 1
const COL_PRIMARY = 2
const COL_UNIQUE = 3
const COL_DEFAULT = 4
const COL_ALLOW_NULL = 5
const COL_COMMENT = 6
const COL_INDEX = 7

/**
 * 解析AI设计返回的表
 * @param data
 */
export function parseAiDesignTable(data: string): {
  tableName: string
  tableDesc: string
  tableFields: IBTableColumn[]
} {
  const tableFields: IBTableColumn[] = []
  let tableName = ''
  let tableDesc = ''
  data = data.replace(`\n\n`, `\n`)
  let lineIndex = data.indexOf(`\n`)
  while (lineIndex >= 0) {
    let line = data.split(`\n`)[0]
    if (line.indexOf(TABLE_PREFIX) === 0) {
      line = line.substring(2, line.length)
      const split = line.split(';')
      tableName = split[0]
      tableDesc = split[1]
    } else if (line.indexOf(COL_PREFIX) === 0) {
      line = line.substring(2, line.length)
      const field = getFieldByLine(line)
      if (field) tableFields.push(field)
    }
    data = data.substring(lineIndex + 1, data.length)
    lineIndex = data.indexOf(`\n`)
  }
  if (data.indexOf('c:') === 0) {
    const field = getFieldByLine(data.substring(2, data.length))
    if (field) tableFields.push(field)
  }
  return { tableName, tableDesc, tableFields }
}

/**
 * 从字符串中解析表字段
 * @param str
 */
function getFieldByLine(str: string): IBTableColumn | void {
  if (!str) return
  const split = str.split(';')
  if (split.length < 2) return
  const field = new IBTableColumn()
  field.name = split[COL_NAME]
  const dataTypeSplit = split[COL_DATATYPE].split('(')
  field.dataType = dataTypeSplit[0]
  if (dataTypeSplit[1]) {
    const lpStr = dataTypeSplit[1].substring(0, dataTypeSplit[1].length - 1)
    const l = Number(lpStr.split(',')[0])
    const p = Number(lpStr.split(',')[1])
    field.length = Number.isNaN(l) ? undefined : l
    field.precision = Number.isNaN(p) ? undefined : p
  }
  field.isPrimaryKey = Number(split[COL_PRIMARY]) === 1
  field.isUnique = Number(split[COL_UNIQUE]) === 1
  field.defaultVal = split[COL_DEFAULT]
  field.isNullable = Number(split[COL_ALLOW_NULL]) === 1
  field.description = split[COL_COMMENT]
  field.sequence = Number(split[COL_INDEX])
  return field
}
