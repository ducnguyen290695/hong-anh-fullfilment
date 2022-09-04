import { useState } from 'react';
import { Form, Select } from 'antd';
import CustomModal from 'components/CustomModal';
import { useTranslation } from 'react-i18next';
import { useGetSellerCreateCart } from 'hooks/seller';
import { useCreateCart, useUpdateCartSeller } from 'hooks/cart';
import { notify } from 'utils/helperFuncs';
import { debounce } from 'utils/helperFuncs';
import { useHistory } from 'react-router-dom';

const CustomModalChangeSeller = ({
  action,
  onSubmitSuccess,
  cartID,
  defaultSeller,
  onCancel,
  selectedProducts,
}) => {
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState(defaultSeller?.id || null);
  const [selectedSeller, setSelectedSeller] = useState(
    defaultSeller
      ? {
          label: `${defaultSeller?.code} - ${defaultSeller?.fullName} - ${defaultSeller?.telephone}`,
          value: defaultSeller?.id,
        }
      : null
  );
  const [switchClose, setSwitchClose] = useState(false);
  const { handleCreateCart } = useCreateCart();
  const { handleUpdateCartSeller } = useUpdateCartSeller();
  const { t } = useTranslation();
  const history = useHistory();

  const [params, setParams] = useState({
    offset: 0,
    limit: 10,
    sellerCartSearch: null,
  });

  const getParams = () => ({
    filters: {
      query: params.sellerCartSearch || null,
    },
    pagination: {
      offset: params.offset,
      limit: params.limit,
    },
  });

  const { sellers = [] } = useGetSellerCreateCart(getParams());

  const handleSelectSeller = (value, option) => {
    setSelectedSeller(option?.label);
    setSelectedValue(value);
  };

  const changeParamsOnSearch = ([text]) => {
    if (text[0] === ' ') {
      return;
    }
    const inputText = text.length > 0 ? text : null;
    setSelectedSeller(inputText);
    setParams((prev) => ({ ...prev, sellerCartSearch: inputText }));
  };
  const handleDebouncedSearchSeller = debounce(changeParamsOnSearch, 500);

  const handleSubmitSuccess = () => {
    clearField();
    setSwitchClose(!switchClose);
    onSubmitSuccess();
  };

  const clearField = () => {
    form.resetFields(['seller']);
    setSelectedSeller(null);
  };

  const handleSubmit = async () => {
    const cartItems =
      (await selectedProducts?.map((item) => ({
        productId: item,
        quantity: 1,
        vat: false,
      }))) || null;
    switch (action) {
      case 'addCart':
        await form.validateFields().then(() => {
          handleCreateCart({
            sellerID: selectedValue,
            items: null,
          })
            .then(() => {
              notify.success({
                message: t('cart.create.addSuccess'),
              });
              handleSubmitSuccess();
            })
            .catch((error) => {
              notify.error({
                message: t('cart.create.addError'),
                description: error?.message,
              });
            });
        });
        break;
      case 'addCartFromProduct':
        await form.validateFields().then(() => {
          handleCreateCart({
            sellerID: selectedValue,
            items: cartItems,
          })
            .then((response) => {
              const tabKey = response?.data?.cart?.create?.id;
              notify.success({
                message: t('cart.create.addSuccess'),
              });
              history.push({
                pathname: '/cart',
                state: {
                  tab: tabKey ? `${tabKey}` : undefined,
                },
              });
            })
            .catch((error) => {
              notify.error({
                message: t('cart.create.addError'),
                description: error?.message,
              });
            });
        });
        break;
      case 'changeSeller':
        await form.validateFields().then(() => {
          handleUpdateCartSeller(cartID, selectedValue)
            .then(() => {
              handleSubmitSuccess();
            })
            .catch((error) => {
              notify.error({
                message: t('cart.changeSellerError'),
                description: error?.message,
              });
            });
        });
        break;
      default:
        break;
    }
  };

  return (
    <CustomModal
      width={580}
      selfVisibleControlled={false}
      closable={false}
      centered={true}
      footer={false}
      title={<span className="create-cart-title">{t('cart.create.selectSeller')}</span>}
      onCancel={onCancel}
      onOke={() => handleSubmit()}
      isBlockCloseOnOke
      switchClose={switchClose}
    >
      <Form form={form} name="create-cart-from">
        <Form.Item
          label={t('common.seller')}
          name="seller"
          rules={[
            {
              required: true,
              message: t('cart.create.sellerValidate'),
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            defaultValue={selectedSeller}
            placeholder={t('cart.create.sellerPlaceholder')}
            onSelect={(value, option) => handleSelectSeller(value, option)}
            filterOption={true}
            optionFilterProp="label"
            optionLabelProp="inputRender"
            onSearch={handleDebouncedSearchSeller}
            options={sellers}
          ></Select>
        </Form.Item>
      </Form>
    </CustomModal>
  );
};

export default CustomModalChangeSeller;
