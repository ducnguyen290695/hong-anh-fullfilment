import { Button } from 'antd';
import React, { useState } from 'react';
import { notify } from 'utils/helperFuncs';
import './index.scss';
import CustomModalWarning from '../CustomModalWarning';
import { useTranslation } from 'react-i18next';
import { STOCK_STATUS } from 'config/constants';
import { useApproveStock, useOrderPermissions, useWaitingStock } from 'hooks/order';
import CustomModalCancelOrder from '../CustomModalCancelOrder';
import { WARNING_MODAL_ACTION } from 'pages/App/Order/conts';

const WaitingApprovalButtons = ({ checkedKeyList, selectedList }) => {
  const { t } = useTranslation();
  const [openModalWarningApproval, setOpenModalWarningApproval] = useState(false);
  const [openModalCancelOrder, setOpenModalCancelOrder] = useState(false);
  const [openModalWarningWaitingStock, setOpenModalWarningWaitingStock] = useState(false);

  const { handleApproveStock } = useApproveStock();
  const { handleWaitingStock } = useWaitingStock();
  const { canApproveStock, canWaitStock, canCancelOrder } = useOrderPermissions();

  const handleCancelOrder = () => {
    if (selectedList?.length === 0) {
      notify.error({
        message: t('order.orderList.selectOrderValidate'),
      });
    } else {
      setOpenModalCancelOrder(true);
    }
  };

  const handleApproval = async () => {
    if (selectedList?.length === 0) {
      notify.error({
        message: t('order.orderList.selectOrderValidate'),
      });
    } else {
      if (selectedList.some((item) => item.inStockStatus !== STOCK_STATUS.FULL)) {
        setOpenModalWarningApproval(true);
      } else {
        await handleApproveStock({
          orderIDs: checkedKeyList,
        })
          .then(() => {
            notify.success({
              message: t('order.orderList.approvedEnoughStockSuccess'),
            });
          })
          .catch((error) => {
            notify.error({
              message: t('order.orderList.approvedEnoughStockError'),
              description: error.message,
            });
          });
      }
    }
  };

  const handleWaitingForStock = async () => {
    if (selectedList?.length === 0) {
      notify.error({
        message: t('order.orderList.selectOrderValidate'),
      });
    } else {
      if (selectedList.some((item) => item.inStockStatus === STOCK_STATUS.FULL)) {
        setOpenModalWarningWaitingStock(true);
      } else {
        await handleWaitingStock({
          orderIDs: checkedKeyList,
        })
          .then(() => {
            notify.success({
              message: t('order.orderList.waitingForStockSuccess'),
            });
          })
          .catch((error) => {
            notify.error({
              message: t('order.orderList.waitingForStockError'),
              description: error.message,
            });
          });
      }
    }
  };

  return (
    <div className="button-group-of-3">
      {canCancelOrder && (
        <>
          <Button onClick={handleCancelOrder}>{t('order.orderList.cancelOrder')}</Button>
          {openModalCancelOrder && (
            <CustomModalCancelOrder
              setOpenModalCancelOrder={setOpenModalCancelOrder}
              orderIDs={checkedKeyList}
            />
          )}
        </>
      )}

      {canWaitStock && (
        <>
          <Button onClick={handleWaitingForStock}>
            {t('order.orderList.waitingForEnoughStock')}
          </Button>
          {openModalWarningWaitingStock && (
            <CustomModalWarning
              openModalWarning={openModalWarningWaitingStock}
              setOpenModalWarning={setOpenModalWarningWaitingStock}
              orderIDs={checkedKeyList}
              action={WARNING_MODAL_ACTION.WAITING_STOCK_LIST}
            />
          )}
        </>
      )}

      {canApproveStock && (
        <>
          <Button className="btn-main-action" onClick={handleApproval}>
            {t('order.orderList.approvedEnoughStock')}
          </Button>
          {openModalWarningApproval && (
            <CustomModalWarning
              openModalWarning={openModalWarningApproval}
              setOpenModalWarning={setOpenModalWarningApproval}
              orderIDs={checkedKeyList}
              action={WARNING_MODAL_ACTION.APPROVAL_STOCK_LIST}
            />
          )}
        </>
      )}
    </div>
  );
};

export default WaitingApprovalButtons;
