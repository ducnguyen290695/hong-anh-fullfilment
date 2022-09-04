import React, { useState, useEffect } from 'react';
import { Select, Tree } from 'antd';
import { useGetCategoriesLevel } from 'hooks/category/category';
import Spinner from 'components/Spinner';
import { useGetSellerLevels } from 'hooks/seller';
import './index.scss';

const SellCategories = ({ onChange, seller, isSellerDetail }) => {
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [checkedList, setCheckedList] = useState([]);

  const { categories, loading } = useGetCategoriesLevel({
    levels: [1],
  });
  const { sellerLevels } = useGetSellerLevels();

  const renderTitleTree = (id, name, children) =>
    children.length ? (
      name
    ) : (
      <div key={id} className="checkbox-item">
        <p className="checkbox-title">{name}</p>
        <Select
          className="seller-level"
          onChange={(level) =>
            handleSelectChange({
              level,
              id,
            })
          }
          defaultValue={getLevelById(id) || 1}
          options={sellerLevels?.map(({ level, name }) => ({
            label: name,
            value: level,
          }))}
        />
      </div>
    );

  const treeData = categories?.map(({ id, name, children }) => ({
    title: renderTitleTree(id, name, children),
    key: id,
    children: children?.map(({ id, name, children }) => ({
      title: renderTitleTree(id, name, children),
      key: id,
      children: children?.map(({ id, name, children }) => ({
        title: renderTitleTree(id, name, children),
        key: id,
      })),
    })),
  }));

  function getLevelById(id) {
    let foundItem = seller?.fullSaleCategories?.find((item) => item?.category?.id === id);
    return foundItem?.level;
  }

  function initDefaultCheckedList() {
    let foundItems = seller?.fullSaleCategories
      ?.filter((item) => item?.checked)
      ?.map(({ category, level }) => ({
        id: category?.id,
        level,
        checked: true,
      }));

    setCheckedList(foundItems);
    onChange?.(foundItems);
  }

  function initDefaultCheckedKeys() {
    let foundCheckedKeys = seller?.fullSaleCategories
      ?.filter((item) => item?.checked)
      ?.map((item) => item?.category?.id);

    setCheckedKeys(foundCheckedKeys);
  }

  function findItemIndex(array, id) {
    let foundIndex = -1;
    for (let i = 0; i < array?.length; i++) {
      if (array[i]?.id === id) {
        foundIndex = i;
        break;
      }
    }
    return foundIndex;
  }

  function onCheck(checkedKeysValue, info) {
    const id = info?.node?.key;
    const level = info?.node?.title?.props?.children[1]?.props?.defaultValue;
    let newCheckedList = checkedList?.filter((item) => checkedKeysValue?.includes(item?.id));
    const itemIndex = findItemIndex(newCheckedList, id);

    if (itemIndex !== -1) {
      setCheckedList([
        ...newCheckedList?.slice(0, itemIndex),
        {
          id,
          level: newCheckedList[itemIndex]?.level || level,
          checked: info?.checked,
        },
        ...newCheckedList?.slice(itemIndex + 1, newCheckedList?.length),
      ]);
    } else {
      setCheckedList([
        ...newCheckedList,
        {
          id,
          level: newCheckedList[itemIndex]?.level || level,
          checked: info?.checked,
        },
      ]);
    }
    setCheckedKeys(checkedKeysValue);
  }

  function handleSelectChange({ level, id }) {
    const itemIndex = findItemIndex(checkedList, id);
    if (itemIndex !== -1) {
      setCheckedList([
        ...checkedList?.slice(0, itemIndex),
        {
          id,
          level,
          checked: checkedList[itemIndex]?.checked,
        },
        ...checkedList?.slice(itemIndex + 1, checkedList?.length),
      ]);
    } else {
      setCheckedList([
        ...checkedList,
        {
          id,
          level,
          checked: true,
        },
      ]);
    }
    setCheckedKeys([...checkedKeys, id]);
  }

  useEffect(() => {
    initDefaultCheckedKeys();
  }, [seller]);

  useEffect(() => {
    onChange?.(checkedList);
  }, [checkedList]);

  useEffect(() => {
    isSellerDetail && initDefaultCheckedList();
  }, [seller]);

  return (
    <div className="sell-categories">
      <Spinner loading={loading} />
      <div className="sell-categories-content">
        <Tree
          checkable
          selectable={true}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          treeData={treeData}
          defaultExpandAll={true}
        />
      </div>
    </div>
  );
};

export default SellCategories;
