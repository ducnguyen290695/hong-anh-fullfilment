import React, { useState } from 'react';
import { Collapse, Menu } from 'antd';
import { Radio } from 'antd';
import './index.scss';
import 'styles/custom_component.scss';
import { useTranslation } from 'react-i18next';

const ACCOUNT_STATUS = {
  ACTIVE: 'ACTIVE',
  DISABLED: 'DISABLED',
};

const FilterBox = ({ onFilter }) => {
  const { Panel } = Collapse;
  const { t } = useTranslation();

  const defaultValues = {
    status: null,
  };
  const [values, setValues] = useState(defaultValues);

  function applyFilter() {
    onFilter && onFilter(values);
  }

  function getValues(value, key) {
    setValues({
      ...values,
      [`${key}`]: value,
    });
  }

  function resetFilter() {
    setValues(defaultValues);
    onFilter && onFilter(defaultValues);
  }
  return (
    <Menu className="menu">
      <div className="menu-header">
        <p className="title">{t('common.filter')}</p>
        <p className="setting">
          <span onClick={resetFilter}>{t('common.reset')}</span>{' '}
          <a onClick={applyFilter}>{t('common.apply')}</a>
        </p>
      </div>
      <Collapse accordion defaultActiveKey={['1']} ghost expandIconPosition="right">
        <Panel header={t('accountant.status')} key="status">
          <div className="panel-content">
            <Radio.Group
              className="radio-group"
              onChange={(e) => getValues(e.target.value, 'status')}
              value={values.status}
            >
              <Radio value={null}>{t('common.all')}</Radio>
              <Radio value={ACCOUNT_STATUS.ACTIVE}>{t('accountant.active')}</Radio>
              <Radio value={ACCOUNT_STATUS.DISABLED}>{t('accountant.inactive')}</Radio>
            </Radio.Group>
          </div>
        </Panel>
      </Collapse>
    </Menu>
  );
};

export default FilterBox;
