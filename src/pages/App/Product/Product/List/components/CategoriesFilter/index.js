import React, { useState, useRef } from 'react';
import './index.scss';
import { useGetCategoriesLevel } from 'hooks/category/category';
import { Icon, FontAwesomeIcon } from 'assets/icons';
import { Tooltip } from 'antd';

const CategoriesFilter = ({ onSelect, levelLimit }) => {
  const categoriesContainer = useRef(null);
  const [currentActived, setCurrentActived] = useState({
    level1: '',
    level2: '',
    level3: '',
    level4: '',
    level5: '',
  });
  const [finalActived, setFinalActived] = useState('');
  const { categories } = useGetCategoriesLevel({
    levels: [1],
  });

  const level1List = categories?.map((level1) => ({
    label: level1?.name,
    value: level1?.id,
    level2: level1?.children?.map((level2) => ({
      label: level2?.name,
      value: level2?.id,
      level3: level2?.children?.map((level3) => ({
        label: level3?.name,
        value: level3?.id,
      })),
    })),
  }));

  function scrollToLeft() {
    if (categoriesContainer) {
      categoriesContainer.current.scrollLeft -= 100;
    }
  }

  function scrollToRight() {
    if (categoriesContainer) {
      categoriesContainer.current.scrollLeft += 100;
    }
  }

  function selectCurrentActived({ value, level }) {
    setCurrentActived({
      ...currentActived,
      [`level${level}`]: currentActived[`level${level}`] === value ? '' : value,
    });
    setFinalActived(value);
    onSelect && onSelect(value);
  }

  return (
    <div className="categories-container">
      <div className="left-arrow" onClick={scrollToLeft}>
        <Icon.CustomIcon icon={Icon.faChevronLeft} />
      </div>

      <div className="right-arrow" onClick={scrollToRight}>
        <Icon.CustomIcon icon={Icon.faChevronRight} />
      </div>

      <div ref={categoriesContainer} className="list-category">
        {level1List?.map((level1, index) => (
          <div className="level1-list" key={index}>
            <Tooltip title={level1?.label}>
              <div
                className={`level1-item category-item ${
                  finalActived === level1?.value && 'final-actived'
                }`}
                onClick={() => selectCurrentActived({ value: level1?.value, level: 1 })}
              >
                {level1?.label}
              </div>
            </Tooltip>
            <div
              className={`level2-list ${
                currentActived.level1 === level1?.value ? 'list-opened' : 'list-closed'
              }`}
            >
              {level1?.level2?.length > 0 && (
                <FontAwesomeIcon className="expand-icon" icon={Icon.faCaretRight} />
              )}
              {level1?.level2?.map((level2, index) => (
                <React.Fragment key={index}>
                  <Tooltip title={level2?.label}>
                    <div
                      className={`level2-item category-item ${
                        finalActived === level2?.value && 'final-actived'
                      }`}
                      onClick={() => selectCurrentActived({ value: level2?.value, level: 2 })}
                    >
                      {level2?.label}
                    </div>
                  </Tooltip>
                  <div
                    className={`level3-list ${
                      currentActived.level2 === level2?.value ? 'list-opened' : 'list-closed'
                    }`}
                  >
                    {level2?.level3?.length > 0 && (
                      <FontAwesomeIcon className="expand-icon" icon={Icon.faCaretRight} />
                    )}
                    {level2?.level3?.map((level3, index) => (
                      <React.Fragment key={index}>
                        <Tooltip title={level3?.label}>
                          <div
                            className={`level3-item category-item ${
                              finalActived === level3?.value && 'final-actived'
                            }`}
                            onClick={() => selectCurrentActived({ value: level3?.value, level: 3 })}
                          >
                            {level3?.label}
                          </div>
                        </Tooltip>
                        <div
                          className={`level4-list ${
                            currentActived.level3 === level3?.value ? 'list-opened' : 'list-closed'
                          }`}
                        >
                          {level3?.level4?.length > 0 && (
                            <FontAwesomeIcon className="expand-icon" icon={Icon.faCaretRight} />
                          )}
                          {level3?.level4?.map((level4, index) => (
                            <React.Fragment key={index}>
                              <Tooltip title={level4?.label}>
                                <div
                                  className={`level4-item category-item ${
                                    finalActived === level4?.value && 'final-actived'
                                  }`}
                                  onClick={() =>
                                    selectCurrentActived({ value: level4?.value, level: 4 })
                                  }
                                >
                                  {level4?.label}
                                </div>
                              </Tooltip>
                              <div
                                className={`level5-list ${
                                  currentActived.level4 === level4?.value
                                    ? 'list-opened'
                                    : 'list-closed'
                                }`}
                              >
                                {level4?.level5?.length > 0 && (
                                  <FontAwesomeIcon
                                    className="expand-icon"
                                    icon={Icon.faCaretRight}
                                  />
                                )}
                                {level4?.level5?.map((level5, index) => (
                                  <Tooltip title={level5?.label} key={index}>
                                    <div
                                      className={`level5-item ategory-item ${
                                        finalActived === level5?.value && 'final-actived'
                                      }`}
                                      onClick={() =>
                                        selectCurrentActived({
                                          value: level5?.value,
                                          level: 5,
                                        })
                                      }
                                    >
                                      {level5?.label}
                                    </div>
                                  </Tooltip>
                                ))}
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesFilter;
