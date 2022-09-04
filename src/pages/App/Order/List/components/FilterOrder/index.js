import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './index.scss';
import CustomTable from 'components/CustomTable';
import { map } from 'lodash';

const FilterOrder = ({
  options,
  keyObj,
  onFilter,
  pagination,
  param,
  setParam,
  filterTags,
  typeSelection = 'checkbox',
}) => {
  const { t } = useTranslation();
  const [selectedRows, setSelectedRows] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState();

  const columns = [{ dataIndex: 'label' }];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    },
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectedRowKeys,
    type: typeSelection,
  };

  const handleOnChange = (pagination) => {
    const { current, pageSize } = pagination;
    setParam({
      ...param,
      pagination: { ...param.pagination, offset: (current - 1) * pageSize },
    });
  };

  const resetFilter = () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
  };

  const applyFilter = () => {
    if (keyObj === 'stockStatus') {
      onFilter({ [`${keyObj}`]: selectedRowKeys[0] });
    } else {
      if (keyObj === 'vat' || keyObj === 'fullStockRequired') {
        if (selectedRowKeys === undefined || selectedRowKeys.length === 2) {
          onFilter({ [`${keyObj}`]: undefined });
          // const cloneFilterTags = { ...filterTags };
          // delete cloneFilterTags[`${keyObj}`];
        } else {
          onFilter({ [`${keyObj}`]: selectedRowKeys[0] });
        }
      } else {
        onFilter({ [`${keyObj}`]: selectedRowKeys });
      }
    }
  };

  useEffect(() => {
    //init selected
    const selected = filterTags[`${keyObj}`];
    setSelectedRows(selected);
    if (selected) {
      if (Array.isArray(selected)) {
        setSelectedRowKeys(map(selected, 'value'));
      } else {
        setSelectedRowKeys([selected]);
      }
    }
  }, []);

  return (
    <menu className="menu">
      <div
        className="menu-header"
        style={{ backgroundColor: '#ffffff', borderRadius: '8px 8px 0px 0px' }}
      >
        <p className="title">{t('common.filter')}</p>
        <p className="setting">
          <span onClick={resetFilter}>{t('common.reset')}</span>{' '}
          <a onClick={applyFilter}>{t('common.apply')}</a>
        </p>
      </div>
      <div className="panel-content">
        <CustomTable
          className="table-filter"
          dataSource={options}
          columns={columns}
          pagination={pagination}
          showHeader={false}
          rowSelection={{
            ...rowSelection,
          }}
          rowKey={(record) => record.value}
          onChange={handleOnChange}
        />
      </div>
    </menu>
  );
};

export default FilterOrder;
