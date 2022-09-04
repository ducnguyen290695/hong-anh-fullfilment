import React from 'react';
import './index.scss';
import { Tag } from 'antd';
import { find, reject } from 'lodash';
import { useTranslation } from 'react-i18next';

const TagCustom = ({ label, filterText, handleOnClose }) => {
  return (
    <Tag closable onClose={handleOnClose}>
      <span className="label">{label}:</span>
      <span>&nbsp;{filterText}</span>
    </Tag>
  );
};

const TagsList = ({ listFilter, dataManufactures, dataWarehouses, params, setParams }) => {
  const { t } = useTranslation();

  const pricesLevelList = [
    {
      label: t('product.priceLevel1'),
      key: 'priceLevel1',
    },
    {
      label: t('product.priceLevel2'),
      key: 'priceLevel2',
    },
    {
      label: t('product.priceLevel3'),
      key: 'priceLevel3',
    },
    {
      label: t('product.priceLevel4'),
      key: 'priceLevel4',
    },
  ];

  const renderTagNameManufactures = (key) => {
    if (listFilter.hasOwnProperty(key) && listFilter[`${key}`]) {
      const manufacturersList = listFilter[`${key}`]
        .map((item) => find(dataManufactures, { value: item }))
        .map((item) => item?.label)
        .join(',');
      return (
        <TagCustom
          label={t('product.manufactures')}
          filterText={manufacturersList}
          handleOnClose={() => handleOnCloseTagPriceManufacturesVat(key)}
        />
      );
    } else {
      return null;
    }
  };

  const renderTagPriceLevel = (label, key) => {
    if (listFilter.hasOwnProperty([`${key}`])) {
      const renderFilterText = () => {
        if (listFilter[`${key}`].isSpecified === false) {
          return t('product.haveNotPrice');
        } else {
          if (listFilter[`${key}`].range.from && !listFilter[`${key}`].range.to) {
            return `>=${listFilter[`${key}`].range.from}`;
          }
          if (!listFilter[`${key}`].range.from && listFilter[`${key}`].range.to) {
            return `<=${listFilter[`${key}`].range.to}`;
          }

          if (listFilter[`${key}`].range.to && listFilter[`${key}`].range.from) {
            return `${listFilter[`${key}`].range.from} - ${listFilter[`${key}`].range.to}`;
          } else {
            return t('product.havePrice');
          }
        }
      };
      return listFilter[`${key}`].isSpecified === null ? (
        ''
      ) : (
        <TagCustom
          label={label}
          filterText={renderFilterText()}
          handleOnClose={() => handleOnCloseTagPriceManufacturesVat(key)}
        />
      );
    }
  };

  const renderTagRealStocks = (key) => {
    if (listFilter.hasOwnProperty([`${key}`])) {
      const listWarehouse = listFilter[`${key}`].map((item) =>
        find(dataWarehouses, { id: item.warehouseID })
      );

      const renderRealStocks = (from, to) => {
        if (!from && to) {
          return `<=${to}`;
        }

        if (from && to) {
          return `${from} - ${to}`;
        }
        return `>=${from}`;
      };

      return listFilter[`${key}`].map((item, index) => (
        <TagCustom
          key={item.warehouseID}
          label={`${t('product.realStock')}(${listWarehouse[index]?.code})`}
          filterText={renderRealStocks(item?.range?.from, item?.range?.to)}
          handleOnClose={() => handleOnCloseTagWarehouses(item.warehouseID, key)}
        />
      ));
    } else {
      return null;
    }
  };

  const renderTagVat = (key) => {
    if (
      listFilter.hasOwnProperty([`${key}`]) &&
      listFilter[`${key}`] !== null &&
      listFilter[`${key}`] !== undefined
    ) {
      return (
        <TagCustom
          label={t('product.exportVat')}
          filterText={listFilter[`${key}`] ? 'ON' : 'OFF'}
          handleOnClose={() => handleOnCloseTagPriceManufacturesVat(key)}
        />
      );
    } else {
      return null;
    }
  };

  const handleOnCloseTagPriceManufacturesVat = (key) => {
    const cloneParams = { ...params };
    delete cloneParams.filters[`${key}`];
    setParams({ ...cloneParams });
  };

  const handleOnCloseTagWarehouses = (idWarehouses, key) => {
    const cloneParams = { ...params };
    //array real stock after delete item tag
    const arrayRealStocks = reject(
      cloneParams.filters[`${key}`],
      (item) => item.warehouseID === idWarehouses
    );
    //new params after delete item tag
    const newParams = {
      ...cloneParams,
      filters: { ...cloneParams.filters, [`${key}`]: [...arrayRealStocks] },
    };
    setParams({ ...newParams });
  };

  return (
    <div className="tags-list">
      {/* Tag NSX */}
      {renderTagNameManufactures('manufacturerIDs')}
      {/* Tag giá cấp */}
      {pricesLevelList.map(({ label, key }) => renderTagPriceLevel(label, key))}
      {/* Tồn kho */}
      {renderTagRealStocks('realStocks')}
      {/* vat */}
      {renderTagVat('vat')}
    </div>
  );
};

export default TagsList;
