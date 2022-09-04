import React, { useState } from 'react';
import { Collapse, Menu, Radio, Checkbox } from 'antd';
import './index.scss';
import 'styles/custom_component.scss';
import { useWarehouse } from 'hooks/warehouse';
import { useGetSellerLevels } from 'hooks/seller';
import { useTranslation } from 'react-i18next';
import useComboCheckbox from 'hooks/useComboCheckbox';

const FilterMenu = ({ onFilter }) => {
  const { Panel } = Collapse;
  const { warehouses } = useWarehouse();
  const { sellerLevels } = useGetSellerLevels();
  const { t } = useTranslation();

  const defaultValue = {
    sellerLevelID: null,
    exportedWarehouseIDs: [],
    isActive: null,
  };

  const [values, setValues] = useState(defaultValue);

  const warehouseCheckbox = useComboCheckbox(
    warehouses?.map((warehouse) => ({ label: warehouse.name, value: warehouse.id })),
    []
  );

  function applyFilter() {
    const newValue = {
      ...values,
      exportedWarehouseIDs: warehouseCheckbox.checkedList,
    };
    onFilter(newValue);
  }

  function getValues(value, key) {
    setValues({
      ...values,
      [`${key}`]: value,
    });
  }

  function resetFilter() {
    setValues(defaultValue);
    onFilter(defaultValue);
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
        <Panel header={t('accountant.level')} key="level">
          <div className="panel-content">
            <Radio.Group
              className="radio-group"
              onChange={(e) => getValues(e.target.value, 'sellerLevelID')}
              value={values.sellerLevelID}
            >
              {[
                {
                  id: null,
                  name: t('common.all'),
                },
              ]
                .concat(sellerLevels || [])
                ?.map(({ id, name }) => (
                  <Radio value={id}>{name}</Radio>
                ))}
            </Radio.Group>
          </div>
        </Panel>

        <Panel header={t('accountant.warehouse')} key="warehouses">
          <div className="panel-content">
            <Checkbox
              indeterminate={warehouseCheckbox.indeterminate}
              onChange={warehouseCheckbox.onCheckAllChange}
              checked={warehouseCheckbox.checkAll}
            >
              {t('common.all')}
            </Checkbox>
            <Checkbox.Group
              className="check-box-group"
              onChange={warehouseCheckbox.onChange}
              value={warehouseCheckbox.checkedList}
              options={warehouseCheckbox.options}
            />
          </div>
        </Panel>

        <Panel header={t('accountant.status')} key="status">
          <div className="panel-content">
            <Radio.Group
              className="radio-group"
              onChange={(e) => getValues(e.target.value, 'isActive')}
              value={values.isActive}
            >
              <Radio value={null}>{t('common.all')}</Radio>
              <Radio value={true}>{t('accountant.cooperate')}</Radio>
              <Radio value={false}>{t('accountant.stopCooperate')}</Radio>
            </Radio.Group>
          </div>
        </Panel>
      </Collapse>
    </Menu>
  );
};

export default FilterMenu;
