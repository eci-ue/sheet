/**
 * @file 单元格样式
 * @author svon.me@gmail.com
 **/

import {ToolbarEvent} from "./config";
import safeGet from "@fengqiaogang/safe-get";

import {Cell} from "../types/sheet";

// 内容格式化
export const format = function (key: string) {
  return function (record: object): string | number | undefined {
    const data = safeGet<object | undefined | string | number>(record, key);
    if (data && typeof data === "object") {
      return safeGet<string>(data, "txt");
    }
    return data as string;
  };
}

// 样式转换
export const StyleValue = function (style: object, type: ToolbarEvent): string | number | boolean | undefined {
  let res: string | number | boolean | undefined;
  const value = safeGet<string | number | boolean>(style, type);
  if (value) {
    switch (type) {
      case ToolbarEvent.Bold:       // 加粗
        res = 700;
        break;
      case ToolbarEvent.Through:    // 中横线
      case ToolbarEvent.Underline:  // 下划线
        res = value;
        break;
      case ToolbarEvent.Italic:     // 倾斜
        res = "italic";
        break;
      case ToolbarEvent.Font:       // 字体颜色
        res = value;
        break;
      case ToolbarEvent.Fill:       // 背景颜色
        res = value;
        break;
    }
  }
  return res;
}

// 自定义样式
export const Style: object = {
  // 字号
  fontSize: () => 14,
  // 文本颜色
  color: function (data: object) {
    const cell = safeGet<Cell>(data, "dataValue");
    const style = safeGet(cell, "style") || {};
    return StyleValue(style, ToolbarEvent.Font) || "black";
  },
  // 加粗
  fontVariant: function (data: object) {
    const cell = safeGet<Cell>(data, "dataValue");
    const style = safeGet(cell, "style") || {};
    return StyleValue(style, ToolbarEvent.Bold) || false;
  },
  // 下划线
  underline: function (data: object) {
    const cell = safeGet<Cell>(data, "dataValue");
    const style = safeGet(cell, "style") || {};
    return StyleValue(style, ToolbarEvent.Underline) || false;
  },
  // 删除线
  lineThrough: function (data: object) {
    const cell = safeGet<Cell>(data, "dataValue");
    const style = safeGet(cell, "style") || {};
    return StyleValue(style, ToolbarEvent.Through) || false;
  },
  // 倾斜
  fontStyle: function (data: object) {
    const cell = safeGet<Cell>(data, "dataValue");
    const style = safeGet(cell, "style") || {};
    return StyleValue(style, ToolbarEvent.Italic) || false;
  },
  // 背景颜色
  bgColor: function (data: object) {
    const cell = safeGet<Cell>(data, "dataValue");
    const style = safeGet(cell, "style") || {};
    return StyleValue(style, ToolbarEvent.Fill);
  },
}