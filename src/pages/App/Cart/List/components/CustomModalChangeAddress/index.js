import { List, Tag, Tooltip } from 'antd';
import { SvgIcon } from 'assets/icons';
import CustomModal from 'components/CustomModal';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import './index.scss';
import { useUpdateCart } from 'hooks/cart';
import { notify } from 'utils/helperFuncs';
import { unset } from 'lodash';

const CustomModalChangeAddress = ({ cartID, id, initCartInput, refetch, data, type }) => {
  const { t } = useTranslation();
  const { handleUpdateCart, loading: changingAddress } = useUpdateCart();
  const [selected, setSelected] = useState(id);
  const [switchClose, setSwitchClose] = useState(false);
  const SENDERS = 'SENDERS';
  const SELLERS = 'SELLERS';

  const handleClick = (item) => {
    setSelected(item);
  };

  const changeAddress = async () => {
    switch (type) {
      case SENDERS:
        try {
          unset(initCartInput, 'promisedDeliverDate');
          unset(initCartInput, 'vat');
          const newSender = data?.find((item) => item.id === selected);
          await handleUpdateCart(cartID, {
            ...initCartInput,
            senderName: newSender?.fullName,
            senderPhone: newSender?.telephone,
            senderAddress: newSender?.address,
          });
          setSwitchClose(!switchClose);
          refetch();
        } catch (e) {
          notify.error({
            message: t('cart.updateShippingContactError'),
            description: t('cart.updateShippingContactError'),
          });
        }
        break;
      case SELLERS:
        try {
          unset(initCartInput, 'promisedDeliverDate');
          unset(initCartInput, 'vat');
          const newSeller = data?.find((item) => item.id === selected);
          await handleUpdateCart(cartID, { ...initCartInput, shippingContactID: newSeller.id });
          setSwitchClose(!switchClose);
          refetch();
        } catch (e) {
          notify.error({
            message: t('cart.updateShippingContactError'),
            description: t('cart.updateShippingContactError'),
          });
        }
        break;
      default:
        break;
    }
  };

  return (
    <CustomModal
      width="35%"
      centered={true}
      footer={false}
      title={<span className="create-cart-title">{t('cart.changeAddress.title')}</span>}
      onCancel={() => setSelected(id)}
      onOke={() => changeAddress()}
      isBlockCloseOnOke={true}
      customComponent={
        <Tooltip title={t('cart.changeAddress.title')}>
          <SvgIcon.EditCartIcon />
        </Tooltip>
      }
      switchClose={switchClose}
      buttonLoading={changingAddress}
    >
      <List
        className="list-info-shipping"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item key={index} onClick={() => handleClick(item.id)}>
            <div
              className={`item-info-shipping ${item.isDefault && 'active'} ${
                item.id === selected ? 'selected' : ''
              }`}
            >
              <div className="info-user">
                <div>
                  <b>{item.fullName}</b> | {item.telephone}
                </div>
                <Tag>{t('cart.changeAddress.default')}</Tag>
              </div>
              <p className="address">{item.address}</p>
            </div>
          </List.Item>
        )}
      ></List>
    </CustomModal>
  );
};

export default CustomModalChangeAddress;
