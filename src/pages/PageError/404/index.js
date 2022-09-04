import { Button, Result } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Page404 = () => {
  const { t } = useTranslation();
  return (
    <Result
      status="404"
      title={t('pageError.404')}
      subTitle={t('pageError.404SubTittle')}
      extra={
        <Button type="primary" href="/">
          {t('pageError.goHomePage')}
        </Button>
      }
    />
  );
};

export default Page404;
