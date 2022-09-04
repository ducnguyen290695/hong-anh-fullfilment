import { DatePicker, Form, Input, InputNumber, Select, Checkbox, Radio, TimePicker } from 'antd';
import StateSwitch from 'components/StateSwitch';
import { INPUT_TYPE } from 'config/constants';
import React from 'react';

const FormInput = (props) => {
  const { type, formItemOptions, inputOptions, inputChildren } = props;

  const renderInput = (type) => {
    switch (type) {
      case INPUT_TYPE.TEXT_AREA:
        return <Input.TextArea {...inputOptions} />;
      case INPUT_TYPE.NUMBER:
        return <InputNumber {...inputOptions} />;
      case INPUT_TYPE.SELECT:
        return <Select {...inputOptions}>{inputChildren}</Select>;
      case INPUT_TYPE.DATE_PICKER:
        return <DatePicker {...inputOptions} />;
      case INPUT_TYPE.PASSWORD:
        return <Input.Password {...inputOptions} />;
      case INPUT_TYPE.CHECK_BOX:
        return <Checkbox {...inputOptions}>{inputChildren}</Checkbox>;
      case INPUT_TYPE.RADIO_GROUP:
        return <Radio.Group {...inputOptions}>{inputChildren}</Radio.Group>;
      case INPUT_TYPE.TIME_PICKER:
        return <TimePicker {...inputOptions} />;
      case INPUT_TYPE.SWITCH:
        return <StateSwitch {...inputOptions} />;
      default:
        return <Input {...inputOptions} />;
    }
  };

  return <Form.Item {...formItemOptions}>{renderInput(type)}</Form.Item>;
};

export default FormInput;
