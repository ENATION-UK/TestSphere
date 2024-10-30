<template>
  <div class="ide-list">
    <div class="title-list">
      <span class="title-text">{{ $t('wb.device.ide_list') }}</span>
      <n-button type="primary" text @click="addDevice">
        <template #icon>
          <ib-spin-loading v-if="deviceStore.loading" />
          <n-icon v-else :component="AddAlt" />
        </template>
      </n-button>
    </div>
    <n-table :bordered="false" single-line class="ide-table">
      <thead>
        <tr>
          <th>{{ $t('wb.menus.device') }}</th>
          <th>{{ $t('status') }}</th>
          <th>{{ $t('wb.device.ip') }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in deviceStore.devices" :key="item.id">
          <td>
            <div class="ide-name">
              <i class="icon-ide" :class="item.ideType"></i>
              <n-ellipsis>{{ item.ideName }}</n-ellipsis>
            </div>
          </td>
          <td class="status-item">
            <span v-if="item.status === 'ONLINE'" :class="item.status">{{ $t('wb.device.status_online') }}</span>
            <span v-if="item.status === 'OFFLINE'" :class="item.status">{{ $t('wb.device.status_offline') }}</span>
            <span v-if="item.status === 'CONNECTING'" :class="item.status">
              {{ $t('wb.device.status_connecting') }}
            </span>
          </td>
          <td>{{ item.ipAddress }}</td>
          <td>
            <div class="ide-unlink">
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button text type="error" @click="handleUnlinkIde(item)">
                    <n-icon size="18">
                      <unlink />
                    </n-icon>
                  </n-button>
                </template>
                {{ $t('wb.device.unlink') }}
              </n-tooltip>
            </div>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AddAlt from '@vicons/carbon/AddAlt'
import Unlink from '@vicons/carbon/Unlink'
import { IBIDEPluginInfo } from '@/types/workbench'
import { useDeviceStore } from '@/store/workbench'
import { useIbModal } from '@/hooks'
import { DevicesApi } from '@/api/workbench'
import IbSpinLoading from '@/components/IbSpinLoading.vue'

const route = useRoute()
const deviceStore = useDeviceStore()

const handleUnlinkIde = async (device: IBIDEPluginInfo) => {
  window.$confirm(window.$t('wb.device.confirm_unlink'), {}, async () => {
    await DevicesApi.unBinding(device.id)
    await deviceStore.getDevices()
  })
}
const addDevice = () => {
  location.hash = '#bind'
}

onMounted(async () => {
  deviceStore.getDevices()
  showBindModal()
})
const showBindModal = () => {
  const { hash } = route
  if (!hash || hash !== '#bind') return
  useIbModal().bindDeviceModalRef.value?.show()
}
watch(() => route.hash, showBindModal)
</script>

<style scoped lang="scss">
.ide-list {
  width: 100%;
  height: 100%;
  padding-left: 24px;
  padding-top: 24px;
  background-color: #ffffff;
  .title-list {
    display: flex;
    align-items: center;
    .title-text {
      font-size: 22px;
      font-weight: bold;
      margin-right: 24px;
    }
  }
  .ide-table {
    max-width: 350px;
    &.skeleton {
      margin-top: 24px;
    }
    :deep(th) {
      background-color: transparent;
      border: none;
    }
    :deep(tbody) {
      tr {
        &:hover td {
          background-color: var(--hover-color);
        }
      }
    }
    :deep(td) {
      height: 1px;
      border: none;
    }
  }
  .ide-name {
    display: flex;
    align-items: center;
    width: 270px;
    .icon-ide {
      display: block;
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      margin-right: 10px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center center;
      &.idea {
        background-image: url('@/assets/icons/icon-IntelliJ_IDEA.svg');
      }
      &.webstorm {
        background-image: url('@/assets/icons/icon-WebStorm.svg');
      }
      &.vscode {
        background-image: url('@/assets/icons/icon-Visual_Studio_Code.svg');
        background-size: 85%;
      }
    }
  }
  .ide-unlink {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
  }
  .status-item {
    .ONLINE {
      color: var(--success-color);
    }
    .OFFLINE {
      color: var(--error-color);
    }
    .CONNECTING {
      color: var(--warning-color);
    }
  }
}
</style>
