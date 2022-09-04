import { useOrderPermissions } from 'hooks/order';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomModalSelectShipper from '../CustomModalSelectShipper';

const WaitingShippingButtons = ({ checkedKeyList }) => {
  const { t } = useTranslation();
  const { canAssignShipper } = useOrderPermissions();

  return (
    <div className="button-group-of-2">
      {canAssignShipper && (
        <CustomModalSelectShipper
          buttonClassName="btn-main-action"
          buttonLabel={t('order.orderList.confirmShipping')}
          checkedKeyList={checkedKeyList}
        />
      )}
    </div>
  );
};

export default WaitingShippingButtons;
