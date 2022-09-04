import { Dropdown, Input, Checkbox, Grid, Form, Popconfirm, Tooltip, Button } from 'antd';
import { FontAwesomeIcon, Icon, SvgIcon } from 'assets/icons';
import CustomTable from 'components/CustomTable';
import PageHeader from 'components/PageHeader';
import { PRODUCT_INPUT_TYPE } from 'config/constants';
import { useGetProducts, useGetUpdatedProduct } from 'hooks/product/product';
import { useWarehouse } from 'hooks/warehouse';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import 'styles/custom_component.scss';
import {
  FilterManufacture,
  FilterLevelPrice,
  FilterRealStocks,
  FilterVAT,
} from './components/FilterProduct';
import { buildQueryString, debounce, formatCurrency, getQuery, notify } from 'utils/helperFuncs';
import './index.scss';
import CategoriesFilter from './components/CategoriesFilter';
import { findIndex, isEqual } from 'lodash';
import { useUpdateProduct, useProductPermissions } from 'hooks/product/product';
import TagsList from './components/TagsList';
import { useGetManufacturers } from 'hooks/manufacturer/manufacturer';
import EditableCell from './components/EditableCell';
import SelectionFilter from './components/SelectionFilter';
import CustomModalChangeSeller from 'pages/App/Cart/List/components/CustomModalChangeSeller';
import Page403 from 'pages/PageError/403';
import { useGetUserPermissions } from 'hooks/user/user';
import Spinner from 'components/Spinner';

const { useBreakpoint } = Grid;

const ProductList = ({
  useInModal,
  onSelectRows,
  defaultSelectedProducts,
  disableProductIDs,
  warehouseID,
  resetSelectedRows,
  sellerID,
}) => {
  const { xl } = useBreakpoint();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [selectionType] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState();
  const [editingKey, setEditingKey] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [currentActived, setCurrentActived] = useState('all');
  const [changeSellerModalVisible, setChangeSellerModalVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { loading: loadUserPermissions } = useGetUserPermissions();
  const { canViewProduct } = useProductPermissions();

  const [params, _setParams] = useState({
    filters: {
      query: getQuery().query || null,
      categoryIDs: [],
    },
    pagination: {
      limit: 10,
      offset: 0,
    },
  });

  const paramsRef = useRef(params);

  const setParams = (data) => {
    paramsRef.current = data;
    _setParams(data);
  };

  const [products, _setProducts] = useState([]);

  const productsRef = useRef(products);

  const setProducts = (data) => {
    productsRef.current = data;
    _setProducts(data);
  };

  const [total, _setTotal] = useState();

  const totalRef = useRef(total);

  const setTotal = (data) => {
    totalRef.current = data;
    _setTotal(data);
  };

  const skipGetProduct = editingKey === '' ? true : false;
  const { data: editedProduct, refetch: refetchProduct } = useGetUpdatedProduct(
    { id: editingKey },
    skipGetProduct
  );

  useEffect(() => {
    // if updated product has value and changed then updated products
    if (editedProduct) {
      const updatedProductIndex = findIndex(products, { id: editedProduct.id });
      const newProducts = [...products];
      newProducts.splice(updatedProductIndex, 1, editedProduct);
      setProducts(newProducts);
    }
  }, [editedProduct]);

  const getParams = () => ({
    ...params,
    warehouseIDs: warehouseID ? [warehouseID] : [],
    sellerID: sellerID,
  });

  const { handleUpdateProduct } = useUpdateProduct();
  const { loading, refetch, fetchMore } = useGetProducts(getParams());
  const { loadingManufactures, dataManufactures } = useGetManufacturers();

  const { warehouses, loading: loadingWarehouses } = useWarehouse();
  const { canUpdate } = useProductPermissions();

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
      onSelectRows && onSelectRows(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: (disableProductIDs || []).includes(record.id),
      name: record.name,
    }),
    selectedRowKeys: selectedRowKeys,
    renderCell: (checked, record, index, originNode) => {
      const editable = isEditing(record);
      return editable ? (
        <span>
          <Tooltip title={t('common.save')}>
            <SvgIcon.SuccessIcon onClick={() => save(record.id)} className="icon" />
          </Tooltip>
          <Popconfirm
            title={t('common.cancelMessage')}
            cancelText={t('common.cancel')}
            onConfirm={cancel}
          >
            <Tooltip title={t('common.cancel')}>
              <SvgIcon.ErrorIcon className="icon" />
            </Tooltip>
          </Popconfirm>
        </span>
      ) : (
        <>
          <Checkbox
            {...originNode.props}
            checked={[...(disableProductIDs || []), ...(selectedRowKeys || [])]?.includes(
              record.id
            )}
          />
          {canUpdate && !useInModal && (
            <Tooltip title={t('product.edit')}>
              <SvgIcon.EditIcon onClick={() => edit(record)} className="icon" />
            </Tooltip>
          )}
        </>
      );
    },
  };

  function filterProductExtra(values) {
    setParams({
      ...params,
      filters: {
        ...params.filters,
        ...values,
      },
    });
  }

  function handleFilterProductByPrice(isSpecified, range, level) {
    switch (level) {
      case 1:
        return filterProductExtra({ priceLevel1: { isSpecified, range } });
      case 2:
        return filterProductExtra({ priceLevel2: { isSpecified, range } });
      case 3:
        return filterProductExtra({ priceLevel3: { isSpecified, range } });
      default:
        return filterProductExtra({ priceLevel4: { isSpecified, range } });
    }
  }

  function filterRealStocks(values) {
    //first make it unique array then filter it has own property range
    const realStocks = [
      ...new Map(
        [...(params.filters?.realStocks ? params.filters.realStocks : []), values].map((item) => [
          item.warehouseID,
          item,
        ])
      ).values(),
    ].filter((item) => item.hasOwnProperty('range'));

    setParams({
      ...params,
      filters: {
        ...params.filters,
        realStocks: realStocks,
      },
    });
  }

  const renderChildrenInStock = (warehouses) => {
    return warehouses?.map((warehouse, index) => ({
      title: (
        <div className="title-table">
          {warehouse.name}
          <Dropdown
            overlayClassName="dropdown-overlay"
            trigger="click"
            overlay={<FilterRealStocks onFilter={filterRealStocks} warehouseID={warehouse.id} />}
            placement="bottomRight"
          >
            <FontAwesomeIcon icon={Icon.faFilter} />
          </Dropdown>
        </div>
      ),
      key: index,
      width: 90,
      align: 'center',
      editable: 'false',
      render: (_, record) =>
        record?.stocks?.filter((stock) => stock?.warehouse?.id === warehouse?.id)[0]?.quantity ||
        '- -',
    }));
  };

  const columns = [
    //Mã sản phẩm
    {
      title: t('product.tableTitle.code'),
      dataIndex: 'code',
      fixed: xl ? 'left' : '',
      width: 130,
      render: (_, record) => <Link to={`product/detail/${record.id}`}>{record.code}</Link>,
      editable: 'false',
    },
    //Thông số
    {
      title: t('product.tableTitle.name'),
      dataIndex: 'name',
      fixed: xl ? 'left' : '',
      width: 370,
      editable: 'false',
    },
    //NSX
    {
      title: (
        <div className="title-table">
          {t('product.tableTitle.producer')}
          {isSelectingProducts() && (
            <Dropdown
              overlayClassName="dropdown-overlay"
              trigger="click"
              overlay={
                <FilterManufacture
                  onFilter={filterProductExtra}
                  loadingManufactures={loadingManufactures}
                  dataManufactures={dataManufactures}
                />
              }
              placement="bottomRight"
            >
              <FontAwesomeIcon icon={Icon.faFilter} />
            </Dropdown>
          )}
        </div>
      ),
      dataIndex: ['manufacturer', 'name'],
      fixed: xl ? 'left' : '',
      width: 90,
      editable: 'false',
    },
    //Mã ngắn
    {
      title: t('product.tableTitle.shortCode'),
      dataIndex: 'shortCode',
      fixed: xl ? 'left' : '',
      width: 120,
      render: (_, record) => <Link to={`product/detail/${record.id}`}>{record.shortCode}</Link>,
      editable: 'true',
      inputType: PRODUCT_INPUT_TYPE.SHORT_CODE,
    },
    ...(useInModal
      ? [
          // Price by seller level
          {
            title: (_, record) => (
              <div className="title-table">
                {t('product.tableTitle.price')}
                {isSelectingProducts() && (
                  <Dropdown
                    overlayClassName="dropdown-overlay"
                    trigger="click"
                    overlay={
                      <FilterLevelPrice
                        onFilter={({ isSpecified, range }) => {
                          handleFilterProductByPrice(
                            isSpecified,
                            range,
                            record?.priceOfSeller?.level
                          );
                        }}
                      />
                    }
                    placement="bottomRight"
                  >
                    <FontAwesomeIcon icon={Icon.faFilter} />
                  </Dropdown>
                )}
              </div>
            ),
            dataIndex: ['priceOfSeller'],
            align: 'right',
            width: 135,
            render: (_, record) => <div>{formatCurrency(record?.priceOfSeller?.price)}</div>,
            editable: 'true',
            inputType: PRODUCT_INPUT_TYPE.CURRENCY,
          },
        ]
      : [
          {
            title: (
              <div className="title-table">
                {t('product.tableTitle.priceLevel2')}
                <Dropdown
                  overlayClassName="dropdown-overlay"
                  trigger="click"
                  overlay={
                    <FilterLevelPrice
                      onFilter={({ isSpecified, range }) => {
                        filterProductExtra({ priceLevel2: { isSpecified, range } });
                      }}
                    />
                  }
                  placement="bottomRight"
                >
                  <FontAwesomeIcon icon={Icon.faFilter} />
                </Dropdown>
              </div>
            ),
            dataIndex: ['productPrices', 'level2Price'],
            align: 'right',
            width: 135,
            render: (_, record) => <div>{formatCurrency(record?.productPrices?.level2Price)}</div>,
            editable: 'true',
            inputType: PRODUCT_INPUT_TYPE.CURRENCY,
          },
          //Giá cấp 3
          {
            title: (
              <div className="title-table">
                {t('product.tableTitle.priceLevel3')}
                <Dropdown
                  overlayClassName="dropdown-overlay"
                  trigger="click"
                  overlay={
                    <FilterLevelPrice
                      onFilter={({ isSpecified, range }) => {
                        filterProductExtra({ priceLevel3: { isSpecified, range } });
                      }}
                    />
                  }
                  placement="bottomRight"
                >
                  <FontAwesomeIcon icon={Icon.faFilter} />
                </Dropdown>
              </div>
            ),
            dataIndex: ['productPrices', 'level3Price'],
            align: 'right',
            width: 135,
            render: (_, record) => <div>{formatCurrency(record?.productPrices?.level3Price)}</div>,
            editable: 'true',
            inputType: PRODUCT_INPUT_TYPE.CURRENCY,
          },
          //Giá cấp 4
          {
            title: (
              <div className="title-table">
                {t('product.tableTitle.priceLevel4')}
                <Dropdown
                  overlayClassName="dropdown-overlay"
                  trigger="click"
                  overlay={
                    <FilterLevelPrice
                      onFilter={({ isSpecified, range }) => {
                        filterProductExtra({ priceLevel4: { isSpecified, range } });
                      }}
                    />
                  }
                  placement="bottomRight"
                >
                  <FontAwesomeIcon icon={Icon.faFilter} />
                </Dropdown>
              </div>
            ),
            dataIndex: ['productPrices', 'level4Price'],
            align: 'right',
            width: 135,
            render: (_, record) => <div>{formatCurrency(record?.productPrices?.level4Price)}</div>,
            editable: 'true',
            inputType: PRODUCT_INPUT_TYPE.CURRENCY,
          },
          //Bảo hành
          {
            title: t('product.tableTitle.warranty'),
            dataIndex: 'warranty',
            width: 100,
            editable: 'false',
          },
          //Tồn thực
          {
            title: t('product.tableTitle.inStock'),
            children: renderChildrenInStock(warehouses),
          },
        ]),
    //Tồn kho
    ...(useInModal
      ? [
          {
            title: (
              <div className="title-table">
                {t('product.tableTitle.inStock')}
                {isSelectingProducts() && (
                  <Dropdown
                    overlayClassName="dropdown-overlay"
                    trigger="click"
                    overlay={
                      <FilterRealStocks onFilter={filterRealStocks} warehouseID={warehouseID} />
                    }
                    placement="bottomRight"
                  >
                    <FontAwesomeIcon icon={Icon.faFilter} />
                  </Dropdown>
                )}
              </div>
            ),
            align: 'right',
            width: 100,
            editable: 'false',
            render: (_, record) => <div>{record?.stocks?.at(0).quantity || '- -'}</div>,
          },
        ]
      : []),
    //Xuất vat
    {
      title: (
        <div className="title-table">
          {t('product.tableTitle.exportedVAT')}
          {isSelectingProducts() && (
            <Dropdown
              overlayClassName="dropdown-overlay"
              trigger="click"
              overlay={<FilterVAT onFilter={filterProductExtra} />}
              placement="bottomRight"
            >
              <FontAwesomeIcon icon={Icon.faFilter} />
            </Dropdown>
          )}
        </div>
      ),
      dataIndex: 'vat',
      width: 130,
      align: 'center',
      render: (_, record) => (record.vat ? <SvgIcon.SuccessIcon /> : <SvgIcon.ErrorIcon />),
      editable: 'true',
      inputType: PRODUCT_INPUT_TYPE.VAT,
    },
  ];

  function filterUserByText([text]) {
    if (text[0] === ' ') {
      return;
    }

    let newParams = {
      ...params,
      filters: {
        query: text.length > 0 ? text : null,
      },
    };
    setParams(newParams);
    buildQueryString({
      params: newParams.filters,
    });
    setCurrentActived('all');
  }

  //Filter user by text
  const filterProductByTextDebounced = debounce(filterUserByText, 500);

  const fetchProducts = async () => {
    await refetch(params).then((res) => {
      setProducts(res.data.product.pagination.products);
      setAllProducts(res.data.product.pagination.products);
      setTotal(res.data.product.pagination.paginationData.total);
    });
  };

  //edit functions
  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    if (editingKey === '') {
      form.setFieldsValue({
        shortCode: null,
        productPrices: null,
        vat: null,
        ...record,
      });
      setEditingKey(record.id);
    }
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (productID) => {
    try {
      const row = await form.validateFields();

      await handleUpdateProduct({
        productID: productID,
        shortCode: row.shortCode,
        vat: row.vat,
        prices: row.productPrices,
      });
      notify.success({
        message: t('product.validateMessage.updateSuccess'),
      });
      await refetchProduct();
      setEditingKey('');
    } catch (errInfo) {
      notify.error({
        message: t('product.validateMessage.updateError'),
        description: errInfo?.message,
      });
    }
  };

  //Append On Cell To Editable Column
  //Using recursion
  const mapColumns = (col) => {
    if (col.editable === 'false') {
      return col;
    }

    const newCol = {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
    if (col.children) {
      newCol.children = col.children.map(mapColumns);
    }
    return newCol;
  };

  const mergedColumns = columns.map(mapColumns);

  function filterProductByCategoryId(id) {
    if (isEqual([id], params.filters.categoryIDs)) {
      return;
    }
    _setParams({
      ...params,
      filters: {
        ...params.filters,
        categoryIDs: [id],
      },
    });
    return;
  }

  useEffect(() => {
    fetchProducts();
  }, [params]);

  function handleChangeProductSelected(value) {
    setCurrentActived(value);
    if (value === 'all') {
      setProducts(allProducts);
      return;
    }
    setProducts(null);
    return;
  }

  const handleOnScroll = (e, element) => {
    const scrollHeight = element.scrollHeight;
    const currentHeight = Math.ceil(e.target.scrollTop + element.clientHeight);
    if (
      currentHeight >= scrollHeight &&
      productsRef.current !== null &&
      productsRef.current.length < totalRef.current
    ) {
      fetchMore({
        variables: {
          ...paramsRef.current,
          pagination: { limit: 10, offset: productsRef.current.length },
        },
      }).then((fetchMoreResult) => {
        if (!fetchMoreResult.data.product.pagination.products) return;
        const allProducts = [
          ...productsRef.current,
          ...fetchMoreResult.data.product.pagination.products,
        ];
        setProducts(allProducts);
        setAllProducts(allProducts);
      });
    }
  };

  function initSelectedProducts() {
    setSelectedRowKeys(defaultSelectedProducts?.map((item) => item?.product?.id));
    setSelectedRows(defaultSelectedProducts?.map((item) => item?.product));
  }

  function toggleChangeSellerModalVisible() {
    setChangeSellerModalVisible(!changeSellerModalVisible);
  }

  function isSelectingProducts() {
    if (currentActived === 'all') {
      return true;
    }
    return false;
  }
  useEffect(() => {
    if (isMounted === true && canViewProduct === true) {
      const element = document.getElementsByClassName('ant-table-body')[0];
      element.addEventListener('scroll', (e) => handleOnScroll(e, element));
      return () => {
        element.removeEventListener('scroll', (e) => handleOnScroll(e, element));
      };
    } else {
      setIsMounted(true);
    }
  }, [isMounted, canViewProduct]);

  useEffect(() => {
    initSelectedProducts();
  }, []);

  useEffect(() => {
    _setParams({
      filters: {
        query: getQuery().query || null,
        categoryIDs: [],
      },
      pagination: {
        limit: 10,
        offset: 0,
      },
      warehouseIDs: warehouseID ? [warehouseID] : [],
    });
  }, [warehouseID]);

  useEffect(() => {
    if (useInModal) {
      setSelectedRows([]);
      setSelectedRowKeys([]);
    }
  }, [resetSelectedRows]);

  return (
    <>
      {loadUserPermissions ? (
        <Spinner loading={loadUserPermissions} />
      ) : canViewProduct ? (
        <div className="product-container">
          {useInModal || (
            <>
              <PageHeader pageTitle="Danh sách sản phẩm" />
              <div>
                <CategoriesFilter levelLimit={3} onSelect={filterProductByCategoryId} />
              </div>
            </>
          )}
          <div className="filter-box">
            <div className="search-input">
              {isSelectingProducts() && (
                <Input
                  className="custom-input"
                  prefix={<FontAwesomeIcon icon={Icon.faSearch} />}
                  placeholder="Tìm kiếm nhanh theo Mã sản phẩm, Tên sản phẩm, Mã ngắn"
                  onChange={(e) => {
                    filterProductByTextDebounced(e.target.value);
                  }}
                  allowClear={true}
                  defaultValue={params.filters.query}
                />
              )}
            </div>

            {useInModal && (
              <SelectionFilter
                onChange={handleChangeProductSelected}
                selected={selectedRows?.length}
                currentActived={currentActived}
              />
            )}
            {useInModal || (
              <>
                <Button
                  className="create-cart-btn"
                  onClick={() => toggleChangeSellerModalVisible()}
                >
                  {t('cart.create.createNewCart')}
                </Button>
                {changeSellerModalVisible && (
                  <CustomModalChangeSeller
                    action="addCartFromProduct"
                    selectedProducts={selectedRowKeys}
                    onCancel={() => {
                      setChangeSellerModalVisible(false);
                    }}
                  />
                )}
              </>
            )}
          </div>
          {isSelectingProducts() && (
            <TagsList
              listFilter={params.filters}
              dataManufactures={dataManufactures}
              loadingManufactures={loadingManufactures}
              dataWarehouses={warehouses}
              loadingWarehouses={loadingWarehouses}
              params={params}
              setParams={setParams}
            />
          )}

          <Form form={form} component={false}>
            <CustomTable
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              id="scroll-content"
              rowSelection={{
                type: selectionType,
                ...rowSelection,
              }}
              rowKey={(record) => record?.id}
              columns={mergedColumns}
              dataSource={products || selectedRows}
              scroll={{ x: 800, y: 'calc(100vh - 382px)' }}
              loading={loading}
              rowClassName={{ marginBottom: 0 }}
            />
          </Form>
        </div>
      ) : (
        <Page403 />
      )}
    </>
  );
};

export default ProductList;
