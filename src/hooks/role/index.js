import { useMutation, useQuery } from '@apollo/client';
import { GET_ROLES, GET_ROLE_DETAIL } from 'graphql/role/query';
import {
  ASSIGN_USERS_TO_ROLE_MUTATION,
  DELETE_ROLE_MUTATION,
  UPDATE_ROLE,
  CREATE_ROLE,
} from 'graphql/role/mutation';
import { USER_PERMISSIONS } from 'config/constants';
import { useGetUserPermissions } from 'hooks/user/user';
import { hasPermission } from 'utils/helperFuncs';

export const useCreateRole = () => {
  const [createRole, { loading }] = useMutation(CREATE_ROLE);

  const handleCreateRole = async ({ role }) => {
    return await createRole({
      variables: {
        role,
      },
    });
  };
  return {
    handleCreateRole,
    loading,
  };
};

export const useUpdateRole = () => {
  const [updateRole, { loading }] = useMutation(UPDATE_ROLE);
  const handleUpdateRole = async ({ id, role }) => {
    return await updateRole({
      variables: {
        id,
        role,
      },
    });
  };
  return {
    handleUpdateRole,
    loading,
  };
};

export const useGetRoles = ({ offset, query }) => {
  const { loading, data, refetch } = useQuery(GET_ROLES, {
    variables: {
      offset,
      query,
    },
  });

  return {
    loading,
    roles: data?.role?.pagination?.roles,
    total: data?.role?.pagination?.paginationData?.total,
    refetch,
  };
};

export const useGetRoleDetail = ({ id }) => {
  const { loading, data, refetch } = useQuery(GET_ROLE_DETAIL, {
    variables: {
      id,
    },
  });

  return {
    loading,
    roleDetail: data?.role?.get,
    refetch,
  };
};

export const useAssignUsersToRole = () => {
  const [addUsers, { loading }] = useMutation(ASSIGN_USERS_TO_ROLE_MUTATION);

  const hanldeAssignUsersToRole = async ({ roleID, addUserIDs, removedUserIDs }) => {
    return await addUsers({
      variables: {
        roleID,
        addUserIDs,
        removedUserIDs,
      },
    });
  };
  return {
    hanldeAssignUsersToRole,
    loading,
  };
};

export const useDeleteRole = () => {
  const [deleteRole, { loading }] = useMutation(DELETE_ROLE_MUTATION);

  const handleDeleteRole = async ({ roleID }) => {
    return await deleteRole({
      variables: {
        roleID,
      },
    });
  };
  return {
    handleDeleteRole,
    loading,
  };
};

export const useRolePermissions = () => {
  const { permissions = [] } = useGetUserPermissions();
  return {
    canView: hasPermission(permissions, [USER_PERMISSIONS.ROLE_VIEW]),
    canCreate: hasPermission(permissions, [USER_PERMISSIONS.ROLE_CREATE]),
    canUpdate: hasPermission(permissions, [USER_PERMISSIONS.ROLE_UPDATE]),
    canDelete: hasPermission(permissions, [USER_PERMISSIONS.ROLE_DELETE]),
  };
};
