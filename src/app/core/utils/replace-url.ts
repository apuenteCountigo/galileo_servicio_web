export const replaceUrl = (newUrl: string, oldUrl: string, baseUrl: string) => {
  const temp = oldUrl.split(baseUrl);
  return newUrl + temp[1];
};
