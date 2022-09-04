import React from 'react';
import { FORM_TYPE } from 'config/constants';
import { CreateDepartmentForm } from '../Create';
import { useGetUserPermissions } from 'hooks/user/user';
import { useDepartmentPermissions } from 'hooks/department/department';
import Spinner from 'components/Spinner';
import Page403 from 'pages/PageError/403';

const DepartmentDetail = () => {
  const { canUpdate: canUpdateDepartment } = useDepartmentPermissions();
  const { loading: loadUserPermissions } = useGetUserPermissions();

  return loadUserPermissions ? (
    <Spinner loading={loadUserPermissions} />
  ) : canUpdateDepartment ? (
    <CreateDepartmentForm type={FORM_TYPE.DETAIL} />
  ) : (
    <Page403 />
  );
};

export default DepartmentDetail;
