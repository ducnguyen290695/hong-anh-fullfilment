import React, { useState } from 'react';
import { Collapse, Menu, Checkbox, DatePicker } from 'antd';
import './index.scss';
import 'styles/custom_component.scss';
import { DATE_FORMAT, DATE_ISO_8601_FORMAT } from 'config/constants';
import useComboCheckbox from 'hooks/useComboCheckbox';
import { parseMomentDate } from 'utils/dateTime';

const FilterBox = ({ onFilter }) => {
  const { Panel } = Collapse;
  const { RangePicker } = DatePicker;

  const defaultCheckedList = {
    type: [],
    source: [],
    walletType: [],
    timeRange: {
      from: null,
      to: null,
    },
  };

  const [checkedList, setCheckedList] = useState({
    type: defaultCheckedList?.type,
    source: defaultCheckedList?.source,
    walletType: defaultCheckedList?.walletType,
    timeRange: defaultCheckedList?.timeRange,
  });

  const typeCheckbox = useComboCheckbox(
    [
      { label: 'Giao dich cộng tiền', value: 'TOP_UP' },
      { label: 'Giao dịch trừ tiền', value: 'PAYMENT' },
    ],
    defaultCheckedList?.type
  );
  const sourceCheckbox = useComboCheckbox(
    [
      { label: 'TK ngân hàng', value: 'BANK_ACCOUNT' },
      { label: 'Ví tiền ảo', value: 'WALLET' },
    ],
    defaultCheckedList?.source
  );
  const walletTypeCheckbox = useComboCheckbox(
    [
      { label: 'Ví cá nhân', value: 'SELLER_PERSONAL' },
      { label: 'Ví công ty', value: 'SELLER_COMPANY' },
    ],
    defaultCheckedList?.walletType
  );

  function onChangeTimeRange(dates, key) {
    let timeRange = {
      from: '',
      to: '',
    };
    if (dates?.length) {
      const newDate = dates.map((date) => date.format(DATE_ISO_8601_FORMAT));
      timeRange = {
        from: newDate[0],
        to: newDate[1],
      };
    } else {
      timeRange = null;
    }
    setCheckedList({
      ...checkedList,
      [`${key}`]: timeRange,
    });
  }

  function resetFilter() {
    setCheckedList(defaultCheckedList);
    typeCheckbox.onResetFilter();
    sourceCheckbox.onResetFilter();
    walletTypeCheckbox.onResetFilter();
    onFilter(defaultCheckedList);
  }

  function applyFilter() {
    const newCheckedList = {
      ...checkedList,
      type: typeCheckbox.checkedList,
      source: sourceCheckbox.checkedList,
      walletType: walletTypeCheckbox.checkedList,
    };
    setCheckedList(newCheckedList);
    onFilter(newCheckedList);
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
        <Panel header="Loại giao dịch" key="type">
          <div className="panel-content">
            <Checkbox
              indeterminate={typeCheckbox.indeterminate}
              onChange={typeCheckbox.onCheckAllChange}
              checked={typeCheckbox.checkAll}
            >
              Tất cả
            </Checkbox>
            <Checkbox.Group
              className="check-box-group"
              onChange={typeCheckbox.onChange}
              value={typeCheckbox.checkedList}
              options={typeCheckbox.options}
            />
          </div>
        </Panel>

        <Panel header="Nguồn tiền" key="source">
          <div className="panel-content">
            <Checkbox
              indeterminate={sourceCheckbox.indeterminate}
              onChange={sourceCheckbox.onCheckAllChange}
              checked={sourceCheckbox.checkAll}
            >
              Tất cả
            </Checkbox>
            <Checkbox.Group
              className="check-box-group"
              onChange={sourceCheckbox.onChange}
              value={sourceCheckbox.checkedList}
              options={sourceCheckbox.options}
            />
          </div>
        </Panel>

        <Panel header="Tài khoản ví" key="walletType">
          <div className="panel-content">
            <Checkbox
              indeterminate={walletTypeCheckbox.indeterminate}
              onChange={walletTypeCheckbox.onCheckAllChange}
              checked={walletTypeCheckbox.checkAll}
            >
              Tất cả
            </Checkbox>
            <Checkbox.Group
              className="check-box-group"
              onChange={walletTypeCheckbox.onChange}
              value={walletTypeCheckbox.checkedList}
              options={walletTypeCheckbox.options}
            />
          </div>
        </Panel>

        <Panel header="Thời gian" key="timeRange">
          <div className="panel-content">
            <RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              format={DATE_FORMAT}
              onChange={(e) => onChangeTimeRange(e, 'timeRange')}
              value={[
                parseMomentDate(checkedList?.timeRange?.from),
                parseMomentDate(checkedList?.timeRange?.to),
              ]}
            />
          </div>
        </Panel>
      </Collapse>
    </Menu>
  );
};

export default FilterBox;
