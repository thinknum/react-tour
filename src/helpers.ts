export function getRectOfElementBySelector(selector: string) {
  if (typeof selector !== 'string') {
    return undefined;
  }

  const element = document.querySelector(selector);
  if (!element) {
    return undefined;
  }

  return element.getBoundingClientRect();
}

/**
 * Find and return the target DOM element based on a step's 'target'.
 *
 * @private
 * @param {string|HTMLElement} element
 *
 * @returns {HTMLElement|null}
 */
export function getElement(element: string | HTMLElement): HTMLElement | null {
  if (typeof element === 'string') {
    return element ? document.querySelector(element) : null;
  }

  return element;
}

/**
 * Find the bounding client rect
 *
 * @private
 * @param {HTMLElement} element - The target element
 * @returns {Object}
 */
export function getClientRect(element: HTMLElement): any {
  if (!element) {
    return {};
  }

  return element.getBoundingClientRect();
}

/**
 * Check if the element is fixed
 * @param {HTMLElement} el
 * @returns {boolean}
 */
export function isFixed(el?: any): boolean {
  if (!el || !(el instanceof HTMLElement)) {
    return false;
  }

  const { nodeName } = el;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }

  if (getStyleComputedProperty(el).position === 'fixed') {
    return true;
  }

  return isFixed(el.parentNode);
}

/**
 *  Get computed style property
 *
 * @param {HTMLElement} el
 *
 * @returns {Object}
 */
export function getStyleComputedProperty(el: HTMLElement): any {
  if (!el || el.nodeType !== 1) {
    return {};
  }

  return getComputedStyle(el);
}