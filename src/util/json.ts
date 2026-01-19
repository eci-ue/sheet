const isWrapped = (value: string, start: string, end: string): boolean => {
  return value.startsWith(start) && value.endsWith(end);
};

export const isArray = function (value: string): boolean {
  const text = String(value).trim();
  if (text.length > 0) {
    return isWrapped(text, '[', ']');
  }
  return false;
}

export const isMap = function (value: string): boolean {
  const text = String(value).trim();
  if (text.length > 0) {
    return isWrapped(text, '{', '}');
  }
  return false;
}

export const isJSON = function (value: string): boolean {
  return isArray(value) || isMap(value);
}

export const toList = function <T = string>(value: string): T[] {
  if (isArray(value)) {
    try {
      const list = JSON.parse(value);
      if (Array.isArray(list)) {
        return list;
      }
    } catch (e) {
    }
    return [];
  }
  // 如果是 Map 对象，则默认为错误数据
  if (isMap(value)) {
    return [];
  }
  return [value as T];
}