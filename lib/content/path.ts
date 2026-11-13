/*
 * Dashboard fields can point inside an entry with a dotted name, e.g. "islands.resorts" for an
 * atoll's resort list. These read and write such paths without mutating the original object.
 */

type Obj = Record<string, unknown>;

export function getPath(obj: unknown, path: string): unknown {
  let cur: unknown = obj;
  for (const part of path.split(".")) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Obj)[part];
  }
  return cur;
}

/** Returns a copy of `obj` with `path` set to `value` (or removed when value is undefined). */
export function setPath<T extends Obj>(obj: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split(".");
  const copy = { ...obj } as Obj;
  if (!rest.length) {
    if (value === undefined) delete copy[head];
    else copy[head] = value;
    return copy as T;
  }
  const child = copy[head] && typeof copy[head] === "object" && !Array.isArray(copy[head]) ? (copy[head] as Obj) : {};
  copy[head] = setPath(child, rest.join("."), value);
  return copy as T;
}
