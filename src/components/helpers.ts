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