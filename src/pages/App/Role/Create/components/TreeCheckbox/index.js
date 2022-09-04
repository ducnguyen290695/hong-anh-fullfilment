import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import './index.scss';

export default function TreeCheckbox({ treeData, defaultCheckedKeys, onChange }) {
  const [checkedKeys, setCheckedKeys] = useState();

  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
    onChange && onChange(checkedKeysValue);
  };

  useEffect(() => {
    setCheckedKeys(defaultCheckedKeys);
  }, [defaultCheckedKeys]);

  return (
    <Tree
      checkable
      selectable={false}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      treeData={treeData}
      defaultExpandAll={true}
    />
  );
}
