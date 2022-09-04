import React from 'react';
import CustomModal from 'components/CustomModal';
import './index.scss';
import { WarningOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useCreateOrder } from 'hooks/order';
import { notify } from 'utils/helperFuncs';
import { useHistory } from 'react-router-dom';

const ValidateMessage = ({ condition, message }) => {
  return condition ? (
    <div className="validate-message">
      <WarningOutlined className="warning-icon" />
      {message}
    </div>
  ) : (
    <></>
  );
};

function CustomModalCreateOrder({ cartID, visible, onCancelCreateOrder, cartValidations }) {
  const { t } = useTranslation();
  const history = useHistory();
  const { handleCreateOrder } = useCreateOrder();

  const isValidCart = () => {
    if (cartValidations.notHasProduct) return true;
    return false;
  };

  const handleConfirm = async () => {
    await handleCreateOrder({ id: cartID })
      .then((response) => {
        const orderID = response.data.order.create.id;
        notify.success({ message: t('cart.createOrderSuccess') });
        history.push({
          pathname: `/order/${orderID}`,
        });
      })
      .catch((error) => {
        notify.error({
          message: t('cart.createOrderError'),
          description: error?.message,
        });
      });
  };

  const handleCancel = () => {
    onCancelCreateOrder();
  };
  return (
    <CustomModal
      title={
        <div className="custom-modal-title">
          {isValidCart()
            ? t('cart.createOrderValidateModalTitle')
            : t('cart.createOrderValidateConfirmation')}
        </div>
      }
      closable={false}
      centered={true}
      footer={false}
      isBlockCloseOnOke
      switchClose={visible}
      selfVisibleControlled={false}
      onCancel={() => handleCancel()}
      cancelButtonLabel={isValidCart() ? t('common.close') : t('common.cancel')}
      hideConfirmButton={isValidCart()}
      onOke={handleConfirm}
    >
      <div className="cart-validations">
        <ValidateMessage
          condition={cartValidations.overbalance}
          message={t('cart.validateMessage.overBalance')}
        />
        <ValidateMessage
          condition={cartValidations.notHasProduct}
          message={t('cart.validateMessage.notHasProduct')}
        />
        <ValidateMessage
          condition={cartValidations.outOfStock}
          message={t('cart.validateMessage.outOfStock')}
        />
      </div>
    </CustomModal>
  );
}

export default CustomModalCreateOrder;
