/**
 * @file 数字
 * @author svon.me@gmail.com
 **/

import {Editor as TextAreaEditor} from "../text/editor";

export default class InputNumber extends TextAreaEditor {
  public eventBind(element: HTMLTextAreaElement) {
    super.eventBind(element);
    // 监听输入框
    element.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      let value = String(target.value || "").trim();
      // 只允许数字和小数点
      value = value.replace(/[^0-9.]/g, '');
      // 保证最多只出现一个小数点
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
      target.value = value;
    });
  }
}