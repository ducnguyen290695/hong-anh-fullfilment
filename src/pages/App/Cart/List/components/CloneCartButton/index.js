import { Button } from 'antd';
import CustomModal from 'components/CustomModal';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notify } from 'utils/helperFuncs';
import { SvgIcon } from 'assets/icons';
import { useHistory } from 'react-router-dom';
import { useCloneCart } from 'hooks/cart';

const CloneCartButton = ({ cartID }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [cloneCartModalVisible, setCloneCartModalVisible] = useState(false);
  const { handleCloneCart } = useCloneCart();

  const onCancelCloneCart = () => {
    setCloneCartModalVisible(false);
  };

  const handleCloneThisCart = async () => {
    await handleCloneCart(cartID)
      .then((response) => {
        const tabKey = response?.data?.cart?.clone?.id;
        history.push({
          state: {
            tab: tabKey ? `${tabKey}` : undefined,
          },
        });
        setCloneCartModalVisible(!cloneCartModalVisible);
        notify.success({
          message: t('cart.cloneCartSuccess'),
        });
      })
      .catch((error) => {
        notify.error({
          message: t('cart.cloneCartError'),
          description: error?.message,
        });
      });
  };
  return (
    <CustomModal
      title={<b>{t('cart.cloneCartConfirmationMessage')}</b>}
      closable={false}
      centered={true}
      footer={false}
      isBlockCloseOnOke
      switchClose={cloneCartModalVisible}
      onCancel={() => onCancelCloneCart()}
      onOke={handleCloneThisCart}
      customComponent={
        <Button type="text">
          <div>
            <SvgIcon.CopyCartIcon />
            <b>{t('cart.list.tools.replication')}</b>
          </div>
        </Button>
      }
    ></CustomModal>
  );
};

export default CloneCartButton;
