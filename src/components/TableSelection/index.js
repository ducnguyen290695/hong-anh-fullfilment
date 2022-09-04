import CustomModal from 'components/CustomModal';
import React from 'react';
import { Icon, FontAwesomeIcon } from 'assets/icons';
import { Tooltip } from 'antd';
import './index.scss';

const TableSelection = ({
  modalProps,
  selectedNumber,
  totalSelectedNumber,
  name,
  onSelectAll,
  toggleSelectAll,
  isSelectAll,
}) => {
  return (
    <div className="table-selection">
      <div className="group-btn">
        <Tooltip title={isSelectAll ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}>
          <FontAwesomeIcon
            onClick={toggleSelectAll && toggleSelectAll}
            className={`select-all-btn ${isSelectAll ? 'select-all-btn-active' : ''}`}
            icon={Icon.faCheckSquare}
          />
        </Tooltip>

        <CustomModal {...modalProps} />
      </div>
      <div className="selected-info">
        {selectedNumber} {name} đã được chọn.{' '}
        <span onClick={onSelectAll && onSelectAll}>
          Chọn tất cả {totalSelectedNumber} {name} trong trang này.
        </span>
      </div>
    </div>
  );
};

export default TableSelection;
