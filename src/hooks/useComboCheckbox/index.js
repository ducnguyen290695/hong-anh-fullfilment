import { useState } from 'react';

function useComboCheckbox(options, defaultValues) {
  const [checkedList, setCheckedList] = useState(defaultValues);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  const onChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < options.length);
    setCheckAll(list.length === options.length);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? options.map((option) => option.value) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const onResetFilter = () => {
    setCheckedList(defaultValues);
    setIndeterminate(false);
    setCheckAll(false);
  };

  return {
    checkedList,
    indeterminate,
    checkAll,
    options,
    onChange,
    onCheckAllChange,
    onResetFilter,
  };
}

export default useComboCheckbox;
