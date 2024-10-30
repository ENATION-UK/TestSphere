import { defineStore } from 'pinia'
import { IBIDEPluginInfo } from '@/types/workbench'
import { DevicesApi } from '@/api/workbench'

interface DeviceState {
  devices: IBIDEPluginInfo[]
  loading: boolean
}

export const useDeviceStore = defineStore('workbench/device', {
  state: (): DeviceState => ({
    devices: [],
    loading: false
  }),
  actions: {
    /**
     * 获取已连接IDE列表
     */
    async getDevices() {
      try {
        this.loading = true
        const devices = await DevicesApi.bindings()
        this.devices = devices.sort((a, b) => Number(a.id) - Number(b.id))
      } finally {
        this.loading = false
      }
    }
  }
})
