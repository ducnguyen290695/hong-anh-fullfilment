import React, { useState, useEffect } from 'react';
import { Tabs, Form, Button } from 'antd';
import PageHeader from 'components/PageHeader';
import CommonInfo from './components/CommonInfo';
import AddressList from './components/AddressList';
import SellCategories from './components/SellCategories';
import { Link } from 'react-router-dom';
import {
  useCreateSeller,
  useGetSellerDetail,
  useSellerPermissions,
  useUpdateSeller,
} from 'hooks/seller';
import { useParams, useHistory } from 'react-router-dom';
import { notify } from 'utils/helperFuncs';
import Spinner from 'components/Spinner';
import { useTranslation } from 'react-i18next';
import './index.scss';
import Page403 from 'pages/PageError/403';
import { useGetUserPermissions } from 'hooks/user/user';

const { TabPane } = Tabs;

export const CreateSellerForm = ({ isSellerDetail }) => {
  const [logoUrl, setLogoUrl] = useState('');
  const { id } = useParams();
  const [saleCategories, setSaleCategories] = useState([]);
  const [form] = Form.useForm();
  const { handleCreateSeller } = useCreateSeller();
  const { handleUpdateSeller } = useUpdateSeller();
  const [activeTab, setActiveTab] = useState('common-info');
  const { seller, loading } = useGetSellerDetail({ id });
  const [location, setLocation] = useState({
    cityId: null,
    districtId: null,
  });
  const history = useHistory();
  const { t } = useTranslation();
  const { canViewContact } = useSellerPermissions();

  function getLogoUrl(url) {
    setLogoUrl(url);
  }

  function changeTab(tabKey) {
    setActiveTab(tabKey);
  }

  function handleChangeSaleCategories(checkedList) {
    setSaleCategories(checkedList?.filter((item) => item.checked));
  }

  async function createSeller() {
    const values = await form.validateFields();
    if (!saleCategories?.length) {
      changeTab('sale-categories');
      notify.warning({
        message: t('seller.selectSaleCategoriesWarning'),
      });
      return;
    }

    const {
      fullName,
      email,
      address,
      bankAccountNumber,
      bankBranch,
      bankID,
      businessName,
      cityID,
      company_address,
      company_email,
      debtAge,
      debtLimit,
      districtID,
      idNumber,
      legal_representative_phone,
      representative,
      sellerLevelID,
      shortName,
      taxIDNumber,
      telephone,
      wardID,
      warehouseIDs,
      type,
    } = values;
    const payload = {
      sellerInfo: {
        idNumber,
        type: type || 'COMPANY',
        logoUrl,
        shortName,
        debtAge,
        debtLimit,
        sellerLevelID,
        fullName,
        email,
        address,
        cityID,
        districtID,
        wardID,
        telephone,
      },
      vatInfo: {
        address: company_address,
        bankAccountNumber,
        bankBranch,
        bankID,
        businessName,
        email: company_email,
        representative,
        taxIDNumber,
        telephone: legal_representative_phone,
      },
      warehouseIDs,
      saleCategories: saleCategories?.map(({ level, id }) => ({
        categoryID: id,
        level: level || 1,
      })),
    };

    try {
      await handleCreateSeller(payload);
      notify.success({
        message: t('seller.createSellerSuccess'),
      });
      form.resetFields();
      history.push('/seller');
    } catch (err) {
      notify.error({
        message: t('seller.createSellerFail'),
        description: err.message,
      });
    }
  }

  function initForm() {
    const vatInfo = { seller };
    const formValues = {
      ...seller?.vatInfo,
      ...seller,
      company_address: vatInfo?.address,
      company_email: vatInfo?.email,
      legal_representative_phone: vatInfo?.telephone,
      warehouseIDs: seller?.warehouses?.map(({ id }) => id),
    };

    form.setFieldsValue({
      ...formValues,
    });

    setLocation({
      ...location,
      cityId: seller?.cityID,
      districtId: seller?.districtID,
    });
  }

  async function updateSeller() {
    const values = await form.validateFields();

    const {
      fullName,
      email,
      address,
      bankAccountNumber,
      bankBranch,
      bankID,
      businessName,
      cityID,
      company_address,
      company_email,
      debtAge,
      debtLimit,
      districtID,
      idNumber,
      legal_representative_phone,
      representative,
      sellerLevelID,
      shortName,
      taxIDNumber,
      telephone,
      wardID,
      warehouseIDs,
      type,
    } = values;
    const payload = {
      sellerID: id,
      sellerInfo: {
        idNumber,
        type: type || 'COMPANY',
        logoUrl: logoUrl || seller?.logoUrl,
        shortName,
        debtAge,
        debtLimit,
        sellerLevelID,
        fullName,
        email,
        address,
        cityID,
        districtID,
        wardID,
        telephone,
      },
      vatInfo: {
        address: company_address,
        bankAccountNumber,
        bankBranch,
        bankID,
        businessName,
        email: company_email,
        representative,
        taxIDNumber,
        telephone: legal_representative_phone,
      },
      warehouseIDs,
      saleCategories: saleCategories?.map(({ level, id }) => ({
        categoryID: id,
        level: level || 1,
      })),
    };

    try {
      await handleUpdateSeller(payload);
      notify.success({
        message: t('seller.updateSellerSuccess'),
      });
      history.push('/seller');
    } catch (err) {
      notify.error({
        message: t('seller.updateSellerFail'),
        description: err.message,
      });
    }
  }

  useEffect(() => {
    isSellerDetail && initForm();
  }, [seller]);

  return (
    <div className="create-seller-container">
      <Spinner loading={loading} />
      <PageHeader
        pageTitle={
          isSellerDetail ? (
            <p>
              {t('seller.seller')} {seller?.shortName}{' '}
              <span className="seller-code">#{seller?.code}</span>
            </p>
          ) : (
            t('seller.addSeller')
          )
        }
        routes={[
          {
            path: '/setting',
            name: t('common.systemSetting'),
          },
          {
            path: '/seller',
            name: t('seller.sellerManage'),
          },
          {
            path: '',
            name: isSellerDetail ? t('seller.updateSeller') : t('seller.createSeller'),
          },
        ]}
      />

      <div className="button-group">
        <Form.Item>
          <Link to="/seller">
            <Button className="cancel-btn custom-button">{t('common.cancel')}</Button>
          </Link>
        </Form.Item>

        <Form.Item>
          <Button
            onClick={isSellerDetail ? updateSeller : createSeller}
            className="custom-button"
            type="primary"
          >
            {t('common.save')}
          </Button>
        </Form.Item>
      </div>

      <Tabs
        tabBarGutter={40}
        defaultActiveKey="common-info"
        tabBarStyle={{
          backgroundColor: '#e7f0ff',
          padding: '12px 24px',
          marginBottom: '20px',
          borderRadius: '8px',
        }}
        activeKey={activeTab}
        onChange={changeTab}
      >
        <TabPane tab={t('seller.commonInfo')} key="common-info">
          <CommonInfo
            defaultLogoUrl={seller?.logoUrl}
            getLogoUrl={getLogoUrl}
            form={form}
            isSellerDetail={isSellerDetail}
            location={location}
            setLocation={setLocation}
          />
        </TabPane>
        <TabPane forceRender={true} tab={t('seller.saleCategories')} key="sale-categories">
          <SellCategories
            isSellerDetail={isSellerDetail}
            seller={seller}
            onChange={handleChangeSaleCategories}
          />
        </TabPane>
        {isSellerDetail && canViewContact && (
          <TabPane tab={t('seller.addressList')} key="contact">
            <AddressList />
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

const CreateSeller = () => {
  const { canCreate: canCreateSeller } = useSellerPermissions();
  const { loading: loadUserPermissions } = useGetUserPermissions();

  return loadUserPermissions ? (
    <Spinner loading={loadUserPermissions} />
  ) : canCreateSeller ? (
    <CreateSellerForm />
  ) : (
    <Page403 />
  );
};

export default CreateSeller;
