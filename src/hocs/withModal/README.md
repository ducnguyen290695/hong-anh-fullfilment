## Basic use
import withModal from 'hocs/withModal';

const Component({openModal, closeModal}) {
  openModal({
      modalTitle: 'Modal title',
      modalContent: (
        <div>
          Modal content
        </div>
      ),
      onConfirmModal: () => {
        console.log('oke');
        closeModal();
      },
      onCancelModal: () => {
        console.log('cancel');
      },
    });    

  return (
    ...
  )
}

export default withModal(Component);

## openModal's params
- modalTitle?: string
- buttonLoading?: boolean
- htmlType?: string
- okeButtonLabel?: sting
- cancelButtonLabel?: string
- modalContent: React Node
- modalType?: string
- onCancelModal?: Function
- onConfirmModal?: Function
- ...extended modal's props

