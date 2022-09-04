import React, { useState } from 'react';
import { Input, Collapse, Menu, Checkbox } from 'antd';
import { FontAwesomeIcon, Icon } from 'assets/icons';
import './index.scss';
import 'styles/custom_component.scss';
import { useGetSellerLevels } from 'hooks/seller';
import { Radio } from 'antd';
import { useWarehouse } from 'hooks/warehouse';
import { NULL } from 'sass';
import { setLogVerbosity } from '@apollo/client';

const FilterBox = ({ onFilter }) => {
  const { Panel } = Collapse;
  const { warehouses } = useWarehouse();
  const { sellerLevels } = useGetSellerLevels();

  const defaultValues = {
    sellerLevelID: null,
    exportedWarehouseID: null,
    isActive: null,
  };
  const [values, setValues] = useState(defaultValues);

  function applyFilter() {
    onFilter(values);
  }

  function getValues(value, key) {
    setValues({
      ...values,
      [`${key}`]: value,
    });
  }

  function resetFilter() {
    setValues(defaultValues);
    onFilter(defaultValues);
  }
  return (
    <Menu className="menu">
      <div className="menu-header">
        <p className="title">Bộ lọc</p>
        <p className="setting">
          <span onClick={resetFilter}>Thiết lập lại</span> <a onClick={applyFilter}>Áp dụng</a>
        </p>
      </div>
      <Collapse accordion defaultActiveKey={['1']} ghost expandIconPosition="right">
        <Panel header="Cấp độ" key="level">
          <div className="panel-content">
            <Radio.Group
              className="radio-group"
              onChange={(e) => getValues(e.target.value, 'sellerLevelID')}
              value={values.sellerLevelID}
            >
              {[
                {
                  id: null,
                  name: 'Tất cả',
                },
              ]
                .concat(sellerLevels || [])
                ?.map(({ id, name }) => (
                  <Radio value={id}>{name}</Radio>
                ))}
            </Radio.Group>
          </div>
        </Panel>

        <Panel header="Kho xuất hàng" key="warehouses">
          <div className="panel-content">
            <Radio.Group
              className="radio-group"
              onChange={(e) => getValues(e.target.value, 'exportedWarehouseID')}
              value={values.exportedWarehouseID}
            >
              {[
                {
                  id: null,
                  name: 'Tất cả',
                },
              ]
                .concat(warehouses || [])
                ?.map(({ id, name }) => (
                  <Radio value={id}>{name}</Radio>
                ))}
            </Radio.Group>
          </div>
        </Panel>

        <Panel header="Trạng thái" key="status">
          <div className="panel-content">
            <Radio.Group
              className="radio-group"
              onChange={(e) => getValues(e.target.value, 'isActive')}
              value={values.isActive}
            >
              <Radio value={null}>Tất cả</Radio>
              <Radio value={true}>Đang hợp tác</Radio>
              <Radio value={false}>Ngưng hợp tác</Radio>
            </Radio.Group>
          </div>
        </Panel>
      </Collapse>
    </Menu>
  );
};

export default FilterBox;
