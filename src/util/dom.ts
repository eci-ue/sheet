export const isDescendant = function(container: HTMLElement, target: HTMLElement) {
  if (!container || !target) {
    return false;
  }
  // IE6-IE10 以及所有现代浏览器都支持 contains
  // contains() 返回 true 代表：
  // 1. target === container
  // 2. target 是 container 任意层级子节点
  return container.contains(target);
}

export const parents = function (el: HTMLElement, selector: string) {
  const result = [];
  let parent = el.parentElement;
  while (parent) {
    if (parent.matches(selector)) {
      result.push(parent);
    }
    parent = parent.parentElement;
  }
  return result;
}
