export class IBBase {
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string

  constructor(base?: Partial<IBBase>) {
    this.createdAt = base?.createdAt || String(Date.now())
    this.updatedAt = base?.updatedAt || String(Date.now())
  }
}
