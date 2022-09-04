import { Button } from 'antd';
import { FontAwesomeIcon, Icon } from 'assets/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
import { useRolePermissions } from 'hooks/role';
import { useStaffPermissions } from 'hooks/user/user';
import { useDepartmentPermissions } from 'hooks/department/department';
import { useSellerPermissions } from 'hooks/seller';

const Setting = () => {
  const { canView: canViewRole } = useRolePermissions();
  const { canCreate: canCreateStaff, canView: canViewStaff } = useStaffPermissions();
  const { canCreate: canCreateDepartment, canView: canViewDepartment } = useDepartmentPermissions();
  const { canCreate: canCreateSeller, canView: canViewSeller } = useSellerPermissions();

  return (
    <div className="setting-container">
      <p className="page-title">Cài đặt hệ thống</p>
      {(canViewRole || canViewStaff || canViewDepartment) === true && (
        <div className="page-content">
          <p className="title">CÀI ĐẶT TÀI KHOẢN NHÂN VIÊN</p>

          <div className="setting-content">
            {canViewStaff && (
              <div className="setting-box">
                <div className="card">
                  <div className="card-icon">
                    <FontAwesomeIcon icon={Icon.faUser} />
                  </div>

                  <div className="card-content">
                    <Link to="/account">
                      <a>Quản lý tài khoản nhân viên</a>
                    </Link>
                    <p className="desciption">Tạo và quản lý tất cả các tài khoản nhân viên</p>
                  </div>
                </div>

                {canCreateStaff && (
                  <Link to="/account/create">
                    <Button className="create-acc-btn" type="primary">
                      Tạo tài khoản
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {canViewDepartment && (
              <div className="setting-box">
                <div className="card">
                  <div className="card-icon">
                    <FontAwesomeIcon icon={Icon.faUser} />
                  </div>

                  <div className="card-content">
                    <Link to="/department">
                      <a>Phân quyền phòng ban</a>
                    </Link>
                    <p className="desciption">
                      Tạo, phân quyền và quản lý vai trò tất cả phòng ban
                    </p>
                  </div>
                </div>

                {canCreateDepartment && (
                  <Link to="/department/create">
                    <Button className="create-acc-btn" type="primary">
                      Tạo phòng ban
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {canViewRole && (
              <div className="setting-box">
                <div className="card">
                  <div className="card-icon">
                    <FontAwesomeIcon icon={Icon.faUserLock} />
                  </div>

                  <div className="card-content">
                    <Link
                      to={{
                        pathname: '/account',
                        state: {
                          tab: 'role-list',
                        },
                      }}
                    >
                      <a>Quản lý vai trò nhân viên</a>
                    </Link>
                    <p className="desciption">Tạo và quản lý tất cả các vai trò nhân viên</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {canViewSeller && (
        <div className="page-content">
          <p className="title">CÀI ĐẶT TÀI KHOẢN ĐẠI LÝ</p>

          <div className="setting-content">
            {canViewSeller && (
              <div className="setting-box">
                <div className="card">
                  <div className="card-icon">
                    <FontAwesomeIcon icon={Icon.faUserFriends} />
                  </div>

                  <div className="card-content">
                    <Link to="/seller">
                      <a>Quản lý tài khoản đại lý</a>
                    </Link>
                    <p className="desciption">Tạo và quản lý tất cả tài khoản đại lý</p>
                  </div>
                </div>

                {canCreateSeller && (
                  <Link to="/seller/create">
                    <Button className="create-acc-btn" type="primary">
                      Thêm mới đại lý
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;
