import { Button } from 'antd';
import { useConfirmExportOrder, useOrderPermissions } from 'hooks/order';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { notify } from 'utils/helperFuncs';

const WaitingExportingButtons = ({ checkedKeyList }) => {
  const { t } = useTranslation();
  const { handleConfirmExportOrder } = useConfirmExportOrder();
  const { canExportStock } = useOrderPermissions();

  const handleExportConfirm = async () => {
    if (checkedKeyList?.length === 0) {
      notify.error({
        message: t('order.orderList.selectOrderValidate'),
      });
    } else {
      await handleConfirmExportOrder({
        orderIDs: checkedKeyList,
      }).then(() => {
        notify.success({
          message: t('order.orderList.exportingSuccess'),
        });
      });
    }
  };

  return (
    <div className="button-group-of-2">
      {canExportStock && (
        <>
          <Button className="btn-main-action" onClick={handleExportConfirm}>
            {t('order.orderDetail.exportConfirmation')}
          </Button>
        </>
      )}
    </div>
  );
};

export default WaitingExportingButtons;
