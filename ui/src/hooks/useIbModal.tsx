import { defineComponent, ref } from 'vue'

import AccountModal from '@/views/workbench/account/AccountModal.vue'
import BindDeviceModal from '@/views/workbench/devices/BindDeviceModal.vue'
import AiPointLogModal from '@/views/workbench/manage/AiPointLogModal.vue'
import BuyAiPointModal from '@/views/workbench/manage/BuyAiPointModal.vue'
import BuyPlanModal from '@/views/workbench/manage/BuyPlanModal.vue'
import BuySeatsModal from '@/views/workbench/manage/BuySeatsModal.vue'
import InviteToJoinModal from '@/views/workbench/manage/InviteToJoinModal.vue'
import InvoicingModal from '@/views/workbench/manage/InvoicingModal.vue'
import ReceiveInvitationModal from '@/views/workbench/ReceiveInvitationModal.vue'

const accountModalRef = ref<InstanceType<typeof AccountModal>>()
const bindDeviceModalRef = ref<InstanceType<typeof BindDeviceModal>>()
const receiveInvitationModalRef = ref<InstanceType<typeof ReceiveInvitationModal>>()
const buySeatsModalRef = ref<InstanceType<typeof BuySeatsModal>>()
const buyPlanModalRef = ref<InstanceType<typeof BuyPlanModal>>()
const buyAiPointModalRef = ref<InstanceType<typeof BuyAiPointModal>>()
const aiPointLogModalRef = ref<InstanceType<typeof AiPointLogModal>>()
const invoicingModalRef = ref<InstanceType<typeof InvoicingModal>>()
const inviteToJoinModalRef = ref<InstanceType<typeof InviteToJoinModal>>()

const ModalProvider = defineComponent({
  render() {
    return (
      <>
        <AccountModal ref={accountModalRef} />
        <AiPointLogModal ref={aiPointLogModalRef} />
        <InvoicingModal ref={invoicingModalRef} />
        <InviteToJoinModal ref={inviteToJoinModalRef} />
        <BindDeviceModal ref={bindDeviceModalRef} />
        <BuySeatsModal ref={buySeatsModalRef} />
        <BuyPlanModal ref={buyPlanModalRef} />
        <BuyAiPointModal ref={buyAiPointModalRef} />
        <ReceiveInvitationModal ref={receiveInvitationModalRef} />
      </>
    )
  }
})

export function useIbModal() {
  return {
    ModalProvider,
    accountModalRef,
    bindDeviceModalRef,
    buySeatsModalRef,
    buyPlanModalRef,
    buyAiPointModalRef,
    aiPointLogModalRef,
    invoicingModalRef,
    inviteToJoinModalRef,
    receiveInvitationModalRef
  }
}
