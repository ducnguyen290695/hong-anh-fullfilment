import React, { memo } from 'react';
import { Steps } from 'antd';
import { useTranslation } from 'react-i18next';
import './index.scss';

const { Step } = Steps;

const OrderStatus = memo(({ events }) => {
  const { t } = useTranslation();

  return (
    <div className="order-status">
      <p className="status-title">{t('order.orderStatus.orderStatus')}</p>
      <Steps
        progressDot={(_, { status }) => {
          return <div className={`${status.toLowerCase()}-dot progress-dot`} />;
        }}
        size="small"
      >
        {events?.map(({ name, createdAt, createdBy, state }, index) => (
          <Step
            status={state}
            key={index}
            title={
              <div className="order-node">
                <p>{name}</p>
                <p>{createdAt}</p>
                <p>{createdBy}</p>
              </div>
            }
          />
        ))}
      </Steps>
    </div>
  );
});

export default OrderStatus;
