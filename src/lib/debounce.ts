export const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let to: ReturnType<typeof setTimeout> | undefined;

  return (...args: any[]) => {
    if (to != undefined) clearTimeout(to);

    to = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
