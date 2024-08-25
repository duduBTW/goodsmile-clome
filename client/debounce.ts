export function debounce(callback: () => void, ms?: number) {
  let timeout: NodeJS.Timeout;

  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback();
    }, ms);
  };
}
