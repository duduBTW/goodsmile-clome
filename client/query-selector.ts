export function queryByAttr<T extends Element = Element>(
  root: Pick<Element, "querySelector"> | undefined,
  name: string,
  value?: string | number | null
) {
  let selector = `[${name}`;

  if (typeof value !== "undefined") {
    selector += `="${value}"`;
  }

  selector += "]";

  const element = root?.querySelector(selector);
  if (!element) {
    return;
  }

  return element as T;
}

export function queryAllByAttr<T extends Element = Element>(
  root: Pick<Element, "querySelectorAll"> = document,
  name: string,
  value?: string | number | null | undefined
) {
  let selector = `[${name}`;

  if (typeof value !== "undefined") {
    selector += `="${value}"`;
  }

  selector += "]";

  const element = root.querySelectorAll(selector);
  if (!element) {
    return;
  }

  return [...element] as T[];
}
