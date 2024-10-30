import { defineAsyncComponent, h, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { defineStore } from 'pinia'
import { IBPagerRes } from '@/types'
import {
  IBAiChatLinesMessageItem,
  IBAiChatMessage,
  IBAiChatRecord,
  IBAiChatRecordParams,
  IBAiChatTableJsonItem,
  IBAiChatTablesMessageItem,
  IBAiPointLimitError,
  IBDiagram,
  IBDiagramLine,
  IBDiagramTable,
  IBTable,
  IBTableColumn
} from '@/types/project'
import { useDiagramStore, useGroupStore } from '@/store/project'
import { useProjectsStore } from '@/store/useProjectsStore'
import { useUserStoreWithout } from '@/store/useUserStore'
import { TrialAiChatApi } from '@/api/other'
import { AiChatApi } from '@/api/project'

interface TrialAiChatState {
  // 是否是体验版
  isTrial: boolean
  // 聊天列表展开
  chatListExpand: boolean
  // 是否显示抽屉
  showDrawer: boolean
  // 聊天抽屉宽度
  drawerWidth: number
  // 聊天记录
  chatRecords: IBAiChatRecord[]
  // 聊天记录分页
  chatRecordsParams: IBAiChatRecordParams
  // 聊天记录返回
  chatRecordsRes: IBPagerRes<IBAiChatRecord> & { finished: boolean }
  // 聊天记录加载中
  recordLoading: boolean
  // 当前聊天ID
  currentChatId: string | null
  // 试用聊天消息列表
  trialMessages: IBAiChatMessage[]
  // 输入框内容
  inputValue: string
  // 发送中
  sending: boolean
  // 不再提示欢迎语
  dontWelcome: boolean
  // 发送消息错误
  sendMsgErr: string | IBAiPointLimitError
  // 表
  tables: IBTable[]
  // 线
  lines: IBDiagramLine[]
  // 需要渲染的表列表，包括表字段
  renderTables: Record<string, IBAiChatTablesMessageItem>
  // 需要渲染的连线列表
  renderLines: Record<string, IBAiChatLinesMessageItem>
}

export const useTrialAiChatStore = defineStore('trial-ai-chat', {
  persist: { paths: ['dontWelcome', 'drawerWidth'] },
  state: (): TrialAiChatState => ({
    isTrial: false,
    chatListExpand: false,
    showDrawer: true,
    drawerWidth: 350,
    chatRecords: [],
    chatRecordsParams: { pageNo: 1, pageSize: 30, keyword: '', partnerId: 'erdModelingPartner' },
    chatRecordsRes: { pages: 0, records: [], finished: false },
    recordLoading: false,
    currentChatId: null,
    trialMessages: [],
    inputValue: '',
    sending: false,
    dontWelcome: false,
    sendMsgErr: '',
    tables: [],
    lines: [],
    renderTables: {},
    renderLines: {}
  }),
  actions: {
    /**
     * 初始化
     */
    async init() {
      this.resetDiagram()
      if (this.isTrial) {
        this.getChatMessages()
        return
      }
      await this.getChatRecords()
      if (this.chatRecords.length === 0) {
        this.createChat()
      } else if (this.chatRecords[0]) {
        this.changeCurrentChat(this.chatRecords[0].id)
      }
    },
    /**
     * 重置ER图内容
     */
    resetDiagram() {
      this.inputValue = ''
      this.tables = []
      this.lines = []
      this.renderTables = {}
      this.renderLines = {}
      this.setDiagram()
    },
    /**
     * 切换当前聊天
     * @param chatId
     */
    async changeCurrentChat(chatId: string) {
      this.currentChatId = chatId
      this.resetDiagram()
      const { messages } = this.currentChat!
      if (!messages || messages.length === 0) {
        await this.getChatMessages()
      }
      this.chatMessagesScrollToBottom()
    },
    /**
     * 加载更多聊天记录
     */
    async loadMoreRecords() {
      const { finished } = this.chatRecordsRes
      if (finished || this.recordLoading) return
      this.chatRecordsParams.pageNo += 1
      this.getChatRecords()
    },
    /**
     * 获取聊天记录
     */
    async getChatRecords() {
      this.recordLoading = true
      const { pageNo, pageSize } = this.chatRecordsParams
      try {
        const res = await AiChatApi.list(this.chatRecordsParams)
        this.chatRecordsRes = { ...res, finished: res.records.length < pageSize }
        if (pageNo === 1) {
          this.chatRecords = res.records
        } else {
          this.chatRecords.push(...res.records)
        }
      } finally {
        this.recordLoading = false
      }
    },
    /**
     * 获取聊天消息
     */
    async getChatMessages() {
      if (this.isTrial) {
        // 试用版逻辑
        const route = useRoute()

        // 获取 id 参数
        const chatId = encodeURIComponent(route.query.id)
        console.log('chatId', chatId)
        this.trialMessages = await TrialAiChatApi.messages(chatId)
        this.chatMessagesScrollToBottom()
        return
      }
      const { currentChatId } = this
      if (!currentChatId) return
      const res = await AiChatApi.detail(currentChatId)
      const chat = this.chatRecords.find((item) => item.id === res.id)
      if (!chat) return
      chat.messages = res.messages
      if (chat.id === currentChatId) {
        this.chatMessagesScrollToBottom()
      }
    },
    /**
     * 创建聊天
     */
    async createChat() {
      const res = await AiChatApi.create(this.chatRecordsParams.partnerId)
      this.currentChatId = res.id
      this.chatRecordsRes.finished = false
      this.chatRecordsParams.pageNo = 1
      await this.getChatRecords()
      this.resetDiagram()
    },
    /**
     * 发送消息
     */
    async sendChatMessage(): Promise<string | void | IBAiPointLimitError> {
      this.sendMsgErr = ''
      if (!this.inputValue) return
      if (this.sending) return
      this.sending = true
      if (this.isTrial) {
        await this.sendTrialMessage()
      } else {
        await this.sendMessage()
      }
    },
    /**
     * 发送消息
     */
    async sendMessage() {
      try {
        if (!this.currentChatId) {
          await this.createChat()
        }
        const { messages: msg } = this.currentChat!
        if (!msg || msg.length === 0) {
          this.getChatTitle()
        }
        const messages = await AiChatApi.sendMessage(this.currentChatId!, this.inputValue)
        if (!msg) {
          this.currentChat!.messages = []
        }
        this.currentChat!.messages.push(...messages)
        this.chatMessagesScrollToBottom()
        this.inputValue = ''
        this.waitReply(messages[1]!.id)
      } catch (e) {
        if (typeof e === 'string') {
          this.sendMsgErr = e
        } else if (e.code === 'AI_POINT_INSUFFICIENT') {
          this.sendMsgErr = e.data
        }
        return Promise.reject(e)
      } finally {
        this.sending = false
      }
    },
    /**
     * 发送消息-试用版
     */
    async sendTrialMessage() {
      try {
        const messages = await TrialAiChatApi.sendMessage(this.inputValue)
        this.trialMessages.push(...messages)
        this.chatMessagesScrollToBottom()
        this.inputValue = ''
        this.waitReply(messages[1]!.id)
      } catch (e) {
        if (typeof e === 'string') {
          this.sendMsgErr = e
        } else if (e.code === 'AI_POINT_INSUFFICIENT') {
          this.sendMsgErr = e.data
        } else if (e.code === 'NO_MORE_FREE_CHAT') {
          await this.showLoginModal(this.sendTrialMessage)
        }
        return Promise.reject(e)
      } finally {
        this.sending = false
      }
    },
    /**
     * 等待回复
     */
    async waitReply(messageId: string) {
      let sse: EventSource
      if (this.isTrial) {
        sse = await TrialAiChatApi.liveSSE(messageId)
      } else {
        const { currentChatId } = this
        if (!currentChatId) return
        sse = AiChatApi.liveSSE(currentChatId, messageId)
      }
      sse!.addEventListener('message', (evt) => {
        let { data } = evt
        if (data === '[Done]') {
          sse.close()
          this.handleMessage(data, messageId)
          return
        }
        if (data.indexOf('{') === 0) {
          try {
            data = JSON.parse(data)
            this.handleMessage(data.content, messageId)
          } catch (e) {
            //
          }
        }
      })
    },
    handleMessage(data: string, messageId?: string) {
      if (data && messageId) {
        let msg: IBAiChatMessage | undefined
        if (this.isTrial) {
          msg = this.trialMessages.find((item) => item.id === messageId)
        } else if (this.currentChat) {
          msg = this.currentChat.messages.find((item) => item.id === messageId)
        }
        if (!msg) return
        msg.content += `[Stream]${data}`
      }
      this.chatMessagesScrollToBottom(true)
    },
    /**
     * 聊天内容滚动到底部
     * @param animate
     */
    async chatMessagesScrollToBottom(animate = false) {
      const ele = document.getElementById('chat-messages')
      if (!ele) return
      await nextTick()
      const p: Record<string, any> = { top: ele.scrollHeight }
      if (animate) {
        p.behavior = 'smooth'
      }
      ele.scrollTo(p)
    },
    /**
     * 获取聊天标题
     * @param message
     */
    async getChatTitle(message?: string) {
      const res = await AiChatApi.getTitle(this.currentChatId!, message || this.inputValue)
      const chat = this.chatRecords.find((item) => item.id === res.id)
      if (chat) {
        chat.title = res.title
      }
    },
    /**
     * 删除对话
     * @param chatId
     */
    async deleteChat(chatId: string) {
      await AiChatApi.deleteChat(chatId)
      const index = this.chatRecords.findIndex((item) => item.id === chatId)
      if (index === -1) return
      this.chatRecords.splice(index, 1)
      if (this.currentChatId === chatId && this.chatRecords[0]) {
        this.changeCurrentChat(this.chatRecords[0].id)
      } else if (this.chatRecords.length === 0) {
        this.init()
      }
    },
    /**
     * 渲染表和线
     * @param messageId
     * @param json
     */
    renderTablesAndLines(messageId: string, json: IBAiChatTableJsonItem[]) {
      this.renderTables[messageId] = formatTablesFromJson(json)
      // 处理表 start
      const tables: IBTable[] = []
      Object.keys(this.renderTables).forEach((messageId) => {
        const renderItem = this.renderTables[messageId]
        renderItem.add.forEach((item) => {
          const index = tables.findIndex((_item) => _item.name === item.name)
          if (index === -1) {
            tables.push(item)
          } else {
            tables[index] = item
          }
        })
        renderItem.remove.forEach((item) => {
          const index = tables.findIndex((t) => t.name === item)
          if (index === -1) return
          tables.splice(index, 1)
        })
      })
      this.tables = tables
      formatColumnsFromJson(json, this.tables)
      // 处理表 end
      // 处理线 start
      this.renderLines[messageId] = formatLinesFromJson(json, this.tables)
      const lines: IBDiagramLine[] = []
      Object.keys(this.renderLines).forEach((messageId) => {
        const renderItem = this.renderLines[messageId]
        renderItem.add.forEach((item) => lines.push(item))
        renderItem.update.forEach((item) => {
          const index = lines.findIndex((l) => l.text === item.text)
          if (index === -1) return
          lines[index] = item
        })
        renderItem.remove.forEach((item) => {
          const index = lines.findIndex((l) => l.text === item)
          if (index === -1) return
          lines.splice(index, 1)
        })
      })
      this.lines = lines
      // 处理线 end
      this.setDiagram()
    },
    /**
     * 设置ER图
     */
    setDiagram() {
      const HSP = 100
      const VSP = 70
      const diagram = new IBDiagram()
      const diagramWidth = window.innerWidth - this.drawerWidth
      const colNum = Math.floor((diagramWidth - 24 + HSP) / (250 + HSP))
      const tables = this.tables
      const tableCols: IBTable[][] = []
      for (let i = 0; i < tables.length; i += colNum) {
        tableCols.push(tables.slice(i, i + colNum))
      }
      const tableRects: Record<string, { x: number; y: number; height: number }> = {}
      const diagramTales: IBDiagramTable[] = []
      tableCols.forEach((col, colIndex) => {
        col.forEach((table, index) => {
          const rect = { x: 30, y: 24, height: 100 }
          const w = 250 + HSP
          const bodyH = 30 * (table.columns?.length || 0)
          rect.height = 30 + 5 + 5 + (bodyH > 100 ? bodyH : 100)

          const dt = new IBDiagramTable()
          dt.id = table.id
          dt.x = index === 0 ? 30 : (dt.x = index * w + 30)
          if (colIndex === 0) {
            dt.y = index === col.length - 1 ? 70 : 30
          } else {
            const rect = tableRects[tableCols[colIndex - 1][index].id]
            dt.y = rect.y + rect.height + VSP
          }
          rect.x = dt.x
          rect.y = dt.y
          dt.table = table
          diagramTales.push(dt)
          tableRects[table.id] = rect
        })
      })
      const lines = this.lines
      diagram.contentJson = { tables: diagramTales, lines }
      const diagramStore = useDiagramStore()
      diagramStore.setDrawDiagram(diagram)
    },
    /**
     * 尝试保存ER图
     */
    async trySaveDiagram() {
      if (!useUserStoreWithout().isLogin) {
        this.showLoginModal(this.saveDiagram)
      } else {
        this.saveDiagram()
      }
    },
    /**
     * 保存ER图
     */
    async saveDiagram() {
      const projectsStore = useProjectsStore()
      await projectsStore.getProjects()
      const project = projectsStore.projects[0]
      if (!project) return
      const projectId = project.id
      await useGroupStore().getGroups(projectId)
      await useDiagramStore().saveDiagram(projectId)
      await this.claimDiagram()
    },
    /**
     * 显示登录弹窗
     * @param callback
     */
    async showLoginModal(callback: () => Promise<void>) {
      const LoginView = defineAsyncComponent(() => import('@/views/auth/login.vue'))
      const dialog = window.$dialog.create({
        autoFocus: false,
        showIcon: false,
        closeOnEsc: false,
        maskClosable: false,
        transformOrigin: 'center',
        content: () => h(LoginView, { modal: true, dialog, callback }),
        class: 'login-modal',
        style: `width: auto; padding: 0`
      })
    },
    /**
     * 登录后关联
     */
    async claimDiagram() {
      const chat = await TrialAiChatApi.claim()
      let url = `/projects/${chat.projectId}/ai-chat-er`
      this.router.replace(url)
    }
  },
  getters: {
    currentChat(state): IBAiChatRecord | undefined {
      if (this.isTrial) return
      const { currentChatId } = state
      if (!currentChatId) return
      return this.chatRecords.find((item) => item.id === currentChatId)
    },
    messages(state): IBAiChatMessage[] {
      if (state.isTrial) return state.trialMessages
      if (!state.currentChatId) return []
      return state.chatRecords.find((item) => item.id === state.currentChatId)?.messages || []
    }
  }
})

/**
 * 从Json中格式化出表和字段
 * @param json
 */
function formatTablesFromJson(json: IBAiChatTableJsonItem[]): IBAiChatTablesMessageItem {
  const tablesItem: IBAiChatTablesMessageItem = {
    add: [],
    remove: [],
    update: []
  }
  const jsonTables = json.filter((item) => item.objectType === 'table')
  tablesItem.add = jsonTables
    .filter((item) => item.operationType === 'new')
    .filter((item) => !!item.name)
    .map((item) => new IBTable(item))
  tablesItem.remove = jsonTables.filter((item) => item.operationType === 'drop').map((item) => item.name)
  tablesItem.update = jsonTables.filter((item) => item.operationType === 'alter').map((item) => new IBTable(item))
  return tablesItem
}

function formatColumnsFromJson(json: IBAiChatTableJsonItem[], tables: IBTable[]): void {
  const jsonColumns = json.filter((item) => item.objectType === 'column')
  const newColumns = jsonColumns.filter((item) => item.operationType === 'new')
  const dropColumns = jsonColumns.filter((item) => item.operationType === 'drop')
  newColumns.forEach((col) => {
    const table = tables.find((item) => item.name === col.tableName)
    if (!table) return
    if (!table.columns) table.columns = []
    const column = new IBTableColumn(col)
    column.tableId = table.id
    const oldColumnIndex = table.columns.findIndex((item) => item.name === column.name)
    if (oldColumnIndex !== -1) {
      table.columns[oldColumnIndex] = column
    } else {
      table.columns.push(column)
    }
  })
  dropColumns.forEach((item) => {
    const table = tables.find((tb) => tb.name === item.tableName)
    if (!table) return
    const columnIndex = table.columns?.findIndex((col) => col.name === item.name)
    if (columnIndex === undefined || columnIndex === -1) return
    table.columns?.splice(columnIndex, 1)
  })
}

/**
 * 从Json中格式化出外键关联
 * @param json
 * @param tables
 */
function formatLinesFromJson(json: IBAiChatTableJsonItem[], tables: IBTable[]): IBAiChatLinesMessageItem {
  const linesItem: IBAiChatLinesMessageItem = {
    add: [],
    remove: [],
    update: []
  }
  let lines: IBDiagramLine[] = []
  const fks = (json as unknown as IBAiChatTableJsonItem<string[]>[])
    .filter((item) => item.objectType === 'foreignKey')
    .filter((item) => item.operationType === 'new')
  fks.forEach((fk) => {
    const formTable = tables.find((item) => item.name === fk.tableName)
    const toTable = tables.find((item) => item.name === fk.refTable)
    fk.columns?.forEach((k, index) => {
      const fromColumn = formTable?.columns?.find((item) => item.name === k)
      const toColumn = toTable?.columns?.find((item) => item.name === fk.refColumns![index])
      if (!fromColumn || !toColumn) return
      const line = new IBDiagramLine()
      line.text = fk.name
      line.fromField = fromColumn.id
      line.fromFieldHandle = 'left'
      line.toField = toColumn.id
      line.toFieldHandle = 'right'
      lines.push(line)
    })
  })
  linesItem.add = lines
  return linesItem
}
