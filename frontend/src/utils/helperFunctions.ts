function positonToString(position: [number, number]): string {
  return position.join(",");
}

function filterObj<T extends Record<string, unknown>>(
  obj: T | null,
  filterCallback: (key: string) => boolean,
): T {
  return {
    ...(obj !== null
      ? Object.entries(obj)
          .filter(([k, _]) => filterCallback(k))
          .reduce((prev, [k, v]) => ({ ...prev, [k]: v }), {})
      : {}),
  } as T;
}

export { positonToString, filterObj };
