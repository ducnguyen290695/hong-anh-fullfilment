import FormInput from 'components/FormInput';
import { useTranslation } from 'react-i18next';
import React from 'react';
import './index.scss';
import { INPUT_TYPE, REGEX, SHIPPING_TYPE } from 'config/constants';
import { validator } from 'utils/helperFuncs';
import { formatCurrency } from 'utils/helperFuncs';

const CustomFormDeliveryMethod = ({
  method,
  onFormChange,
  isDisabledShippingUnit = true,
  shippingProvider,
  isEditShippingFee,
  fee,
}) => {
  const { t } = useTranslation();

  const renderFormDeliveryMethod = () => {
    switch (method) {
      case SHIPPING_TYPE.BUS:
        return (
          <div className="form-vertical info-method">
            <FormInput
              formItemOptions={{
                label: `${t('cart.list.deliveryMethods.infoMethod.formBus.nameGarage.label')}`,
                name: ['shippingConfig', 'busConfig', 'busName'],
                validateTrigger: ['onSubmit', 'onChange'],
                rules: [{ message: t('cart.validateMessage.busName'), required: true }],
              }}
              inputOptions={{
                placeholder: t(
                  'cart.list.deliveryMethods.infoMethod.formBus.nameGarage.placeholder'
                ),
                onBlur: onFormChange,
                maxLength: 50,
              }}
            />
            <FormInput
              formItemOptions={{
                label: `${t('cart.list.deliveryMethods.infoMethod.formBus.phoneNumber.label')}`,
                name: ['shippingConfig', 'busConfig', 'telephone'],
                validateTrigger: ['onSubmit', 'onChange'],
                rules: [
                  { message: t('cart.validateMessage.busPhoneNumber'), required: true },
                  validator({
                    type: 'phone',
                  }),
                ],
              }}
              inputOptions={{
                placeholder: t(
                  'cart.list.deliveryMethods.infoMethod.formBus.phoneNumber.placeholder'
                ),
                onBlur: onFormChange,
                maxLength: 10,
              }}
            />
            <FormInput
              formItemOptions={{
                label: `${t('cart.list.deliveryMethods.infoMethod.formBus.parkedAt.label')}`,
                name: ['shippingConfig', 'busConfig', 'location'],
              }}
              inputOptions={{
                placeholder: t('cart.list.deliveryMethods.infoMethod.formBus.parkedAt.placeholder'),
                onBlur: onFormChange,
                maxLength: 50,
              }}
            />
            <FormInput
              formItemOptions={{
                label: `${t('cart.list.deliveryMethods.infoMethod.formBus.station.label')}`,
                name: ['shippingConfig', 'busConfig', 'busStation'],
              }}
              inputOptions={{
                placeholder: t('cart.list.deliveryMethods.infoMethod.formBus.station.placeholder'),
                onBlur: onFormChange,
                maxLength: 50,
              }}
            />
            <FormInput
              type={INPUT_TYPE.NUMBER}
              formItemOptions={{
                className: 'input-fee',
                label: t('cart.list.deliveryMethods.infoMethod.formBus.feeShipping.label'),
                name: ['shippingConfig', 'busConfig', 'fee'],
                validateTrigger: ['onSubmit', 'onChange'],
                rules: [{ message: t('cart.validateMessage.busFee'), required: true }],
              }}
              inputOptions={{
                placeholder: t(
                  'cart.list.deliveryMethods.infoMethod.formBus.feeShipping.placeholder'
                ),
                onBlur: onFormChange,
                maxLength: 50,
                formatter: (value) => value.replace(REGEX.CURRENCY, '.'),
                parser: (value) => value.replace(REGEX.CURRENCY_PARSER, ''),
                controls: false,
              }}
            />
          </div>
        );
      case SHIPPING_TYPE.DELIVER_3PARTY:
        return (
          <div className="form-vertical info-method">
            <FormInput
              type={INPUT_TYPE.NUMBER}
              formItemOptions={{
                className: 'input-measurement',
                label: `${t(
                  'cart.list.deliveryMethods.infoMethod.formDeliver3Party.weight.label'
                )}`,
                name: ['shippingConfig', 'deliver3PartyConfig', 'weight'],
                validateTrigger: ['onSubmit', 'onChange'],
                rules: [{ message: t('cart.validateMessage.deliveryWeight'), required: true }],
              }}
              inputOptions={{
                placeholder: t(
                  'cart.list.deliveryMethods.infoMethod.formDeliver3Party.weight.placeholder'
                ),
                onBlur: onFormChange,
                controls: false,
              }}
            />
            <FormInput
              type={INPUT_TYPE.NUMBER}
              formItemOptions={{
                className: 'input-measurement',
                label: `${t(
                  'cart.list.deliveryMethods.infoMethod.formDeliver3Party.length.label'
                )}`,
                name: ['shippingConfig', 'deliver3PartyConfig', 'length'],
                validateTrigger: ['onSubmit', 'onChange'],
                rules: [{ message: t('cart.validateMessage.deliveryLength'), required: true }],
              }}
              inputOptions={{
                placeholder: t(
                  'cart.list.deliveryMethods.infoMethod.formDeliver3Party.length.placeholder'
                ),
                onBlur: onFormChange,
                controls: false,
              }}
            />
            <FormInput
              type={INPUT_TYPE.NUMBER}
              formItemOptions={{
                className: 'input-measurement',
                label: `${t('cart.list.deliveryMethods.infoMethod.formDeliver3Party.width.label')}`,
                name: ['shippingConfig', 'deliver3PartyConfig', 'width'],
                validateTrigger: ['onSubmit', 'onChange'],
                rules: [{ message: t('cart.validateMessage.deliveryWidth'), required: true }],
              }}
              inputOptions={{
                placeholder: t(
                  'cart.list.deliveryMethods.infoMethod.formDeliver3Party.width.placeholder'
                ),
                onBlur: onFormChange,
                controls: false,
              }}
            />
            <FormInput
              type={INPUT_TYPE.NUMBER}
              formItemOptions={{
                className: 'input-measurement',
                label: `${t(
                  'cart.list.deliveryMethods.infoMethod.formDeliver3Party.height.label'
                )}`,
                name: ['shippingConfig', 'deliver3PartyConfig', 'height'],
                validateTrigger: ['onSubmit', 'onChange'],
                rules: [{ message: t('cart.validateMessage.deliveryHeight'), required: true }],
              }}
              inputOptions={{
                placeholder: t(
                  'cart.list.deliveryMethods.infoMethod.formDeliver3Party.height.placeholder'
                ),
                onBlur: onFormChange,
                controls: false,
              }}
            />
            <FormInput
              type="SELECT"
              formItemOptions={{
                label: `${t(
                  'cart.list.deliveryMethods.infoMethod.formDeliver3Party.shippingUnit.label'
                )}`,
                name: ['shippingConfig', 'deliver3PartyConfig', 'id'],
                style: { width: '48.3%' },
                validateTrigger: ['onSubmit', 'onChange'],
                rules: [
                  { message: t('cart.validateMessage.deliveryShippingUnit'), required: true },
                ],
              }}
              inputOptions={{
                placeholder: t(
                  'cart.list.deliveryMethods.infoMethod.formDeliver3Party.shippingUnit.placeholder'
                ),
                onChange: onFormChange,
                disabled: isDisabledShippingUnit,
                options: shippingProvider.map((item) => ({
                  label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        {item?.hasOwnProperty('serviceName') ? (
                          <>
                            {item?.name} - {item?.serviceName}
                          </>
                        ) : (
                          item?.name
                        )}
                      </div>
                      <div>
                        <b>
                          {t(
                            'cart.list.deliveryMethods.infoMethod.formDeliver3Party.shippingUnit.serviceFee'
                          )}
                          :{' '}
                        </b>{' '}
                        {item.hasOwnProperty('fee')
                          ? formatCurrency(item?.fee)
                          : t('cart.validateMessage.notSupportShippingProvider')}
                      </div>
                    </div>
                  ),
                  value: item.id,
                })),
              }}
            />
            <div className="edit-shipping-fee">
              <FormInput
                type="SWITCH"
                formItemOptions={{
                  className: 'switch',
                  label: t(
                    'cart.list.deliveryMethods.infoMethod.formDeliver3Party.shippingUnit.editFeeShipping'
                  ),
                  name: ['shippingConfig', 'deliver3PartyConfig', 'customFeeEnabled'],
                  valuePropName: 'checked',
                  validateTrigger: ['onSubmit', 'onChange'],
                }}
                inputOptions={{
                  onChange: onFormChange,
                }}
              />
              {isEditShippingFee ? (
                <FormInput
                  type={INPUT_TYPE.NUMBER}
                  formItemOptions={{
                    className: 'input-measurement',
                    label: t(
                      'cart.list.deliveryMethods.infoMethod.formDeliver3Party.shippingUnit.serviceFee'
                    ),
                    name: ['shippingConfig', 'deliver3PartyConfig', 'customFee'],
                  }}
                  inputOptions={{
                    onBlur: onFormChange,
                    controls: false,
                    maxLength: 50,
                    formatter: (value) => value.replace(REGEX.CURRENCY, '.'),
                    parser: (value) => value.replace(REGEX.CURRENCY_PARSER, ''),
                  }}
                />
              ) : (
                <>
                  <p style={{ fontWeight: 600, margin: '9px 0 0 0 ' }}>
                    {t(
                      'cart.list.deliveryMethods.infoMethod.formDeliver3Party.shippingUnit.serviceFee'
                    )}
                    :&nbsp;&nbsp;&nbsp;&nbsp;
                    {fee
                      ? formatCurrency(fee)
                      : t('cart.validateMessage.notSupportShippingProvider')}
                  </p>
                </>
              )}
            </div>
          </div>
        );
      case SHIPPING_TYPE.PICK_UP_COUNTER:
        return <></>;
      case SHIPPING_TYPE.URBAN_COD:
        return (
          <div className="form-vertical info-method">
            <FormInput
              type={INPUT_TYPE.NUMBER}
              formItemOptions={{
                className: 'input-fee',
                label: `${t(
                  'cart.list.deliveryMethods.infoMethod.formUrbanCOD.feeShipping.label'
                )}`,
                name: ['shippingConfig', 'urbanCODConfig', 'fee'],
                validateTrigger: ['onSubmit', 'onChange'],
                rules: [
                  {
                    message: t('cart.validateMessage.urbanCODFee'),
                    required: true,
                  },
                ],
              }}
              inputOptions={{
                placeholder: t(
                  'cart.list.deliveryMethods.infoMethod.formUrbanCOD.feeShipping.placeholder'
                ),
                onBlur: onFormChange,
                formatter: (value) => value.replace(REGEX.CURRENCY, '.'),
                parser: (value) => value.replace(REGEX.CURRENCY_PARSER, ''),
                controls: false,
              }}
            />
          </div>
        );
      default:
        return <></>;
    }
  };
  return renderFormDeliveryMethod();
};

export default CustomFormDeliveryMethod;
