function flatten<T>(arr: T[][]): T[] {
  return ([] as T[]).concat(...arr);
}

export { flatten };
