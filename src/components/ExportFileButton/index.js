import { Button, Popover } from 'antd';
import React, { useState } from 'react';
import { Icon, SvgIcon, FontAwesomeIcon } from 'assets/icons';
import { useTranslation } from 'react-i18next';
import { notify } from 'utils/helperFuncs';
import { useExportCart } from 'hooks/cart';
import { EXPORT_CART_TYPE, EXPORT_FILE_ACTION } from 'config/constants';
import './index.scss';
import { useExportOrder } from 'hooks/order';

const ExportFileButton = ({ id, action }) => {
  const { t } = useTranslation();
  const [isExportedFile, setIsExportedFile] = useState(false);
  const { handleExportCart } = useExportCart();
  const { handleExportOrder } = useExportOrder();

  const handleExportFile = async (type) => {
    setIsExportedFile(false);
    switch (action) {
      case EXPORT_FILE_ACTION.CART:
        await handleExportCart({
          cartID: id,
          fileType: type,
        })
          .then((response) => {
            const fileUrl = response.data.cart.exportFile.url;
            window.open(fileUrl, '_blank').focus();
          })
          .catch((error) => {
            notify.error({
              message: t('cart.exportCartError'),
              description: error.message,
            });
          });
        break;
      case EXPORT_FILE_ACTION.ORDER:
        await handleExportOrder({
          orderID: id,
          fileType: type,
        })
          .then((response) => {
            const fileUrl = response.data.order.exportFile.url;
            window.open(fileUrl, '_blank').focus();
          })
          .catch((error) => {
            notify.error({
              message: t('order.orderDetail.exportOrderError'),
              description: error.message,
            });
          });
        break;
      default:
        break;
    }
  };

  return (
    <Popover
      overlayClassName="exportedFilesPopover"
      content={
        <>
          <Button
            type="text"
            onClick={() => {
              handleExportFile(EXPORT_CART_TYPE.JPEG);
            }}
          >
            <div>
              <FontAwesomeIcon icon={Icon.faImage} />
              <b>{t('common.image')}</b>
            </div>
          </Button>
          <Button
            type="text"
            onClick={() => {
              handleExportFile(EXPORT_CART_TYPE.PDF);
            }}
          >
            <div>
              <FontAwesomeIcon icon={Icon.faFilePdf} />
              <b>{t('common.pdf')}</b>
            </div>
          </Button>
        </>
      }
      trigger="click"
      placement="bottomLeft"
      visible={isExportedFile}
      popupAlign={{ offset: [0, -15] }}
      onVisibleChange={(newVisible) => {
        setIsExportedFile(newVisible);
      }}
    >
      <Button type="text">
        <div>
          <SvgIcon.ExportFileCartIcon />
          <b>{t('common.exportFile')}</b>
        </div>
      </Button>
    </Popover>
  );
};

export default ExportFileButton;
