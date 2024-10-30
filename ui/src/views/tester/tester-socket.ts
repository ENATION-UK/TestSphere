import { IBCaseRecord, IBCaseTask, IBTesterSocketMessage } from '@/types/tester'
import { IBConfig } from '@/config'
import { UserStore, useUserStore } from '@/store'
import { useRunCaseStore, useTasksStore, useTaskStore } from '@/store/tester'

class TesterSocket {
  url!: string
  socket!: WebSocket
  reconnectTimeout = 10 * 1000
  heartBeatTimer: any
  userStore!: UserStore

  constructor() {
    this.userStore = useUserStore()
    const token = this.userStore.token?.accessToken
    this.url = `${IBConfig.TESTER_SOCKET_API}?accessToken=${token}`
    this.connect()
  }

  // 连接
  connect() {
    clearTimeout(this.heartBeatTimer)
    this.socket = new WebSocket(this.url)
    this.socket.onopen = () => {
      this.socket.onmessage = this.listenerMessage.bind(this)
      this.socket.onerror = this.reconnect.bind(this)
      this.socket.onclose = () => {
        clearTimeout(this.heartBeatTimer)
      }
      this.startHeartBeat()
    }
  }
  // 重连
  reconnect() {
    this.socket && this.socket.close()
    this.connect()
  }
  // 心跳
  startHeartBeat() {
    this.socket.send('heartbeat')
    this.heartBeatTimer = setTimeout(this.reconnect.bind(this), this.reconnectTimeout)
  }
  // 监听消息
  listenerMessage(ev: MessageEvent) {
    clearTimeout(this.heartBeatTimer)
    this.heartBeatTimer = setTimeout(this.startHeartBeat.bind(this), this.reconnectTimeout)
    if (ev.data === 'heartbeat') return
    if (ev.data.indexOf('{"') !== 0) return
    const message = JSON.parse(ev.data) as IBTesterSocketMessage
    if (message.userId !== this.userStore.user?.userId) return
    this.handleTesterMessage(message)
  }
  // 监听到步骤消息
  handleTesterMessage(message: IBTesterSocketMessage) {
    switch (message.messageType) {
      case 'step_status':
        useRunCaseStore().changeStepStatus(message.runRecordId, message.data.stepId, message.data)
        break
      case 'case_complete':
        useRunCaseStore().changeRecordStatus(message.runRecordId, 'completed')
        break
      case 'task_update':
        const task = message.data as IBCaseTask
        useTasksStore().changeStatusBySocket(task)
        useTaskStore().changeTaskBySocket(task)
        break
      case 'record_update':
        const record = message.data as IBCaseRecord
        useRunCaseStore().changeRecordStatus(record.id, record.status)
        useTaskStore().changeRecordBySocket(record)
    }
  }
  // 关闭Socket
  close() {
    this.socket.close()
  }
}

export function initTesterSocket() {
  return new TesterSocket()
}
