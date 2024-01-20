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

export function formatBytes(bytes: string, decimals = 2) {
  // 将字符串数字转换为数值类型
  const numericBytes = parseFloat(bytes);

  if (isNaN(numericBytes)) {
    // 如果转换失败，返回错误信息
    return '异常大小';
  }

  if (numericBytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(numericBytes) / Math.log(k));

  return (
    parseFloat((numericBytes / Math.pow(k, i)).toFixed(decimals)) +
    ' ' +
    sizes[i]
  );
}
