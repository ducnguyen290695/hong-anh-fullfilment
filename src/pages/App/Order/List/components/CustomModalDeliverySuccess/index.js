import CustomModal from 'components/CustomModal';
import UploadDocument from 'components/UploadDocument';
import { ACCEPT_IMG_TYPES } from 'config/constants';
import { useCompletedOrder } from 'hooks/order';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notify } from 'utils/helperFuncs';
import './index.scss';

const CustomModalDeliverySuccess = ({ orderID, setOpenModalDeliverySuccess }) => {
  const { t } = useTranslation();
  const [fileUrls, setFileUrls] = useState([]);
  const { handleCompletedOrder } = useCompletedOrder();

  function handleUploadSuccess(urls) {
    setFileUrls(urls);
  }

  const handleConfirm = async () => {
    await handleCompletedOrder({
      orderID: orderID,
      imageURLs: fileUrls,
    })
      .then(() => {
        notify.success({
          message: t('order.deliverySuccess.successfulDelivery'),
        });
        setOpenModalDeliverySuccess(false);
      })
      .catch((error) => {
        notify.error({
          message: t('order.deliverySuccess.errorDelivery'),
          description: error.message,
        });
      });
  };

  const handleCancel = () => {
    setOpenModalDeliverySuccess(false);
  };
  return (
    <CustomModal
      title={<p className="delivery-success-title">{t('order.deliverySuccess.tittle')}</p>}
      closable={false}
      centered={true}
      footer={false}
      isBlockCloseOnOke
      selfVisibleControlled={false}
      onOke={handleConfirm}
      onCancel={handleCancel}
    >
      <div className="upload-image">
        <UploadDocument onUploadSuccess={handleUploadSuccess} accept={ACCEPT_IMG_TYPES.join(',')} />
        <p className="files-support">({t('order.deliverySuccess.supportedFiles')})</p>
      </div>
    </CustomModal>
  );
};

export default CustomModalDeliverySuccess;
