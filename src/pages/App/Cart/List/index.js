import React, { useState } from 'react';
import { Tabs } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { SvgIcon } from 'assets/icons/index';
import './index.scss';
import CustomTabPane from './components/CustomTabPane';
import { useGetAllCarts, useDeleteCart } from 'hooks/cart/index';
import CustomModal from 'components/CustomModal';
import { useHistory } from 'react-router-dom';
import CustomModalChangeSeller from './components/CustomModalChangeSeller';
import { useTranslation } from 'react-i18next';
import { notify } from 'utils/helperFuncs';

const { TabPane } = Tabs;

const CartList = () => {
  const history = useHistory();
  const [deleteKey, setDeleteKey] = useState();
  const { data = [], refetch } = useGetAllCarts();
  const { handleDeleteCart } = useDeleteCart();
  const { t } = useTranslation();
  const [changeSellerModalVisible, setChangeSellerModalVisible] = useState(false);

  //get active key from history
  function getActiveState() {
    return history?.location?.state?.tab || data.at(0)?.key;
  }

  //add new active key to history
  function changeActiveState(newActiveState) {
    history.push({
      state: {
        tab: newActiveState,
      },
    });
  }

  const handleChangeActiveState = (activeKey) => {
    changeActiveState(activeKey);
  };

  const handleRemove = async () => {
    handleDeleteCartSuccess();
    await handleDeleteCart(deleteKey).catch((error) => {
      notify.error({
        message: t('cart.removeCartError'),
        description: error?.message,
      });
    });
    await refetch();
  };

  const handleEdit = (targetKey) => {
    setDeleteKey(targetKey);
  };

  function handleAddNewCartSuccess() {
    refetch().then((response) => {
      const fetchedCart = response.data.cart.all;
      changeActiveState(`${fetchedCart[fetchedCart.length - 1].id}`);
    });
    setChangeSellerModalVisible(false);
  }

  function handleDeleteCartSuccess() {
    let currentActiveKey = getActiveState();
    let deletedIndex = null;
    data.forEach((pane, i) => {
      if (pane.key === deleteKey) {
        deletedIndex = i;
      }
    });
    if (deletedIndex == null) {
      return;
    }
    if (currentActiveKey === deleteKey) {
      currentActiveKey =
        data?.at(deletedIndex + 1)?.key || data?.at(deletedIndex - 1)?.key || data?.at(0)?.key;
    }
    changeActiveState(currentActiveKey);
  }

  function toggleChangeSellerModalVisible() {
    setChangeSellerModalVisible(!changeSellerModalVisible);
  }

  return (
    <Tabs
      className="cart-list"
      type="editable-card"
      onChange={handleChangeActiveState}
      activeKey={getActiveState()}
      onEdit={handleEdit}
      addIcon={
        <>
          <SvgIcon.AddCartIcon onClick={() => toggleChangeSellerModalVisible()} />
          {changeSellerModalVisible && (
            <CustomModalChangeSeller
              action="addCart"
              onSubmitSuccess={handleAddNewCartSuccess}
              onCancel={() => {
                setChangeSellerModalVisible(false);
              }}
            />
          )}
        </>
      }
    >
      {data?.map((pane) => (
        <TabPane
          tab={pane.tab}
          closable={pane.closable}
          key={pane.key}
          closeIcon={
            <CustomModal
              centered={true}
              footer={false}
              title={<span className="create-cart-title">{t('cart.deleteCartNotify')}</span>}
              onOke={() => handleRemove()}
              customComponent={<CloseOutlined />}
            />
          }
        >
          <CustomTabPane id={pane.key} />
        </TabPane>
      ))}
    </Tabs>
  );
};

export default CartList;
