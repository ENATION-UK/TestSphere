import dayjs from 'dayjs'
import SnowflakeId from 'snowflake-id'

export const snowflake = new SnowflakeId({
  // mid: 42,
  mid: 0,
  // offset : (2019-1970)*31536000*1000r
  offset: 0
})

/**
 * 获取当前时间戳
 */
export const getNowTime = (): number => {
  return parseInt(String(Date.now() / 1000))
}

/**
 * 模拟睡眠
 * @param timer
 */
export const sleep = (timer: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timer)
  })
}

/**
 * Unix时间戳格式化
 * @param unix
 * @param placeholder
 * @param template
 */
export const formatUnix = (
  unix: string | number | null | undefined,
  placeholder = '',
  template = 'YYYY-MM-DD HH:mm:ss'
) => {
  if (!unix) return placeholder
  if (typeof unix === 'number') {
    unix = unix.toString()
  }
  if (unix.length === 10) {
    return dayjs(Number(unix) * 1000).format(template)
  }
  if (unix.indexOf('T') !== -1) {
    return dayjs(unix).format(template)
  }
  return dayjs(Number(unix)).format(template)
}

/**
 * 格式化秒数
 * @param totalSeconds
 */
export const formatSeconds = (totalSeconds: number): string => {
  if (!totalSeconds) return ''
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  let result = ''
  if (hours > 0) {
    result += hours + 'h'
  }
  if (minutes > 0) {
    result += minutes + 'm'
  }
  if (seconds > 0 || totalSeconds === 0) {
    result += seconds + 's'
  }
  return result
}
