import React, { useState } from 'react';
import withModal from 'hocs/withModal';
import { Button, Form, InputNumber, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { REGEX } from 'config/constants';
import { useGetShipper } from 'hooks/user/user';
import { debounce, notify } from 'utils/helperFuncs';
import { useConfirmDeliver } from 'hooks/order';

const Component = ({ openModal, closeModal, buttonClassName, buttonLabel, checkedKeyList }) => {
  const { t } = useTranslation();
  const { handleConfirmDeliver } = useConfirmDeliver();

  const [form] = Form.useForm();
  const [params, setParams] = useState({
    offset: 0,
    limit: 10,
    shipperSearch: null,
  });

  const getParams = () => ({
    filters: {
      query: params.shipperSearch || null,
    },
    pagination: {
      offset: params.offset,
      limit: params.limit,
    },
  });

  const { shippers = [] } = useGetShipper(getParams());

  const changeParamsOnSearch = ([text]) => {
    if (text[0] === ' ') {
      return;
    }
    const inputText = text.length > 0 ? text : null;
    setParams((prev) => ({ ...prev, shipperSearch: inputText }));
  };
  const handleDebouncedSearchShipper = debounce(changeParamsOnSearch, 500);

  const clearField = () => {
    form.resetFields(['shipper', 'receivable']);
  };

  const handleCancelSelectShipper = () => {
    clearField();
  };

  const handleConfirmSelectShipper = async () => {
    const formFields = await form.getFieldsValue(true);
    await form.validateFields().then(() => {
      handleConfirmDeliver({
        orderID: checkedKeyList,
        shipperID: formFields.shipper,
      })
        .then(() => {
          notify.success({
            message: t('order.selectingShipper.confirmDeliverSuccess'),
          });
        })
        .catch((error) => {
          notify.error({
            message: t('order.selectingShipper.confirmDeliverError'),
            description: error.message,
          });
        });
    });
  };

  const handleClick = () => {
    if (checkedKeyList?.length === 0) {
      notify.error({
        message: t('order.orderList.selectOrderValidate'),
      });
    } else {
      openModalSelectShipper();
    }
  };

  const openModalSelectShipper = () => {
    openModal({
      closable: false,
      modalTitle: t('order.selectingShipper.tittle'),
      onConfirmModal: () => {
        handleConfirmSelectShipper();
        closeModal();
      },
      onCancelModal: () => {
        handleCancelSelectShipper();
      },
      modalContent: (
        <>
          <Form form={form} name="create-cart-from">
            <Form.Item
              label={t('order.selectingShipper.shipperLabel')}
              name="shipper"
              rules={[
                {
                  required: true,
                  message: t('order.selectingShipper.shipperValidateMessage'),
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                placeholder={t('order.selectingShipper.shipperPlaceholder')}
                filterOption={true}
                optionFilterProp="label"
                optionLabelProp="selectionRender"
                onSearch={handleDebouncedSearchShipper}
                options={shippers}
              ></Select>
            </Form.Item>
            <Form.Item label={t('order.selectingShipper.receivableLabel')} name="receivable">
              <InputNumber
                formatter={(value) => value.replace(REGEX.CURRENCY, '.')}
                parser={(value) => value.replace(REGEX.CURRENCY_PARSER, '')}
                controls={false}
                addonAfter="₫"
              ></InputNumber>
            </Form.Item>
          </Form>
        </>
      ),
    });
  };

  return (
    <Button className={buttonClassName} onClick={handleClick} type="primary">
      {buttonLabel}
    </Button>
  );
};

export default withModal(Component);
