const sortAndUnique = (arr: number[]) => {
  const sortedArr = arr.sort((a, b) => a - b);
  const re: number[] = [];
  sortedArr.forEach((item) => {
    if (re.length == 0 || re.at(-1) != item) re.push(item);
  });
  return re;
};
export { sortAndUnique };
