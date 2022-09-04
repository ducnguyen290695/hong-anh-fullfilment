import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { ChatWidget } from '@papercups-io/chat-widget';
import { Storytime } from '@papercups-io/storytime';
import { Badge, Dropdown, Layout, Menu } from 'antd';
import { FontAwesomeIcon, Icon, SvgIcon } from 'assets/icons';
import Img from 'assets/images';
import { CC_ACCOUNT_ID, CC_INBOX_ID, CC_TOKEN, CC_URL } from 'config/apiUrls';
import { appRoutes, getAppRoutes } from 'config/routes';
import { useLogout } from 'hooks/auth/auth';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, useHistory } from 'react-router-dom';
import { getFilterRouters } from 'utils/filteredRouter';
import './index.scss';
import { useGetMe } from 'hooks/auth/login';

const CHAT_ICON_URL =
  'https://cdn-icons.flaticon.com/png/512/1304/premium/1304052.png?token=exp=1654665229~hmac=5d413146af2bf70afa931186f380b43a';

const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { SubMenu } = Menu;
  const { Header, Content, Sider } = Layout;
  const dispatch = useDispatch();
  const { logout } = useLogout();
  const history = useHistory();
  const { me } = useGetMe();
  let customer = {
    name: me?.fullname,
    email: me?.email,
    external_id: `HAC-${me?.id}`,
  };
  if (me) {
    Storytime.init({
      accountId: CC_ACCOUNT_ID,
      // Optionally pass in metadata to identify the customer
      customer,
      // Optionally specify the base URL
      baseUrl: CC_URL,
    });
  }

  const userInfo = useSelector((store) => store?.me?.get?.data);

  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const currentPath = window.location.pathname;

  const headerMenu = (
    <Menu className="header-menu">
      <Menu.Item className="menu-item">
        <Link to="/profile">
          <FontAwesomeIcon icon={Icon.faUser} />
          <span>Cập nhật profile</span>
        </Link>
      </Menu.Item>
      <Menu.Item className="menu-item">
        <Link to="/change-password">
          <FontAwesomeIcon icon={Icon.faLock} />
          <span>Đổi mật khẩu</span>
        </Link>
      </Menu.Item>
      <Menu.Item className="menu-item log-out" onClick={logout}>
        <a>
          <FontAwesomeIcon icon={Icon.faSignOutAlt} />
          <span>Đăng xuất</span>
        </a>
      </Menu.Item>
    </Menu>
  );

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  function closeSideBar() {
    if (window && window.innerWidth < 800) {
      setCollapsed(true);
    }
  }

  function getUserInfo() {
    dispatch({
      type: 'GET_ME_REQUEST',
    });
  }

  useEffect(() => {
    for (let item of appRoutes) {
      if (!item?.children && currentPath === item?.path) {
        setSelectedKeys([item?.key]);
        break;
      }

      if (item?.children && item?.title) {
        for (let child of item.children) {
          if (currentPath === child?.path) {
            setSelectedKeys([child?.key]);
            if (!openKeys.includes(item?.key)) {
              const newOpenKeys = [...openKeys, item?.key];
              setOpenKeys(newOpenKeys);
            }
            break;
          }
        }
      }
      if (!item.title && currentPath.split('/')[1] === item?.path.split('/')[1]) {
        setSelectedKeys([item?.key]);
        if (!openKeys.includes(item?.key)) {
          const newOpenKeys = [...openKeys, item?.key];
          setOpenKeys(newOpenKeys);
        }
      }
    }
  }, [currentPath]);

  useEffect(() => {
    if (window?.innerWidth > 768) {
      setCollapsed(false);
    }
    getUserInfo();
  }, []);

  return (
    <Layout className="layout">
      <div className={`mask ${collapsed ? 'mask-closed' : 'mask-opened'}`} onClick={toggle}></div>
      <Sider
        width={250}
        trigger={null}
        className={`side-bar ${collapsed ? 'side-bar-closed' : 'side-bar-opened'}`}
        collapsible
        collapsed={collapsed}
      >
        <div className="logo">
          <div className="img"></div>
          <div className={`company-name ${collapsed ? 'closed' : 'opened'}`}>
            <p className="title">Hệ thống quản lý bán hàng</p>
            <p className="name">Hồng Anh Computer</p>
          </div>
        </div>

        <Menu
          className="menu"
          mode="inline"
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onOpenChange={(e) => setOpenKeys(e)}
          onClick={(e) => setSelectedKeys(e.key)}
        >
          {getFilterRouters(appRoutes)?.map((item) => {
            if (!item?.title) {
              return;
            }

            if (!item?.children) {
              return (
                <Menu.Item onClick={closeSideBar} {...item} className="menu-item" key={item?.key}>
                  <Link to={item?.path}>{item?.title}</Link>
                </Menu.Item>
              );
            }

            return (
              <SubMenu className="sub-menu" {...item} key={item?.key}>
                {item?.children?.map((child) => (
                  <Menu.Item onClick={closeSideBar} className="menu-item" key={child?.key}>
                    <Link to={child?.path}>{child?.title}</Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            );
          })}

          <Menu.Item className="setting" key="setting" path="/setting" onClick={closeSideBar}>
            <Link to="/setting">
              <div
                className="setting"
                style={{
                  justifyContent: collapsed ? 'center' : 'unset',
                }}
              >
                <FontAwesomeIcon icon={Icon.faCog} />
                <span
                  style={{
                    display: collapsed ? 'none' : 'block',
                  }}
                >
                  Cài đặt
                </span>
              </div>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header className={`header ${collapsed ? 'header-closed' : 'header-opened'}`}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: toggle,
          })}

          <div className="mobile-menu" onClick={toggle}>
            <FontAwesomeIcon icon={Icon.faBars} />
          </div>

          <div className="right-part">
            <div className="cart" onClick={() => history.push('/cart')}>
              <Badge count={me?.totalCart} size="small">
                <SvgIcon.CartIcon />
              </Badge>
            </div>

            <div className="notify">
              <Badge dot>
                <FontAwesomeIcon icon={Icon.faBell} />
              </Badge>
            </div>

            <Dropdown trigger="click" overlay={headerMenu} placement="bottomRight">
              <div className="user-info">
                <div className="avatar">
                  <FontAwesomeIcon icon={Icon.faUser} />
                </div>

                <div className="info">
                  <p className="user-name">{userInfo?.user?.fullName}</p>
                  <p className="user-role">{userInfo?.department?.name}</p>
                </div>

                <FontAwesomeIcon className="down-arrow" icon={Icon.faChevronDown} />
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          className={`site-layout-background content ${
            collapsed ? 'content-closed' : 'content-opened'
          }`}
        >
          {getAppRoutes()?.map((item, index) => {
            return <Route key={index} {...item} />;
          })}
        </Content>
        <ChatWidget
          styles={{
            chatContainer: {
              marginBottom: 20,
            },
            toggleContainer: {
              marginBottom: 45,
            },
          }}
          token={CC_TOKEN}
          inbox={CC_INBOX_ID}
          title="Welcome to HAC"
          subtitle="Ask us anything in the chat window below 😊"
          primaryColor="#1890ff"
          newMessagePlaceholder="Start typing..."
          showAgentAvailability={false}
          agentAvailableText="We're online right now!"
          agentUnavailableText="We're away at the moment."
          requireEmailUpfront={false}
          iconVariant="outlined"
          customIconUrl={Img.SupportIcon}
          baseUrl={CC_URL}
          // Optionally include data about your customer here to identify them
          // customer={customer}
        />
      </Layout>
    </Layout>
  );
};

export default App;
