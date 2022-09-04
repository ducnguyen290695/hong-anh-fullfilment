import { Icon, SvgIcon, FontAwesomeIcon } from 'assets/icons';
import {
  STOCK_STATUS,
  PAYMENT_METHOD,
  PRIORITY_LEVEL,
  SHIPPING_TYPE,
  STATUS_ORDER,
} from 'config/constants';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FilterOrder from '../FilterOrder';
import { Dropdown } from 'antd';
import { useGetWarehouses, useGetCreatedBy, useOrderPermissions } from 'hooks/order';
import { formatCurrency } from 'utils/helperFuncs';
import { decimalTimeToTimeString } from 'utils/dateTime';
import { useOrder } from 'pages/App/Order/hooks';
import SuccessDeliveryButton from '../SuccessDeliveryButton';

const useColumnsOrder = (params, setParams, filterTags, setFilterTags) => {
  const { t } = useTranslation();
  const [paginationCreatedBy, setPaginationCreatedBy] = useState({
    pagination: { offset: 0, limit: 10 },
  });
  const { data: warehousesOptions } = useGetWarehouses();
  const { data: createdByOptions, paginationData: paginationDataCreatedBy } =
    useGetCreatedBy(paginationCreatedBy);
  const {
    orderPriorityOptions,
    shippingOptions,
    paymentMethodOptions,
    statusOptions,
    fullStockRequiredOption,
    vatOption,
  } = useOrder();

  const { canCompleteOrder } = useOrderPermissions();

  const isInStockOption = [
    { value: STOCK_STATUS.FULL, label: t('common.full') },
    { value: STOCK_STATUS.LACK, label: t('common.lack') },
    { value: STOCK_STATUS.OUT_OF_STOCK, label: t('common.outOfStock') },
  ];

  const renderOrderPriority = (priorityLevel) => {
    switch (priorityLevel) {
      case PRIORITY_LEVEL.LOW:
        return <p>{t('order.orderList.low')}</p>;
      case PRIORITY_LEVEL.MEDIUM:
        return <p className="priority-medium">{t('order.orderList.medium')}</p>;
      case PRIORITY_LEVEL.HIGH:
        return <p className="priority-high">{t('order.orderList.high')}</p>;
    }
  };

  const renderShippingMethod = (method) => {
    switch (method) {
      case SHIPPING_TYPE.BUS:
        return t('order.orderList.bus');
      case SHIPPING_TYPE.DELIVER_3PARTY:
        return t('order.orderList.deliver3Party');
      case SHIPPING_TYPE.PICK_UP_COUNTER:
        return t('order.orderList.pickUpCounter');
      case SHIPPING_TYPE.URBAN_COD:
        return t('order.orderList.urbanCOD');
    }
  };

  const renderPaymentMethod = (method) => {
    switch (method) {
      case PAYMENT_METHOD.Cash:
        return t('order.orderList.cash');
      case PAYMENT_METHOD.CashAndDebt:
        return t('order.orderList.cashAndDebit');
      case PAYMENT_METHOD.COD:
        return t('order.orderList.COD');
      case PAYMENT_METHOD.Debt:
        return t('order.orderList.debt');
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case STATUS_ORDER.WAITING_FOR_APPROVAL:
        return t('order.orderStatus.waitingForApproval');
      case STATUS_ORDER.WAITING_FOR_ENOUGH_STOCK:
        return t('order.orderStatus.waitingForEnoughStock');
      case STATUS_ORDER.WAITING_FOR_PAYMENT:
        return t('order.orderStatus.waitingForPayment');
      case STATUS_ORDER.WAITING_FOR_EXPORTING:
        return t('order.orderStatus.waitingForExporting');
      case STATUS_ORDER.WAITING_FOR_SHIPPING:
        return t('order.orderStatus.waitingForDelivery');
      case STATUS_ORDER.DELIVERING:
        return t('order.orderStatus.delivering');
      case STATUS_ORDER.COMPLETED:
        return <div className="order-completed">{t('order.orderStatus.completed')}</div>;
      case STATUS_ORDER.CANCELED:
        return <div className="order-cancel">{t('order.orderStatus.cancel')}</div>;
    }
  };

  const renderVATAndFullStockRequired = (value) => {
    switch (value) {
      case true:
        return <SvgIcon.SuccessIcon />;
      case false:
        return <SvgIcon.ErrorIcon />;
    }
  };

  const renderRemainingDeliverTime = (time) => {
    if (time < 24 && time > 0) {
      return <div className="yellow-remaining-deliver-time">{decimalTimeToTimeString(time)}</div>;
    }
    if (time <= 0) {
      return <div className="red-remaining-deliver-time">- {decimalTimeToTimeString(time)}</div>;
    }
    return <div className="green-remaining-deliver-time">{decimalTimeToTimeString(time)}</div>;
  };

  const renderStockStatus = (value) => {
    switch (value) {
      case STOCK_STATUS.FULL:
        return <div>{t('common.full')}</div>;
      case STOCK_STATUS.LACK:
        return <div className="yellow-stock-status">{t('common.lack')}</div>;
      case STOCK_STATUS.OUT_OF_STOCK:
        return <div className="red-stock-status">{t('common.outOfStock')}</div>;
    }
  };

  const onFilter = (value) => {
    const newParams = { ...params, filters: { ...params.filters, ...value } };
    setParams(newParams);
  };

  const renderDropdownFilter = (
    options,
    keyObj,
    typeSelection = 'checkbox',
    params,
    setParams,
    paginationData = undefined
  ) => {
    return (
      <Dropdown
        overlayClassName="dropdown-overlay"
        trigger="click"
        overlay={
          <FilterOrder
            options={options}
            keyObj={keyObj}
            onFilter={onFilter}
            pagination={paginationData}
            param={params}
            setParam={setParams}
            filterTags={filterTags}
            setFilterTags={setFilterTags}
            typeSelection={typeSelection}
          />
        }
        placement="bottomRight"
      >
        <FontAwesomeIcon icon={Icon.faFilter} />
      </Dropdown>
    );
  };

  const handleSort = (by) => {
    //check sort have orderType is ASC or DESC
    if (params.sort[0]?.orderType === 'ASC') {
      const newParams = {
        ...params,
        sort: [{ by: by, orderType: 'DESC' }],
      };
      setParams(newParams);
    } else {
      const newParams = {
        ...params,
        sort: [{ by: by, orderType: 'ASC' }],
      };
      setParams(newParams);
    }
  };

  const all = {
    index: {
      title: t('order.orderList.index'),
      render: (text, record, index) => index + 1,
      width: 50,
      fixed: true,
    },
    createdAt: {
      title: (
        <div className="title-table">
          {t('order.orderList.createdAt')}
          <SvgIcon.SortIcon onClick={() => handleSort('CREATED_AT')} />
        </div>
      ),
      dataIndex: 'createdAt',
      fixed: true,
      width: 110,
    },
    orderCode: {
      title: t('order.orderList.orderCode'),
      dataIndex: 'number',
      render: (text, record, index) => {
        return (
          <Link to={`/order/${record?.id}`}>
            <b>{text}</b>
          </Link>
        );
      },
      fixed: true,
      width: 150,
    },
    subTotal: {
      title: (
        <div className="title-table">
          {t('order.orderList.totalOrder')}
          <SvgIcon.SortIcon onClick={() => handleSort('GRAND_TOTAL')} />
        </div>
      ),
      align: 'end',
      width: 120,
      dataIndex: 'subTotal',
      render: (text, record, index) => {
        return formatCurrency(text);
      },
    },
    exportedWarehouse: {
      title: (
        <div className="title-table">
          {t('order.orderList.exportWarehouse')}
          {renderDropdownFilter(warehousesOptions, 'exportedWarehouseIDs', 'checkbox')}
        </div>
      ),
      dataIndex: 'exportedWarehouse',
      width: 110,
    },
    receiverName: {
      title: (
        <div className="title-table">
          {t('order.orderList.receiverName')}
          {/* <FontAwesomeIcon icon={Icon.faFilter} /> */}
        </div>
      ),
      dataIndex: 'receiverName',
      width: 130,
    },
    orderPriority: {
      title: (
        <div className="title-table">
          {t('order.orderList.orderPriority')}
          {renderDropdownFilter(orderPriorityOptions, 'priorities', 'checkbox')}
        </div>
      ),
      dataIndex: 'orderPriority',
      render: (text, record, index) => {
        return renderOrderPriority(text);
      },
      width: 130,
    },
    shippingType: {
      title: (
        <div className="title-table">
          {t('order.orderList.shippingType')}
          {renderDropdownFilter(shippingOptions, 'shippingTypes', 'checkbox')}
        </div>
      ),
      dataIndex: 'shippingType',
      render: (text, record, index) => {
        return renderShippingMethod(text);
      },
      width: 190,
    },
    paymentMethod: {
      title: (
        <div className="title-table">
          {t('order.orderList.paymentMethod')}
          {renderDropdownFilter(paymentMethodOptions, 'paymentMethods', 'checkbox')}
        </div>
      ),
      dataIndex: 'paymentMethod',
      render: (text, record, index) => {
        return renderPaymentMethod(text);
      },
      width: 150,
    },
    status: {
      title: (
        <div className="title-table">
          {t('order.orderList.status')}
          {renderDropdownFilter(statusOptions, 'statuses', 'checkbox')}
        </div>
      ),
      dataIndex: 'status',
      render: (text, record, index) => {
        return renderStatus(text);
      },
      width: 150,
    },
    createdBy: {
      title: (
        <div className="title-table">
          {t('order.orderList.createdBy')}
          {renderDropdownFilter(
            createdByOptions,
            'createdByIDs',
            'checkbox',
            paginationCreatedBy,
            setPaginationCreatedBy,
            paginationDataCreatedBy
          )}
        </div>
      ),
      dataIndex: 'createdBy',
      width: 200,
    },
    inStockStatus: {
      title: (
        <div className="title-table">
          {t('order.orderList.inStockStatus')}
          {/* <FontAwesomeIcon icon={Icon.faFilter} /> */}

          {renderDropdownFilter(isInStockOption, 'stockStatus', 'radio')}
        </div>
      ),
      dataIndex: 'inStockStatus',
      width: 160,
      render: (text, record, index) => renderStockStatus(text),
    },
    fullStockRequired: {
      title: (
        <div className="title-table">
          {t('order.orderList.fullStockRequired')}
          {/* <FontAwesomeIcon icon={Icon.faFilter} /> */}
          {renderDropdownFilter(fullStockRequiredOption, 'fullStockRequired', 'checkbox')}
        </div>
      ),
      dataIndex: 'fullStockRequired',
      width: 150,
      align: 'center',
      render: (text, record, index) => renderVATAndFullStockRequired(text),
    },
    vat: {
      title: (
        <div className="title-table">
          {t('order.orderList.exportVAT')}
          {/* <FontAwesomeIcon icon={Icon.faFilter} /> */}
          {renderDropdownFilter(vatOption, 'vat', 'checkbox')}
        </div>
      ),
      width: 120,
      dataIndex: 'vat',
      align: 'center',
      render: (text, record, index) => renderVATAndFullStockRequired(text),
    },
    remainingDeliverTime: {
      title: (
        <div className="title-table">
          {t('order.orderList.remainingDeliverTime')}
          <SvgIcon.SortIcon onClick={() => handleSort('CREATED_AT')} />
        </div>
      ),
      dataIndex: 'remainingDeliverTime',
      width: 180,
      align: 'center',
      render: (text, record, index) => {
        return renderRemainingDeliverTime(text);
      },
    },
    receiverContactAddress: {
      title: t('order.orderList.receiverContactAddress'),
      dataIndex: 'receiverContactAddress',
      width: 250,
    },
    promisedDeliverTime: {
      title: t('order.orderList.promisedDeliverTime'),
      dataIndex: 'promisedDeliverTime',
      width: 150,
    },
    shippingUnit: {
      title: t('order.orderList.shippingUnit'),
      dataIndex: 'shippingUnit',
      width: 250,
    },
    internalNote: {
      title: t('order.orderList.internalNote'),
      dataIndex: 'internalNote',
      width: 150,
    },
    image: {
      title: t('order.orderList.image'),
      dataIndex: 'fileURLs',
      width: 150,
    },
    successfulDeliveryDate: {
      title: t('order.orderList.successfulDeliveryDate'),
      dataIndex: 'successfulDeliveryDate',
      width: 150,
    },
    completedAt: {
      title: t('order.orderList.completedAt'),

      dataIndex: 'completedAt',
      width: 150,
    },
    shipperTelephone: {
      title: t('order.orderList.shipperTelephone'),
      width: 150,
      dataIndex: 'shipperTelephone',
    },
    senderAddress: {
      title: t('order.orderList.senderAddress'),
      dataIndex: 'senderAddress',
      width: 450,
    },
    noteShipping: {
      title: t('order.orderList.noteShipping'),
      dataIndex: 'noteShipping',
      width: 450,
    },
    receiverContactPhone: {
      title: t('order.orderList.receiverContactPhone'),
      dataIndex: 'receiverContactPhone',
      width: 150,
    },
    linkShippingSuccess: {
      render: (text, record, index) =>
        canCompleteOrder ? <SuccessDeliveryButton orderID={record.id} /> : <></>,
      width: 150,
    },
    note: {
      title: t('order.orderList.note'),
      dataIndex: 'note',
      width: 150,
    },
  };

  const {
    index,
    createdAt,
    orderCode,
    subTotal,
    exportedWarehouse,
    receiverName,
    orderPriority,
    shippingType,
    paymentMethod,
    status,
    createdBy,
    inStockStatus,
    fullStockRequired,
    vat,
    remainingDeliverTime,
    receiverContactAddress,
    promisedDeliverTime,
    shippingUnit,
    internalNote,
    image,
    successfulDeliveryDate,
    shipperTelephone,
    senderAddress,
    noteShipping,
    receiverContactPhone,
    linkShippingSuccess,
    note,
  } = all;

  const ALL_COLUMNS_TABLE = [
    index,
    createdAt,
    orderCode,
    subTotal,
    exportedWarehouse,
    receiverName,
    orderPriority,
    shippingType,
    paymentMethod,
    status,
    createdBy,
  ];

  const WAITING_FOR_APPROVAL_COLUMNS_TABLE = [
    createdAt,
    orderCode,
    subTotal,
    exportedWarehouse,
    receiverName,
    orderPriority,
    inStockStatus,
    fullStockRequired,
    shippingType,
    vat,
    paymentMethod,
    remainingDeliverTime,
    createdBy,
  ];

  const WAITING_FOR_ENOUGH_STOCK_COLUMNS_TABLE = [
    createdAt,
    orderCode,
    subTotal,
    exportedWarehouse,
    receiverName,
    orderPriority,
    inStockStatus,
    fullStockRequired,
    shippingType,
    vat,
    paymentMethod,
    remainingDeliverTime,
    createdBy,
  ];

  const WAITING_FOR_PAYMENT_COLUMNS_TABLE = [
    createdAt,
    orderCode,
    subTotal,
    exportedWarehouse,
    receiverName,
    orderPriority,
    inStockStatus,
    fullStockRequired,
    shippingType,
    vat,
    paymentMethod,
    remainingDeliverTime,
    createdBy,
  ];

  const WAITING_FOR_EXPORTING_COLUMNS_TABLE = [
    createdAt,
    orderCode,
    subTotal,
    exportedWarehouse,
    receiverName,
    receiverContactAddress,
    promisedDeliverTime,
    orderPriority,
    shippingType,
    shippingUnit,
    internalNote,
    createdBy,
  ];

  const WAITING_FOR_SHIPPING_COLUMNS_TABLE = [
    createdAt,
    orderCode,
    remainingDeliverTime,
    orderPriority,
    paymentMethod,
    shippingUnit,
    shipperTelephone,
    senderAddress,
    note,
    receiverName,
    receiverContactPhone,
    createdBy,
  ];

  const DELIVERING_COLUMNS_TABLE = [
    index,
    createdAt,
    orderCode,
    orderPriority,
    remainingDeliverTime,
    paymentMethod,
    shippingUnit,
    shipperTelephone,
    senderAddress,
    noteShipping,
    receiverName,
    receiverContactPhone,
    createdBy,
    linkShippingSuccess,
  ];

  const CANCELED_COLUMNS_TABLE = [
    createdAt,
    orderCode,
    subTotal,
    exportedWarehouse,
    receiverName,
    orderPriority,
    inStockStatus,
    fullStockRequired,
    shippingType,
    vat,
    paymentMethod,
    remainingDeliverTime,
    createdBy,
  ];

  const COMPLETED_COLUMNS_TABLE = [
    index,
    createdAt,
    orderCode,
    subTotal,
    exportedWarehouse,
    receiverName,
    shippingType,
    vat,
    paymentMethod,
    successfulDeliveryDate,
    createdBy,
    shippingUnit,
    image,
  ];

  const renderColumns = (type) => {
    switch (type) {
      case STATUS_ORDER.ALL:
        return ALL_COLUMNS_TABLE;
      case STATUS_ORDER.WAITING_FOR_APPROVAL:
        return WAITING_FOR_APPROVAL_COLUMNS_TABLE;
      case STATUS_ORDER.WAITING_FOR_ENOUGH_STOCK:
        return WAITING_FOR_ENOUGH_STOCK_COLUMNS_TABLE;
      case STATUS_ORDER.WAITING_FOR_PAYMENT:
        return WAITING_FOR_PAYMENT_COLUMNS_TABLE;
      case STATUS_ORDER.WAITING_FOR_EXPORTING:
        return WAITING_FOR_EXPORTING_COLUMNS_TABLE;
      case STATUS_ORDER.WAITING_FOR_SHIPPING:
        return WAITING_FOR_SHIPPING_COLUMNS_TABLE;
      case STATUS_ORDER.DELIVERING:
        return DELIVERING_COLUMNS_TABLE;
      case STATUS_ORDER.COMPLETED:
        return COMPLETED_COLUMNS_TABLE;
      case STATUS_ORDER.CANCELED:
        return CANCELED_COLUMNS_TABLE;
    }
  };

  return { renderColumns, renderShippingMethod, renderOrderPriority, renderPaymentMethod };
};

export default useColumnsOrder;
