import { FORM_TYPE } from 'config/constants';
import React from 'react';
import CreateProductGroup from '../Create';

const ProductGroupDetail = () => {
  return <CreateProductGroup type={FORM_TYPE.DETAIL} />;
};

export default ProductGroupDetail;
