import Spinner from 'components/Spinner';
import { useSellerPermissions } from 'hooks/seller';
import { useGetUserPermissions } from 'hooks/user/user';
import Page403 from 'pages/PageError/403';
import React from 'react';
import { CreateSellerForm } from '../Create';

const SellerDetail = () => {
  const { canUpdate } = useSellerPermissions();
  const { loading: loadUserPermissions } = useGetUserPermissions();

  return loadUserPermissions ? (
    <Spinner loading={loadUserPermissions} />
  ) : canUpdate ? (
    <CreateSellerForm isSellerDetail={true} />
  ) : (
    <Page403 />
  );
};

export default SellerDetail;
