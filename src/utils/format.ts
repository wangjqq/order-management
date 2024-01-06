// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim();
}
export function findLabelsByCodes(codes: any, data: any) {
  const result: any = [];
  function findLabel(code: any, dataSource: any) {
    const item = dataSource.find((item: any) => item.value === code);
    if (item) {
      result.push(item.label);

      if (item.children) {
        findLabel(item.children[0].value, item.children);
      }
    }
  }

  codes.forEach((code: any) => {
    findLabel(code, data);
  });

  return result;
}
