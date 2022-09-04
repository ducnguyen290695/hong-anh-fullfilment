import React from 'react';
import CustomModal from 'components/CustomModal';
import './index.scss';
import { WarningOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { notify } from 'utils/helperFuncs';
import { useApproveStock, useDenyStock, useWaitingStock } from 'hooks/order';
import { WARNING_MODAL_ACTION } from 'pages/App/Order/conts';

const ValidateMessage = ({ message }) => {
  return (
    <div className="validate-message">
      <WarningOutlined className="warning-icon" />
      {message}
    </div>
  );
};

function CustomModalWarning({ orderIDs, openModalWarning, setOpenModalWarning, action }) {
  const { t } = useTranslation();
  const { handleApproveStock } = useApproveStock();
  const { handleWaitingStock } = useWaitingStock();
  const { handleDenyStock } = useDenyStock();

  const renderMessageByAction = () => {
    switch (action) {
      case WARNING_MODAL_ACTION.APPROVAL_STOCK_LIST:
        return <ValidateMessage message={t('order.changeOrderStatusWarning.approvalStockList')} />;
      case WARNING_MODAL_ACTION.APPROVAL_STOCK_DETAIL:
        return (
          <ValidateMessage message={t('order.changeOrderStatusWarning.approvalStockDetail')} />
        );
      case WARNING_MODAL_ACTION.WAITING_STOCK_LIST:
        return <ValidateMessage message={t('order.changeOrderStatusWarning.waitingStockList')} />;
      case WARNING_MODAL_ACTION.WAITING_STOCK_DETAIL:
        return <ValidateMessage message={t('order.changeOrderStatusWarning.waitingStockDetail')} />;
      case WARNING_MODAL_ACTION.DENY_STOCK_LIST:
        return <ValidateMessage message={t('order.changeOrderStatusWarning.denyStockList')} />;
      case WARNING_MODAL_ACTION.DENY_STOCK_DETAIL:
        return <ValidateMessage message={t('order.changeOrderStatusWarning.denyStockDetail')} />;
      case WARNING_MODAL_ACTION.CONFIRM_STOCK_LIST:
        return <ValidateMessage message={t('order.changeOrderStatusWarning.confirmStockList')} />;
      case WARNING_MODAL_ACTION.CONFIRM_STOCK_DETAIL:
        return <ValidateMessage message={t('order.changeOrderStatusWarning.confirmStockDetail')} />;
      default:
        return <></>;
    }
  };

  const handleConfirm = async () => {
    switch (action) {
      case WARNING_MODAL_ACTION.APPROVAL_STOCK_DETAIL:
      case WARNING_MODAL_ACTION.APPROVAL_STOCK_LIST:
        await handleApproveStock({
          orderIDs: orderIDs,
        })
          .then(() => {
            notify.success({
              message: t('order.orderList.approvedEnoughStockSuccess'),
            });
            setOpenModalWarning(false);
          })
          .catch((error) => {
            notify.error({
              message: t('order.orderList.approvedEnoughStockError'),
              description: error.message,
            });
          });
        break;

      case WARNING_MODAL_ACTION.WAITING_STOCK_DETAIL:
      case WARNING_MODAL_ACTION.WAITING_STOCK_LIST:
        await handleWaitingStock({
          orderIDs: orderIDs,
        })
          .then(() => {
            notify.success({
              message: t('order.orderList.waitingForStockSuccess'),
            });
            setOpenModalWarning(false);
          })
          .catch((error) => {
            notify.error({
              message: t('order.orderList.waitingForStockError'),
              description: error.message,
            });
          });
        break;

      case WARNING_MODAL_ACTION.DENY_STOCK_LIST:
      case WARNING_MODAL_ACTION.DENY_STOCK_DETAIL:
        await handleDenyStock({
          orderIDs: orderIDs,
        })
          .then(() => {
            notify.success({
              message: t('order.orderList.denyStockSuccess'),
            });
            setOpenModalWarning(false);
          })
          .catch((error) => {
            notify.error({
              message: t('order.orderList.denyStockError'),
              description: error.message,
            });
          });
        break;

      case WARNING_MODAL_ACTION.CONFIRM_STOCK_LIST:
      case WARNING_MODAL_ACTION.CONFIRM_STOCK_DETAIL:
        await handleApproveStock({
          orderIDs: orderIDs,
        })
          .then(() => {
            notify.success({
              message: t('order.orderList.confirmStockSuccess'),
            });
            setOpenModalWarning(false);
          })
          .catch((error) => {
            notify.error({
              message: t('order.orderList.confirmStockError'),
              description: error.message,
            });
          });
        break;

      default:
        break;
    }
  };

  const handleCancel = () => {
    setOpenModalWarning(false);
  };

  return (
    <CustomModal
      closable={false}
      centered={true}
      footer={false}
      isBlockCloseOnOke
      switchClose={openModalWarning}
      selfVisibleControlled={false}
      onOke={handleConfirm}
      onCancel={handleCancel}
    >
      <div className="cart-validations">{renderMessageByAction(action)}</div>
    </CustomModal>
  );
}

export default CustomModalWarning;
