import { INPUT_TYPE, PRODUCT_INPUT_TYPE, REGEX } from 'config/constants';
import FormInput from 'components/FormInput';
import { Input, Select, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'assets/icons';
import { useProductPermissions } from 'hooks/product/product';

const { Option } = Select;

const EditableCell = ({ editing, dataIndex, inputType, children, ...restProps }) => {
  const { t } = useTranslation();
  const { canUpdateInfo, canUpdatePrice } = useProductPermissions();

  const formFields = {
    currencyField: {
      type: INPUT_TYPE.NUMBER,
      formItemOptions: {
        rules: [
          {
            required: true,
            message: t('product.validateMessage.currency'),
          },
        ],
      },
      inputOptions: {
        placeholder: t('product.placeholder.currency'),
        formatter: (value) => value.replace(REGEX.CURRENCY, '.'),
        parser: (value) => value.replace(REGEX.CURRENCY_PARSER, ''),
        min: 0,
        controls: false,
        maxLength: 11,
        disabled: !canUpdatePrice,
      },
    },
    shortCodeField: {
      type: INPUT_TYPE.INPUT,
      formItemOptions: {
        name: 'shortCode',
        rules: [
          {
            required: true,
            message: t('product.validateMessage.shortCode.blank'),
          },
          {
            type: 'string',
            max: 12,
            message: t('product.validateMessage.shortCode.overLimit'),
          },
          {
            pattern: new RegExp('^[\\w\\d-]+$'),
            message: t('product.validateMessage.shortCode.wrongFormat'),
          },
        ],
      },
      inputOptions: {
        placeholder: t('product.placeholder.shortCode'),
        disabled: !canUpdateInfo,
      },
    },
    vatField: {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        name: 'vat',
      },
      inputOptions: {
        defaultValue: true,
        disabled: !canUpdateInfo,
      },
      inputChildren: (
        <>
          <Option value={true}>
            <SvgIcon.SuccessIcon />
          </Option>
          <Option value={false}>
            <SvgIcon.ErrorIcon />
          </Option>
        </>
      ),
    },
  };

  let inputNode = {};
  switch (inputType) {
    case PRODUCT_INPUT_TYPE.SHORT_CODE:
      inputNode = <FormInput {...formFields.shortCodeField} />;
      break;
    case PRODUCT_INPUT_TYPE.CURRENCY:
      inputNode = (
        <FormInput
          {...formFields.currencyField}
          formItemOptions={{
            ...formFields.currencyField.formItemOptions,
            name: dataIndex,
          }}
        />
      );
      break;
    case PRODUCT_INPUT_TYPE.NUMBER:
      inputNode = (
        <FormInput
          {...formFields.numberField}
          formItemOptions={{
            ...formFields.numberField.formItemOptions,
            name: dataIndex,
          }}
        />
      );
      break;
    case PRODUCT_INPUT_TYPE.VAT:
      inputNode = <FormInput {...formFields.vatField} />;
      break;
    default:
      inputNode = (
        <Form.Item>
          <Input />
        </Form.Item>
      );
  }
  return <td {...restProps}>{editing ? inputNode : children}</td>;
};

export default EditableCell;
