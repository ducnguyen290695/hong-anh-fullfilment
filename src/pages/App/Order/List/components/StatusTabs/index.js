import React, { useState, useRef, useEffect } from 'react';
import './index.scss';
import { Icon } from 'assets/icons';
import { useGetSummaryTabs } from 'hooks/order';
import { useTranslation } from 'react-i18next';
import { STATUS_ORDER } from 'config/constants';

const StatusTabs = ({ onChange, statusOrder }) => {
  const categoriesContainer = useRef(null);
  const [currentActived, setCurrentActived] = useState(statusOrder);
  const { data } = useGetSummaryTabs();
  const { t } = useTranslation();

  useEffect(() => {
    setCurrentActived(statusOrder);
  }, [statusOrder]);

  const renderTotalStatus = (valueStatus) => (valueStatus !== undefined ? `(${valueStatus})` : '');

  const status = [
    {
      label: `${t('common.all')} ${renderTotalStatus(data?.all)}`,
      value: STATUS_ORDER.ALL,
    },
    {
      label: `${t('order.orderStatus.waitingForApproval')} ${renderTotalStatus(
        data?.waitingForApproval
      )}`,
      value: STATUS_ORDER.WAITING_FOR_APPROVAL,
    },
    {
      label: `${t('order.orderStatus.waitingForEnoughStock')} ${renderTotalStatus(
        data?.waitingForEnoughStock
      )}`,
      value: STATUS_ORDER.WAITING_FOR_ENOUGH_STOCK,
    },
    {
      label: `${t('order.orderStatus.waitingForPayment')} ${renderTotalStatus(
        data?.waitingForPayment
      )}`,
      value: STATUS_ORDER.WAITING_FOR_PAYMENT,
    },
    {
      label: `${t('order.orderStatus.waitingForExporting')} ${renderTotalStatus(
        data?.waitingForExporting
      )}`,
      value: STATUS_ORDER.WAITING_FOR_EXPORTING,
    },
    {
      label: `${t('order.orderStatus.waitingForDelivery')} ${renderTotalStatus(
        data?.waitingForShipping
      )}`,
      value: STATUS_ORDER.WAITING_FOR_SHIPPING,
    },
    {
      label: `${t('order.orderStatus.delivering')} ${renderTotalStatus(data?.delivering)}`,
      value: STATUS_ORDER.DELIVERING,
    },
    {
      label: `${t('order.orderStatus.completed')} ${renderTotalStatus(data?.completed)}`,
      value: STATUS_ORDER.COMPLETED,
    },
    {
      label: `${t('order.orderStatus.cancel')} ${renderTotalStatus(data?.canceled)}`,
      value: STATUS_ORDER.CANCELED,
    },
  ];

  function scrollToLeft() {
    if (categoriesContainer) {
      categoriesContainer.current.scrollLeft -= 100;
    }
  }

  function scrollToRight() {
    if (categoriesContainer) {
      categoriesContainer.current.scrollLeft += 100;
    }
  }

  function selectCurrentActived({ label, value }) {
    setCurrentActived(value);
    onChange && onChange({ label, value });
  }

  return (
    <div className="status-tabs">
      <div className="left-arrow" onClick={scrollToLeft}>
        <Icon.CustomIcon icon={Icon.faChevronLeft} />
      </div>

      <div className="right-arrow" onClick={scrollToRight}>
        <Icon.CustomIcon icon={Icon.faChevronRight} />
      </div>

      <div ref={categoriesContainer} className="status-list-container">
        {status?.map((item, index) => (
          <div className="status-list" key={index}>
            <div
              className={`status-item ${currentActived === item?.value && 'item-actived'}`}
              onClick={() => selectCurrentActived(item)}
            >
              {item?.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusTabs;
