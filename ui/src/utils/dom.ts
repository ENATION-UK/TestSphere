/**
 * 测试目标元素是否存在某(些)类名
 * @param target
 * @param classes
 */
export const hasClass = (target: HTMLElement, classes: string | Array<string>): boolean => {
  const eleClasses = target.classList
  if (!eleClasses || eleClasses.length === 0) return false
  if (typeof classes === 'string') {
    classes = [classes]
  }
  for (let i = 0; i < classes.length; i++) {
    const className = classes[i]
    if (eleClasses.contains(className)) {
      return true
    }
  }
  return false
}

/**
 * 是否点击了类，往上查找
 * @param e
 * @param classes
 */
export const isClickClass = (e: MouseEvent, classes: string | Array<string>): boolean => {
  const paths = e.composedPath()
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i] as HTMLDivElement
    if (hasClass(path, classes)) {
      return true
    }
  }

  return false
}

/**
 * 获取所有兄弟元素
 * @param ele
 */
export const getAllSiblingNodes = (ele: Element): HTMLElement[] => {
  const siblings: HTMLElement[] = []
  const parent = ele.parentElement
  if (!parent) return []
  for (let i = 0; i < parent.children.length; i++) {
    const el = parent.children[i]
    if (el !== ele) {
      siblings.push(el as HTMLElement)
    }
  }
  return siblings
}

/**
 * 向上查找
 * @param ele
 * @param className
 */
export function findEleFromParent(ele: HTMLElement, className: string): HTMLElement | void {
  if (hasClass(ele, className)) {
    return ele
  } else if (ele.parentElement) {
    return findEleFromParent(ele.parentElement, className)
  }
}

/**
 * 获取元素上绑定的数据
 * @param ele
 * @param key
 */
export function getEleBindData(ele: HTMLElement, key: string): string | void {
  return ele.dataset[key.toLowerCase()]
}
