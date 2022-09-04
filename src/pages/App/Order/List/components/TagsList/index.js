import React from 'react';
import './index.scss';
import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { DATE_FORMAT, STATUS_ORDER } from 'config/constants';
import { useOrder } from 'pages/App/Order/hooks';
import { formatDateTime } from 'utils/dateTime';

const TagCustom = ({ label, filterText, handleOnClose }) => {
  return (
    <Tag closable onClose={handleOnClose}>
      <span className="label">{label}:</span>
      <span>&nbsp;{filterText}</span>
    </Tag>
  );
};

const TagsList = ({ params, setParams, statusOrder, filterTags }) => {
  const { t } = useTranslation();
  const { stockStatusOption } = useOrder();

  const isRenderTag = () => (!statusOrder ? true : false);

  const renderTag = (keyParam, label, isRender = true) => {
    if (isRender && params?.filters?.hasOwnProperty([`${keyParam}`])) {
      const dataFilter = filterTags[`${keyParam}`];

      //Array filter
      if (Array.isArray(filterTags[`${keyParam}`]) && filterTags[`${keyParam}`].length) {
        const text = dataFilter?.map((item) => item.label).join(', ');
        return (
          <TagCustom
            label={label}
            filterText={text}
            handleOnClose={() => handleCloseTag(keyParam)}
          />
        );
      }
      //Single filter
      if (
        !Array.isArray(params?.filters[`${keyParam}`]) &&
        params?.filters[`${keyParam}`] !== undefined
      ) {
        if (keyParam === 'stockStatus') {
          return (
            <TagCustom
              label={label}
              filterText={stockStatusOption.find((item) => item.value === dataFilter)?.label}
              handleOnClose={() => handleCloseTag(keyParam)}
            />
          );
        }
        if (keyParam === 'timeRange') {
          if (dataFilter?.from) {
            if (dataFilter?.to) {
              return (
                <TagCustom
                  label={label}
                  filterText={`${t('order.orderTag.from')} ${formatDateTime(
                    dataFilter?.from,
                    DATE_FORMAT
                  )} ${t('order.orderTag.to')} ${formatDateTime(dataFilter?.to, DATE_FORMAT)}`}
                  handleOnClose={() => handleCloseTag(keyParam)}
                />
              );
            }
            return (
              <TagCustom
                label={label}
                filterText={`${t('common.day')} ${formatDateTime(dataFilter?.from, DATE_FORMAT)}`}
                handleOnClose={() => handleCloseTag(keyParam)}
              />
            );
          } else {
            return null;
          }
        }
        return (
          <TagCustom
            label={label}
            filterText={dataFilter ? t('common.yes') : t('common.no')}
            handleOnClose={() => handleCloseTag(keyParam)}
          />
        );
      }
    } else {
      return null;
    }
  };

  const handleCloseTag = (keyParam) => {
    const cloneParams = { ...params };
    delete cloneParams.filters[`${keyParam}`];
    setParams({ ...cloneParams });
  };

  const allTags = {
    exportedWarehouseIDs: {
      keyParam: 'exportedWarehouseIDs',
      label: t('order.orderTag.exportWarehouse'),
    },
    priorities: {
      keyParam: 'priorities',
      label: t('order.orderTag.priorities'),
    },
    shippingTypes: {
      keyParam: 'shippingTypes',
      label: t('order.orderTag.shippingTypes'),
    },
    paymentMethods: {
      keyParam: 'paymentMethods',
      label: t('order.orderTag.paymentMethods'),
    },
    statuses: {
      keyParam: 'statuses',
      label: t('order.orderTag.statuses'),
      isRender: isRenderTag(),
    },
    fullStockRequired: {
      keyParam: 'fullStockRequired',
      label: t('order.orderTag.fullStockRequired'),
    },
    vat: {
      keyParam: 'vat',
      label: t('order.orderTag.vat'),
    },
    createdByIDs: {
      keyParam: 'createdByIDs',
      label: t('order.orderTag.createdBy'),
    },
    stockStatus: {
      keyParam: 'stockStatus',
      label: t('order.orderTag.stockStatus'),
    },
    timeRange: {
      keyParam: 'timeRange',
      label: t('order.orderTag.timeRange'),
    },
  };

  const {
    exportedWarehouseIDs,
    priorities,
    shippingTypes,
    paymentMethods,
    statuses,
    fullStockRequired,
    vat,
    createdByIDs,
    stockStatus,
    timeRange,
  } = allTags;

  const tagsRender = () => {
    switch (statusOrder) {
      case STATUS_ORDER.ALL:
        return [
          exportedWarehouseIDs,
          priorities,
          shippingTypes,
          paymentMethods,
          statuses,
          createdByIDs,
          timeRange,
        ];
      case STATUS_ORDER.WAITING_FOR_APPROVAL:
        return [
          exportedWarehouseIDs,
          priorities,
          shippingTypes,
          paymentMethods,
          fullStockRequired,
          vat,
          stockStatus,
          timeRange,
        ];
      case STATUS_ORDER.WAITING_FOR_ENOUGH_STOCK:
        return [
          exportedWarehouseIDs,
          priorities,
          fullStockRequired,
          shippingTypes,
          vat,
          paymentMethods,
          createdByIDs,
          stockStatus,
          timeRange,
        ];
      case STATUS_ORDER.WAITING_FOR_PAYMENT:
        return [
          exportedWarehouseIDs,
          priorities,
          fullStockRequired,
          shippingTypes,
          vat,
          paymentMethods,
          createdByIDs,
          stockStatus,
          timeRange,
        ];
      case STATUS_ORDER.WAITING_FOR_EXPORTING:
        return [exportedWarehouseIDs, priorities, shippingTypes, createdByIDs, timeRange];
      case STATUS_ORDER.WAITING_FOR_SHIPPING:
        return [priorities, paymentMethods, createdByIDs, timeRange];
      case STATUS_ORDER.DELIVERING:
        return [priorities, paymentMethods, createdByIDs, timeRange];
      case STATUS_ORDER.COMPLETED:
        return [exportedWarehouseIDs, shippingTypes, vat, createdByIDs, timeRange];
      case STATUS_ORDER.CANCELED:
        return [
          exportedWarehouseIDs,
          priorities,
          fullStockRequired,
          shippingTypes,
          vat,
          paymentMethods,
          createdByIDs,
          stockStatus,
          timeRange,
        ];
      default:
        return [];
    }
  };

  return (
    <div className="tags-list">{tagsRender().map((tag) => renderTag(tag.keyParam, tag.label))}</div>
  );
};

export default TagsList;
