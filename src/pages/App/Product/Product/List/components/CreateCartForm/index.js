import { useState } from 'react';
import { Form, Select } from 'antd';
import { useGetSellerCreateCart } from 'hooks/seller';
import CustomModal from 'components/CustomModal';
import './index.scss';
import { useHistory } from 'react-router-dom';
import { useCreateCart } from 'hooks/cart';
import { notify } from 'utils/helperFuncs';
import { useTranslation } from 'react-i18next';
import useSearchTextDebounce from 'hooks/useSearchTextDebounce';

const CreateCartForm = ({ selectedProducts, onCancel }) => {
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState('');
  const history = useHistory();
  const { t } = useTranslation();

  const [params, setParams] = useState({
    offset: 0,
    limit: 10,
    sellerCreateCartSearch: null,
  });

  const getParams = () => ({
    filters: {
      query: params.sellerCreateCartSearch || null,
    },
    pagination: {
      offset: params.offset,
      limit: params.limit,
    },
  });

  const { sellers = [] } = useGetSellerCreateCart(getParams());
  const { handleCreateCart } = useCreateCart();

  const handleSelectSeller = (value) => {
    setSelectedValue(value);
  };

  const handleSubmit = async () => {
    const cartItems =
      (await selectedProducts?.map((item) => ({
        productId: item,
        quantity: 1,
        vat: false,
      }))) || null;
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
  };

  const { onSearch } = useSearchTextDebounce(params, setParams, 'sellerCreateCartSearch');

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
            placeholder={t('cart.create.sellerPlaceholder')}
            onChange={(value, option) => handleSelectSeller(value, option)}
            filterOption={true}
            optionFilterProp="label"
            onSearch={onSearch}
            options={sellers}
          />
        </Form.Item>
      </Form>
    </CustomModal>
  );
};

export default CreateCartForm;
