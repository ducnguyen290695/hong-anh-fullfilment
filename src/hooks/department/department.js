import { useMutation, useQuery } from '@apollo/client';
import { USER_PERMISSIONS } from 'config/constants';
import {
  CREATE_DEPARTMENT_MUTATION,
  DELETE_DEPARTMENT_MUTATION,
  UPDATE_DEPARTMENT_MUTATION,
} from 'graphql/department/mutation';
import { DEPARTMENTS_QUERY, GET_DEPARTMENT_QUERY } from 'graphql/department/query';
import { useGetUserPermissions } from 'hooks/user/user';
import { hasPermission } from 'utils/helperFuncs';

export const useGetDepartment = (params) => {
  const { loading, data, refetch } = useQuery(GET_DEPARTMENT_QUERY, {
    variables: params,
    skip: !params.departmentID,
  });
  return {
    loading,
    data: data?.department.get,
    refetch,
  };
};

export const useDepartments = ({ filters, pagination }) => {
  const { loading, data, refetch } = useQuery(DEPARTMENTS_QUERY, {
    variables: {
      filters,
      pagination,
    },
  });

  return {
    loading,
    departments: data?.department?.pagination?.departments,
    total: data?.department?.pagination?.paginationData?.total,
    refetch,
  };
};

export const useDeleteDepartments = () => {
  const [mutation, { loading }] = useMutation(DELETE_DEPARTMENT_MUTATION);

  const handleDeleteDepartments = async (departmentIDs) => {
    return mutation({
      variables: {
        departmentIDs,
      },
    });
  };

  return {
    loading,
    handleDeleteDepartments,
  };
};

export const useCreateDepartment = () => {
  const [mutate, { loading }] = useMutation(CREATE_DEPARTMENT_MUTATION);
  const handleCreateDepartment = async (department) => {
    await mutate({
      variables: {
        department,
      },
    });
  };

  return {
    loading,
    handleCreateDepartment,
  };
};

export const useUpdateDepartment = () => {
  const [mutate, { loading }] = useMutation(UPDATE_DEPARTMENT_MUTATION);
  const handleUpdateDepartment = async (id, department) => {
    await mutate({
      variables: {
        id,
        department,
      },
    });
  };

  return {
    handleUpdateDepartment,
    loading,
  };
};

export const useDepartmentPermissions = () => {
  const { permissions = [] } = useGetUserPermissions();
  return {
    canView: hasPermission(permissions, [USER_PERMISSIONS.DEPARTMENT_VIEW]),
    canCreate: hasPermission(permissions, [USER_PERMISSIONS.DEPARTMENT_CREATE]),
    canUpdate: hasPermission(permissions, [USER_PERMISSIONS.DEPARTMENT_UPDATE]),
    canDelete: hasPermission(permissions, [USER_PERMISSIONS.DEPARTMENT_DELETE]),
  };
};
