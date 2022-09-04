import { Button, DatePicker, Menu, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from 'assets/icons';
import moment from 'moment';
import { formatDateTime, getTimestampByDate } from 'utils/dateTime';
import { DATE_FORMAT } from 'config/constants';
import { getQuery } from 'utils/helperFuncs';
import { parseMomentDate } from 'utils/dateTime';

const SAME_DAY_INTERVAL = 0;

const FilterMenu = ({ params, setParams, filterTags, setFilterTags }) => {
  const GET_QUERY = getQuery();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const today = moment();
  const [value, setValue] = useState([]);

  const thisDay = [parseMomentDate(today), parseMomentDate(today)];

  const yesterday = [parseMomentDate(today.add(-1, 'days')), parseMomentDate(today)];

  const thisWeek = [parseMomentDate(today.startOf('week')), parseMomentDate(today.endOf('week'))];

  const lastWeek = [
    parseMomentDate(today.subtract(1, 'weeks').startOf('weeks')),
    parseMomentDate(today.endOf('weeks')),
  ];

  const thisMonth = [
    parseMomentDate(today.startOf('month')),
    parseMomentDate(today.endOf('month')),
  ];

  const lastMonth = [
    parseMomentDate(today.subtract(1, 'months').startOf('month')),
    parseMomentDate(today.endOf('month')),
  ];

  const renderRangerPicker = () => {
    return (
      <>
        {value.length !== 0
          ? value[0].diff(value[1])
            ? `${formatDateTime(value[0], DATE_FORMAT)} - ${formatDateTime(value[1], DATE_FORMAT)}`
            : `${formatDateTime(value[0], DATE_FORMAT)}`
          : ''}
      </>
    );
  };

  const onCancel = () => setValue([]);

  const onConfirm = () => {
    if (value.length !== 0) {
      if (value[0].diff(value[1]) === SAME_DAY_INTERVAL) {
        setParams({
          ...params,
          filters: {
            ...params.filters,
            timeRange: { from: getTimestampByDate(value[0]) },
          },
        });
        setFilterTags({
          ...filterTags,
          timeRange: { from: getTimestampByDate(value[0]) },
        });
      } else {
        setParams({
          ...params,
          filters: {
            ...params.filters,
            timeRange: {
              from: getTimestampByDate(value[0]),
              to: getTimestampByDate(value[1]),
            },
          },
        });
        setFilterTags({
          ...filterTags,
          timeRange: { from: getTimestampByDate(value[0]), to: getTimestampByDate(value[1]) },
        });
      }
    }
  };

  const onChange = (value) => {
    setValue(value);
  };

  useEffect(() => {
    if (GET_QUERY.from) {
      if (GET_QUERY.to) {
        setValue([parseMomentDate(GET_QUERY.from), parseMomentDate(GET_QUERY.to)]);
      } else {
        setValue([parseMomentDate(GET_QUERY.from), parseMomentDate(GET_QUERY.from)]);
      }
    } else {
      setValue([]);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Button onClick={() => setIsOpen(!isOpen)}>
        <FontAwesomeIcon icon={Icon.faFilter} style={{ marginRight: '16px' }} />
        {t('order.orderList.dateCreated')}
      </Button>
      <DatePicker.RangePicker
        style={{ visibility: 'hidden', width: 0, padding: 0, margin: 0, height: 0, border: 0 }}
        open={isOpen}
        value={value}
        onOpenChange={(isOpen) => setIsOpen(isOpen)}
        dropdownClassName="menu-select-range-picker"
        onChange={onChange}
        panelRender={(originalPanel) => {
          return (
            <>
              <Menu mode="inline" defaultSelectedKeys="option">
                <Menu.Item key="today" onClick={() => setValue(thisDay)}>
                  {t('common.today')}
                </Menu.Item>
                <Menu.Item key="yesterday" onClick={() => setValue(yesterday)}>
                  {t('common.yesterday')}
                </Menu.Item>
                <Menu.Item key="this-week" onClick={() => setValue(thisWeek)}>
                  {t('common.thisWeek')}
                </Menu.Item>
                <Menu.Item key="last-week" onClick={() => setValue(lastWeek)}>
                  {t('common.lastWeek')}
                </Menu.Item>
                <Menu.Item key="this-month" onClick={() => setValue(thisMonth)}>
                  {t('common.thisMonth')}
                </Menu.Item>
                <Menu.Item key="last-month" onClick={() => setValue(lastMonth)}>
                  {t('common.lastMonth')}
                </Menu.Item>
                <Menu.Item key="option">{t('common.option')}</Menu.Item>
              </Menu>
              <Space>
                {originalPanel}
                <div className="buttons">
                  {renderRangerPicker()}
                  <Button onClick={onCancel}>{t('common.cancel')}</Button>
                  <Button onClick={onConfirm} type="primary">
                    {t('common.confirm')}
                  </Button>
                </div>
              </Space>
            </>
          );
        }}
      />
    </div>
  );
};

export default FilterMenu;
