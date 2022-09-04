import React from 'react';
import { Table } from 'antd';
import './index.scss';

const CustomTable = ({ pagination, dataSource, ...rest }) => {
  return (
    <div className="custom-table">
      <Table
        dataSource={dataSource}
        pagination={pagination ? { ...pagination, responsive: true } : false}
        size="middle"
        {...rest}
      />
      {pagination && dataSource?.length > 0 && (
        <div className="left-footer">
          Hiển thị {(pagination?.current - 1) * 10 + 1} -{' '}
          {(pagination?.current - 1) * 10 + dataSource?.length} của {pagination?.total} (
          {Math.ceil(pagination?.total / pagination?.pageSize)} trang)
        </div>
      )}
    </div>
  );
};

export default CustomTable;
