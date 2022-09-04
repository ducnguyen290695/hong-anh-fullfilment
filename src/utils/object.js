// delete object property
export const omit = (obj, property) => {
  const { [property]: unused, ...rest } = obj;
  return rest;
};
