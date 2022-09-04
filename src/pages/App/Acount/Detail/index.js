import React from 'react';
import { CreateAccountForm } from '../Create';
import { FORM_TYPE } from 'config/constants';
import { useGetUserPermissions, useStaffPermissions } from 'hooks/user/user';
import Spinner from 'components/Spinner';
import Page403 from 'pages/PageError/403';

const AccountDetail = () => {
  const { loading: loadUserPermissions } = useGetUserPermissions();
  const { canUpdate } = useStaffPermissions();

  return loadUserPermissions ? (
    <Spinner loading={loadUserPermissions} />
  ) : canUpdate ? (
    <CreateAccountForm type={FORM_TYPE.DETAIL} />
  ) : (
    <Page403 />
  );
};

export default AccountDetail;
