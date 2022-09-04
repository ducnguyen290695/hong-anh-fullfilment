import { Button, Modal } from 'antd';
import { FontAwesomeIcon, Icon } from 'assets/icons';
import React, { useEffect, useState } from 'react';
import './index.scss';

const CustomModal = ({
  message,
  buttonLabel,
  onOke,
  onCancel,
  cancelButtonLabel,
  okeButtonLabel,
  customComponent,
  icon,
  title,
  children,
  isBlockCloseOnOke,
  htmlType,
  buttonLoading,
  switchClose,
  afterClose,
  onOpen,
  selfVisibleControlled = true,
  hideConfirmButton = false,
  ...rest
}) => {
  const [localVisible, setLocalVisible] = useState(!selfVisibleControlled);

  function openModal() {
    if (selfVisibleControlled) {
      setLocalVisible(true);
    }
    onOpen && onOpen();
  }

  function closeModal() {
    if (selfVisibleControlled) {
      setLocalVisible(false);
    }
  }

  function handleOk() {
    !isBlockCloseOnOke && closeModal();
    onOke && onOke();
  }

  function handleCancel() {
    closeModal();
    onCancel && onCancel();
  }

  useEffect(() => {
    closeModal();
  }, [switchClose]);

  return (
    <>
      <Modal afterClose={afterClose} {...rest} visible={localVisible} onCancel={handleCancel}>
        <div className="modal-content">
          {icon && (
            <div
              className="delete-icon"
              style={{
                backgroundImage: `url(${icon})`,
              }}
            ></div>
          )}

          {title && <p>{title}</p>}
          {message && <span className="message">{message}</span>}

          <div className="modal-children">{children}</div>

          <div className="btn-group">
            <Button onClick={handleCancel}>{cancelButtonLabel || 'Hủy bỏ'}</Button>
            {!hideConfirmButton && (
              <Button loading={buttonLoading} htmlType={htmlType} type="primary" onClick={handleOk}>
                {okeButtonLabel || 'Xác nhận'}
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {selfVisibleControlled && (
        <div onClick={openModal} className="button">
          {customComponent || <FontAwesomeIcon icon={Icon.faTrash} />}
          {buttonLabel && <span>{buttonLabel}</span>}
        </div>
      )}
    </>
  );
};

export default CustomModal;
