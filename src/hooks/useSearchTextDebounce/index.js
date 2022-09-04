import { debounce, buildQueryString } from 'utils/helperFuncs';

const useSearchTextDebounce = (params, setParams, key = 'fullTextSearch') => {
  function filterByText([text]) {
    if (text[0] === ' ') {
      return;
    }

    let newParams = {
      ...params,
      offset: 0,
      [`${key}`]: text.length > 0 ? text : null,
    };
    setParams(newParams);
    buildQueryString({
      params: newParams,
    });
  }

  const filterByTextDebounced = debounce(filterByText, 500);

  const onChange = (e) => filterByTextDebounced(e.target.value);

  const onSearch = (value) => filterByTextDebounced(value);

  return {
    onChange,
    onSearch,
  };
};

export default useSearchTextDebounce;
