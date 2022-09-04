import React from 'react';
import { useTranslation } from 'react-i18next';
import './index.scss';

const SelectionFilter = ({ selected, onChange, currentActived }) => {
  const { t } = useTranslation();

  function handleSelect(value) {
    onChange && onChange(value);
  }
  return (
    <div className="selection-filter">
      <span
        className={`selection-item ${currentActived === 'all' && 'selection-item-actived'}`}
        onClick={() => handleSelect('all')}
      >
        {t('cart.list.selectionFilter.selectedAll')}
      </span>
      <span
        className={`selection-item ${currentActived === 'selected' && 'selection-item-actived'}`}
        onClick={() => handleSelect('selected')}
      >
        {t('cart.list.selectionFilter.selected')} ({selected || 0})
      </span>
    </div>
  );
};

export default SelectionFilter;
