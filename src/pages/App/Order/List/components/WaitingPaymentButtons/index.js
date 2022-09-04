import { Button } from 'antd';
import { useOrderPermissions } from 'hooks/order';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notify } from 'utils/helperFuncs';
import CustomModalCancelOrder from '../CustomModalCancelOrder';
import '../WaitingApprovalButtons/index.scss';

const WaitingPaymentButtons = ({ checkedKeyList }) => {
  const { t } = useTranslation();
  const [openModalCancelOrder, setOpenModalCancelOrder] = useState(false);

  const { canCancelOrder } = useOrderPermissions();

  const handleCancelOrder = () => {
    if (checkedKeyList?.length === 0) {
      notify.error({
        message: t('order.orderList.selectOrderValidate'),
      });
    } else {
      setOpenModalCancelOrder(true);
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
    </div>
  );
};

export default WaitingPaymentButtons;
