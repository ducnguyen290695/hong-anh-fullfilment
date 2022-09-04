import React, { useState } from 'react';
import './index.scss';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCartItems, useRemovedItemIDs } from 'hooks/cart/index';
import CustomModal from 'components/CustomModal';
import { notify } from 'utils/helperFuncs';

const InputCounter = ({ record, cartID, refetch }) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(record?.quantity);
  const [switchClose, setSwitchClose] = useState(false);

  const { handleCartItems } = useCartItems();
  const { handleRemovedItemIDs } = useRemovedItemIDs();

  const isOutOfStock = () => {
    if (record.quantity > record.inStock) return true;
    else return false;
  };

  const handleChangeQuantity = (e) => {
    const value = e.target.value;
    if (value <= 0) {
      return;
    }
    setQuantity(value);
    changeQuantityCartItems(value);
  };

  const changeQuantityCartItems = async (value) => {
    try {
      await handleCartItems(cartID, { id: record.id, quantity: value, vat: record.vat });
      refetch();
    } catch (e) {
      notify.error({
        message: t('cart.changeQuantityCartItemsError'),
        description: e?.message,
      });
    }
  };

  const removeItem = async () => {
    try {
      await handleRemovedItemIDs(cartID, record.id);
      setSwitchClose(!switchClose);
      notify.success({
        message: t('cart.removedItemInCartSuccess'),
      });
      refetch();
    } catch (e) {
      notify.error({
        message: t('cart.removedItemInCartSuccess'),
        description: e?.message,
      });
    }
  };

  return (
    <>
      <div className="input-counter">
        <div className={`input ${isOutOfStock() ? 'alert' : ''}`}>
          {quantity === 1 ? (
            <CustomModal
              width="35%"
              centered={true}
              footer={false}
              title={<span className="create-cart-title">{t('cart.removedItemInCart')}</span>}
              onOke={() => removeItem()}
              isBlockCloseOnOke
              switchClose={switchClose}
              customComponent={
                <Button type="text" className="minus-btn" icon={<MinusOutlined />} size={'large'} />
              }
            ></CustomModal>
          ) : (
            <div className="button">
              <Button
                type="text"
                className="minus-btn"
                icon={<MinusOutlined />}
                size={'large'}
                onClick={() => {
                  setQuantity(+quantity - 1);
                  changeQuantityCartItems(+quantity - 1);
                }}
              />
            </div>
          )}

          <InputNumber
            controls={false}
            value={quantity}
            onBlur={handleChangeQuantity}
            onPressEnter={handleChangeQuantity}
            pattern="/^d*[1-9]d*$/"
          />
          <div className="button">
            <Button
              type="text"
              className="plus-btn"
              icon={<PlusOutlined />}
              size={'large'}
              onClick={() => {
                setQuantity(+quantity + 1);
                changeQuantityCartItems(+quantity + 1);
              }}
            />
          </div>
        </div>
        {isOutOfStock() && <p className="alert">{t('common.lackOfStock')}</p>}
      </div>
    </>
  );
};

export default InputCounter;
