import { useState } from 'react';
import { Modal, Button } from 'antd';
import Img from 'assets/images';
import { useTranslation } from 'react-i18next';
import './index.scss';

const MODAL_TYPE = {
  DELETE: 'DELETE',
};

const withModal = (Component) => {
  return ({ ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    const defaultModalConfig = {
      footer: false,
      centered: true,
      visible: isOpen,
      onCancel: handleCancel,
    };

    const [modalConfig, setModalConfig] = useState({
      modalTitle: '',
      buttonLoading: false,
      htmlType: '',
      okeButtonLabel: '',
      cancelButtonLabel: '',
      modalContent: <></>,
      modalType: '',
      onCancelModal: () => {},
      onConfirmModal: () => {},
    });

    function openModal(config) {
      setIsOpen(true);
      setModalConfig({
        ...modalConfig,
        ...config,
      });
    }

    function closeModal() {
      setIsOpen(false);
    }

    function handleCancel() {
      closeModal();
      modalConfig.onCancelModal && modalConfig.onCancelModal();
    }
    return (
      <>
        <Modal {...defaultModalConfig} {...modalConfig}>
          <div className="modal-content">
            <p className="modal-title">{modalConfig.modalTitle}</p>

            {modalConfig.modalType && (
              <div
                className="icon"
                style={{
                  backgroundImage: `url(${Img.DeleteIcon})`,
                }}
              ></div>
            )}

            <div className="modal-children">{modalConfig.modalContent}</div>

            <div className="btn-group">
              <Button onClick={handleCancel}>
                {modalConfig.cancelButtonLabel || t('common.cancel')}
              </Button>
              <Button
                loading={modalConfig.buttonLoading}
                htmlType={modalConfig.htmlType}
                type="primary"
                onClick={modalConfig.onConfirmModal}
              >
                {modalConfig.okeButtonLabel || t('common.confirm')}
              </Button>
            </div>
          </div>
        </Modal>

        <Component
          {...{
            openModal,
            closeModal,
            ...props,
          }}
        />
      </>
    );
  };
};

export default withModal;
