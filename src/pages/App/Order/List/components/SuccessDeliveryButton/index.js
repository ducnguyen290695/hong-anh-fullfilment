import { RightOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CustomModalDeliverySuccess from '../CustomModalDeliverySuccess';

const SuccessDeliveryButton = ({ orderID }) => {
  const { t } = useTranslation();
  const [openModalDeliverySuccess, setOpenModalDeliverySuccess] = useState(false);

  const onOpenModalDeliverySuccess = () => {
    setOpenModalDeliverySuccess(!openModalDeliverySuccess);
  };
  return (
    <>
      <Link onClick={onOpenModalDeliverySuccess}>
        {t('order.orderList.linkShippingSuccess')} <RightOutlined />
      </Link>
      {openModalDeliverySuccess && (
        <CustomModalDeliverySuccess
          setOpenModalDeliverySuccess={setOpenModalDeliverySuccess}
          orderID={orderID}
        />
      )}
    </>
  );
};

export default SuccessDeliveryButton;
