import { Button } from 'antd';
import { STOCK_STATUS } from 'config/constants';
import { useApproveStock, useDenyStock, useOrderPermissions } from 'hooks/order';
import { WARNING_MODAL_ACTION } from 'pages/App/Order/conts';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notify } from 'utils/helperFuncs';
import CustomModalWarning from '../CustomModalWarning';
import './index.scss';

const WaitingStocksButtons = ({ checkedKeyList, selectedList }) => {
  const { t } = useTranslation();
  const [openModalWarningApproval, setOpenModalWarningApproval] = useState(false);
  const [openModalWarningWaitingStock, setOpenModalWarningWaitingStock] = useState(false);

  const { handleApproveStock } = useApproveStock();
  const { handleDenyStock } = useDenyStock();
  const { canApproveStock, canDenyStock } = useOrderPermissions();

  const handleDenyOrder = async () => {
    if (selectedList?.length === 0) {
      notify.error({
        message: t('order.orderList.selectOrderValidate'),
      });
    } else {
      if (selectedList.some((item) => item.inStockStatus === STOCK_STATUS.FULL)) {
        setOpenModalWarningWaitingStock(true);
      } else {
        await handleDenyStock({
          orderIDs: checkedKeyList,
        })
          .then(() => {
            notify.success({
              message: t('order.orderList.denyStockSuccess'),
            });
          })
          .catch((error) => {
            notify.error({
              message: t('order.orderList.denyStockError'),
              description: error.message,
            });
          });
      }
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
              message: t('order.orderList.confirmStockSuccess'),
            });
          })
          .catch((error) => {
            notify.error({
              message: t('order.orderList.confirmStockError'),
              description: error.message,
            });
          });
      }
    }
  };

  return (
    <div className="button-group-of-2">
      {canDenyStock && (
        <>
          <Button onClick={handleDenyOrder}>{t('order.orderDetail.unableToImport')}</Button>
          {openModalWarningWaitingStock && (
            <CustomModalWarning
              openModalWarning={openModalWarningWaitingStock}
              setOpenModalWarning={setOpenModalWarningWaitingStock}
              orderIDs={checkedKeyList}
              action={WARNING_MODAL_ACTION.DENY_STOCK_LIST}
            />
          )}
        </>
      )}

      {canApproveStock && (
        <>
          <Button className="btn-main-action" onClick={handleApproval}>
            {t('order.orderDetail.sufficientConfirmation')}
          </Button>
          {openModalWarningApproval && (
            <CustomModalWarning
              openModalWarning={openModalWarningApproval}
              setOpenModalWarning={setOpenModalWarningApproval}
              orderIDs={checkedKeyList}
              action={WARNING_MODAL_ACTION.CONFIRM_STOCK_LIST}
            />
          )}
        </>
      )}
    </div>
  );
};

export default WaitingStocksButtons;
