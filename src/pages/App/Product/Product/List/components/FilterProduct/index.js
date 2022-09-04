import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox, Input, Menu, Radio, InputNumber } from 'antd';
import { Icon } from 'assets/icons';
import './index.scss';
import useComboCheckbox from 'hooks/useComboCheckbox';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const FilterManufacture = ({ onFilter, dataManufactures }) => {
  const [manufacturers, setManufacturers] = useState([...dataManufactures]);
  const { t } = useTranslation();

  const manufacturersCheckBox = useComboCheckbox(manufacturers);

  function resetFilter() {
    manufacturersCheckBox.onResetFilter();
  }

  function applyFilter() {
    onFilter({ manufacturerIDs: manufacturersCheckBox.checkedList });
  }

  const handleSearchManufacturers = (text) =>
    setManufacturers(
      dataManufactures.filter((item) => item.label.toLowerCase().includes(text.toLowerCase()))
    );

  return (
    <Menu className="menu">
      <div className="menu-header">
        <p className="title">{t('common.filter')}</p>
        <p className="setting">
          <span onClick={resetFilter}>{t('common.reset')}</span>{' '}
          <a onClick={applyFilter}>{t('common.apply')}</a>
        </p>
      </div>
      <div className="panel-content">
        <div className="search-input">
          <Input
            className="custom-input"
            prefix={<FontAwesomeIcon icon={Icon.faSearch} />}
            placeholder={t('product.placeholder.searchFilter')}
            onChange={(e) => handleSearchManufacturers(e.target.value)}
            allowClear={true}
          />
        </div>
        <Checkbox
          className="check-box"
          indeterminate={manufacturersCheckBox.indeterminate}
          checked={manufacturersCheckBox.checkAll}
          onChange={manufacturersCheckBox.onCheckAllChange}
        >
          {t('common.all')}
        </Checkbox>
        <Checkbox.Group
          className="check-box-group"
          options={manufacturersCheckBox.options}
          value={manufacturersCheckBox.checkedList}
          onChange={manufacturersCheckBox.onChange}
        />
      </div>
    </Menu>
  );
};

const FilterLevelPrice = ({ onFilter }) => {
  const defaultValues = { isSpecified: null, from: null, to: null };

  const [isSpecified, setIsSpecified] = useState(defaultValues.isSpecified);
  const [rangeFrom, setRangeFrom] = useState(defaultValues.rangeFrom);
  const [rangeTo, setRangeTo] = useState(defaultValues.rangeTo);
  const { t } = useTranslation();

  const priceRadio = [
    { value: null, label: t('common.all') },
    { value: false, label: t('product.priceRadio.haveNotPrice') },
    { value: true, label: t('product.priceRadio.havePrice') },
  ];

  function resetFilter() {
    setIsSpecified(defaultValues.isSpecified);
    setRangeFrom(defaultValues.rangeFrom);
    setRangeTo(defaultValues.rangeTo);
  }

  function handleSetRange(from, to) {
    if (!from && to) return { to: +to };
    if (from && !to) return { from: +from };
    if (from && to) return { from: +from, to: +to };
    return {};
  }

  function applyFilter() {
    onFilter({
      isSpecified: isSpecified,
      range: handleSetRange(rangeFrom, rangeTo),
    });
  }

  function isDisabledInput(isSpecified) {
    return isSpecified === true || isSpecified === null ? false : true;
  }

  useEffect(() => {
    if (isDisabledInput(isSpecified)) {
      setRangeFrom(null);
      setRangeTo(null);
    }
  }, [isSpecified]);

  return (
    <Menu className="menu">
      <div className="menu-header">
        <p className="title">{t('common.filter')}</p>
        <p className="setting">
          <span onClick={resetFilter}>{t('common.reset')}</span>{' '}
          <a onClick={applyFilter}>{t('common.apply')}</a>
        </p>
      </div>
      <div className="panel-content">
        <Radio.Group
          className="radio-group"
          onChange={(e) => setIsSpecified(e.target.value)}
          value={isSpecified}
        >
          {priceRadio.map(({ value, label }, index) => (
            <Radio value={value} key={index}>
              {label}
            </Radio>
          ))}
        </Radio.Group>
        <div className="input-range">
          {t('product.inputRange.from')}&nbsp;
          <Input
            onChange={(e) => setRangeFrom(e.target.value)}
            value={rangeFrom}
            disabled={isDisabledInput(isSpecified)}
          />
          &nbsp;-&nbsp;
          <Input
            onChange={(e) => setRangeTo(e.target.value)}
            value={rangeTo}
            disabled={isDisabledInput(isSpecified)}
          />
        </div>
      </div>
    </Menu>
  );
};

const FilterRealStocks = ({ onFilter, warehouseID }) => {
  const [rangeFrom, setRangeFrom] = useState(null);
  const [rangeTo, setRangeTo] = useState(null);
  const { t } = useTranslation();
  function resetFilter() {
    setRangeFrom(null);
    setRangeTo(null);
  }

  const handleChangeRange = (inputValue, setRange) => {
    if (inputValue > 0) {
      setRange(inputValue);
    }
  };

  function handleSetRange(from, to) {
    if (!from && to) return { to: +to };
    if (from && !to) return { from: +from };
    return { from: +from, to: +to };
  }

  function applyFilter() {
    if (rangeFrom === null && rangeTo === null) {
      onFilter({
        warehouseID: warehouseID,
      });
    } else {
      onFilter({
        warehouseID: warehouseID,
        range: handleSetRange(rangeFrom, rangeTo),
      });
    }
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
      <div className="panel-content">
        <form className="input-range">
          {t('product.inputRange.from')}&nbsp;&nbsp;
          <InputNumber
            className="input-range-number"
            controls={false}
            value={rangeFrom}
            onBlur={(e) => handleChangeRange(e.target.value, setRangeFrom)}
            onPressEnter={(e) => handleChangeRange(e.target.value, setRangeFrom)}
          />
          &nbsp;-&nbsp;
          <InputNumber
            className="input-range-number"
            controls={false}
            value={rangeTo}
            onBlur={(e) => handleChangeRange(e.target.value, setRangeTo)}
            onPressEnter={(e) => handleChangeRange(e.target.value, setRangeTo)}
          />
        </form>
      </div>
    </Menu>
  );
};

const FilterVAT = ({ onFilter }) => {
  const { t } = useTranslation();

  const vatCheckbox = useComboCheckbox([
    { label: t('product.vatCheckbox.yes'), value: true },
    { label: t('product.vatCheckbox.no'), value: false },
  ]);

  function resetFilter() {
    vatCheckbox.onResetFilter();
  }

  function applyFilter() {
    onFilter({
      vat:
        vatCheckbox.checkedList === undefined || vatCheckbox.checkedList.length === 2
          ? null
          : vatCheckbox.checkedList[0],
    });
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
      <div className="panel-content">
        <Checkbox
          className="check-box"
          indeterminate={vatCheckbox.indeterminate}
          checked={vatCheckbox.checkAll}
          onChange={vatCheckbox.onCheckAllChange}
        >
          {t('common.all')}
        </Checkbox>
        <Checkbox.Group
          className="check-box-group"
          options={vatCheckbox.options}
          value={vatCheckbox.checkedList}
          onChange={vatCheckbox.onChange}
        />
      </div>
    </Menu>
  );
};

export { FilterManufacture, FilterLevelPrice, FilterRealStocks, FilterVAT };
