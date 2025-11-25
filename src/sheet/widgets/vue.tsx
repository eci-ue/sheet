/**
 * @file Radio
 * @author svon.me@gmail.com
 **/

import $ from "jquery";
import {CreateApp} from "src/utils/vue";
import {h, ref, defineComponent} from "vue";
import Config from "src/bootstrap/config.vue";

import type {App, Component, VNode, AsyncComponentLoader} from "vue";
import type {EditContext, RectProps, IEditor} from '@visactor/vtable-editors';

export default abstract class VNodeEditor implements IEditor {
  private app?: App;
  private element?: HTMLDivElement;
  private rect?: RectProps;
  private container?: HTMLElement;
  private currentValue?: string;

  getValue(): string | undefined {
    return this.currentValue;
  }

  setValue(value?: string): void {
    this.currentValue = value;
  }

  onEnd(): void {
    if (this.app) {
      this.app.unmount();
      this.app = void 0;
    }
    if (this.container && this.element) {
      this.container.removeChild(this.element)
      this.element = void 0;
    }
  }

  onStart(context: EditContext<any, any>): void {
    const {
      value, // 单元格数据
      container,  // table 容器
      referencePosition, // 单元格矩阵数据
    } = context
    this.setValue(value);
    this.container = container;
    this.rect = referencePosition?.rect;
    this.createElement();
  }

  isEditorElement(target: HTMLElement): boolean {
    // 判断点击的对象是否为 element 的子元素
    const list = $(target).closest(this.element!);
    if (list.length > 0) {
      return true;
    }
    const popper = $(target).parents(".el-popper");
    return popper.length > 0;
  }

  adjustPosition(rect?: RectProps) {
    if (this.element && rect) {
      this.element.style.left = `${rect.left}px`;
      this.element.style.top = `${rect.top}px`;
      this.element.style.width = `${rect.width}px`;
      this.element.style.height = `${rect.height}px`;
    }
  }

  private createElement() {
    const div = document.createElement('div')
    div.style.position = 'absolute';
    div.style.padding = '0px';
    div.style.boxSizing = 'border-box';
    div.style.zIndex = '100';
    this.container?.appendChild(div);
    this.element = div;
    this.adjustPosition(this.rect);
    this.createApp()
  }

  // vue 组件所需 props 值
  abstract vNodeProps(): object;

  // vue 视图组件
  abstract vNode(): Component | VNode | AsyncComponentLoader;

  // 挂载 Vue 对象
  private createApp() {
    const self = this;
    const vNode = this.vNode();
    const props = this.vNodeProps();
    const component: Component = defineComponent({
      name: "Editor",
      setup() {
        const currentValue = ref<string | undefined>(self.getValue());
        const onChange = (value?: string) => {
          self.setValue(value);
          currentValue.value = value;
        }
        // watchEffect(() => {
        //   currentValue.value = self.getValue()
        // });
        return () => {
          if (vNode) {
            return h(Config, {}, [
              h(vNode, {
                ...props,
                "value": currentValue.value,
                onChange,
              })
            ]);
          } else {
            return h("span", {}, []);
          }
        }
      }
    });
    this.app = CreateApp(component, this.element);
  }
}