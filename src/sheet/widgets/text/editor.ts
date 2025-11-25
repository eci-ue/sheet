import safeGet from "@fengqiaogang/safe-get";
import {TextAreaEditor} from "@visactor/vtable-editors";

import type {EditContext} from "@visactor/vtable-editors";

export class Editor extends TextAreaEditor {
  // 事件绑定
  public eventBind(element: HTMLTextAreaElement) {
    element.addEventListener('paste', (e: Event) => {
      e.stopPropagation();
    });
    element.addEventListener('keydown', (e: KeyboardEvent) => {
      // 允许 Ctrl+A / Ctrl+C / Ctrl+V / Ctrl+X / Ctrl+Z / Ctrl+Y
      const code = safeGet<number>(e, "keyCode") || 0;
      const ctrl = e.ctrlKey || e.metaKey;
      //            A   C   V   X   Z   Y
      const keys = [65, 67, 86, 88, 90, 89];
      if (ctrl && keys.includes(code)) {
        e.stopPropagation();
      }
    });

    element.addEventListener('focus', (e: Event) => {
      const input = e.target as HTMLInputElement;
      const text = String(input.value || "");
      const len = text.length;
      input.setSelectionRange(len, len);
    });

    element.addEventListener('keydown', (e: KeyboardEvent) => {
      // 当按下 Ctrl + Enter 时
      if (e.key === 'Enter' && e.ctrlKey) {
        // 既然无法依赖默认行为，我们就自己实现它
        e.preventDefault();  // 阻止任何可能发生的其他默认行为
        e.stopPropagation(); // 阻止事件传播

        const textarea = this.element as HTMLTextAreaElement;
        const start = textarea.selectionStart; // 获取光标起始位置
        const end = textarea.selectionEnd;     // 获取光标结束位置
        const value = textarea.value;

        // 在光标位置插入换行符
        textarea.value = value.substring(0, start) + '\n' + value.substring(end);

        // 将光标移动到换行符之后
        const newCursorPosition = start + 1;
        textarea.selectionStart = newCursorPosition;
        textarea.selectionEnd = newCursorPosition;

        // 不需要 return，因为我们已经处理完毕
      }
    });
  }

  onStart(context: EditContext<string>): void {
    super.onStart(context);
    if (!this.element) {
      return;
    }
    const newElement = this.element.cloneNode(true) as HTMLTextAreaElement;
    this.element.parentNode?.replaceChild(newElement, this.element);
    this.element = newElement;
    this.eventBind(this.element);
    this.element.focus();
  }
}