import React, { useState } from 'react';
import CustomModal from 'components/CustomModal';
import { SvgIcon } from 'assets/icons';
import { useTranslation } from 'react-i18next';
import { useUpdateCartItem } from 'hooks/cart';
import ProductList from 'pages/App/Product/Product/List';
import './index.scss';
import { notify } from 'utils/helperFuncs';
import _ from 'lodash';

const ProductTable = ({
  defaultSelectedProducts,
  cartID,
  onAddProductToCartSuccess,
  disableProductIDs,
  warehouseID,
  sellerID,
}) => {
  const { t } = useTranslation();
  const [selectedRows, setSelectedRows] = useState([]);
  const [resetSelectedRows, setResetSelectedRows] = useState(false);

  const { handleUpdateCartItem } = useUpdateCartItem();

  function handleSelectRows(rows) {
    setSelectedRows(rows);
  }

  async function addProductToCart() {
    const defaultIds = (defaultSelectedProducts || [])?.map((item) => item?.product?.id);
    const selectedIds = (selectedRows || [])?.map((item) => item?.id);
    if (!selectedRows?.length) {
      notify.warning({
        message: t('cart.create.addToCartWarning'),
      });
      return;
    }
    try {
      await handleUpdateCartItem({
        cartID,
        request: {
          newItems: selectedRows
            ?.map(({ id }) => ({
              productId: id,
              vat: false,
              quantity: 1,
            }))
            ?.filter((item) => !defaultIds?.includes(item?.productId)),
          removedItemIDs: _.difference(defaultIds, selectedIds),
        },
      });
      onAddProductToCartSuccess && onAddProductToCartSuccess();
      setResetSelectedRows(!resetSelectedRows);
      notify.success({
        message: t('cart.list.productTable.addProductSuccess'),
      });
    } catch (error) {
      notify.error({
        message: t('cart.list.productTable.addProductFail'),
        description: error.message,
      });
    }
  }

  return (
    <CustomModal
      className="add-product-modal"
      title={<p className="modal-title">{t('cart.list.productTable.title')}</p>}
      centered={true}
      footer={false}
      onOke={addProductToCart}
      okeButtonLabel={t('cart.create.addToCart')}
      customComponent={
        <div className="button-add">
          <SvgIcon.AddProductCartIcon />
          <p>{t('cart.list.infoProduct.buttonAdd')}</p>
        </div>
      }
    >
      <div className="product-list">
        <ProductList
          useInModal
          onSelectRows={handleSelectRows}
          defaultSelectedProducts={defaultSelectedProducts}
          disableProductIDs={disableProductIDs}
          warehouseID={warehouseID}
          resetSelectedRows={resetSelectedRows}
          sellerID={sellerID}
        />
      </div>
    </CustomModal>
  );
};

export default ProductTable;
