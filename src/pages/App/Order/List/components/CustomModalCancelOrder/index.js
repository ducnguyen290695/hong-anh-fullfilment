import { Input, Radio } from 'antd';
import CustomModal from 'components/CustomModal';
import { useCancelOrder } from 'hooks/order';
import { CANCEL_ORDER_REASON } from 'pages/App/Order/conts';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notify } from 'utils/helperFuncs';
import './index.scss';

const CustomModalCancelOrder = ({ setOpenModalCancelOrder, orderIDs }) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [isValidate, setIsValidate] = useState(false);
  const { handleCancelOrder } = useCancelOrder();

  const handleSelect = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleConfirm = async () => {
    if (selectedValue === CANCEL_ORDER_REASON.OTHER && otherReason === '') {
      setIsValidate(true);
    } else {
      setIsValidate(false);
      await handleCancelOrder({
        orderIDs: orderIDs,
        reason: handleCancelReason(),
      }).then(() => {
        notify.success({
          message: t('order.cancelOrder.cancelOrderSuccess'),
        });
        setOpenModalCancelOrder(false);
      });
    }
  };

  const handleCancel = () => {
    setOpenModalCancelOrder(false);
  };

  const handleTypeOtherReasons = (e) => {
    setOtherReason(e.target.value);
  };

  const handleCancelReason = () => {
    if (selectedValue === CANCEL_ORDER_REASON.LACK_OF_STOCK) {
      return t('order.cancelOrder.lackOfStock');
    }
    if (selectedValue === CANCEL_ORDER_REASON.OUT_OF_DEBT) {
      return t('order.cancelOrder.outOfDebt');
    }
    return otherReason;
  };

  return (
    <CustomModal
      title={<div className="cancel-order-title">{t('order.cancelOrder.tittle')}</div>}
      closable={false}
      centered={true}
      footer={false}
      isBlockCloseOnOke
      selfVisibleControlled={false}
      onOke={handleConfirm}
      onCancel={handleCancel}
    >
      <div className="warning-message">
        {selectedValue === '' ? t('order.cancelOrder.warningMessage') : ''}
      </div>
      <Radio.Group value={selectedValue} onChange={(e) => handleSelect(e)}>
        <div className="radio-group">
          <Radio value={CANCEL_ORDER_REASON.LACK_OF_STOCK}>
            {t('order.cancelOrder.lackOfStock')}
          </Radio>
          <Radio value={CANCEL_ORDER_REASON.OUT_OF_DEBT}>{t('order.cancelOrder.outOfDebt')}</Radio>
          <Radio value={CANCEL_ORDER_REASON.OTHER}>
            <div className="other-reason ">
              <span>{t('common.other')}:&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <div>
                <Input
                  placeholder={t('order.cancelOrder.otherPlaceholder')}
                  className="input-other"
                  value={otherReason}
                  onChange={handleTypeOtherReasons}
                  status={isValidate ? 'error' : ''}
                />
                <div className={`validate-message ${isValidate ? '' : 'hidden'}`}>
                  {t('order.cancelOrder.otherFieldCannotEmpty')}
                </div>
              </div>
            </div>
          </Radio>
        </div>
      </Radio.Group>
    </CustomModal>
  );
};

export default CustomModalCancelOrder;
