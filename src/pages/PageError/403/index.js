import { Button, Result } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Page403 = () => {
  const { t } = useTranslation();
  return (
    <Result
      status="403"
      title={t('pageError.403')}
      subTitle={t('pageError.403SubTittle')}
      extra={
        <Button type="primary" href="/">
          {t('pageError.goHomePage')}
        </Button>
      }
    />
  );
};

export default Page403;
