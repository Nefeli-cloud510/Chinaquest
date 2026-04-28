export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(pathname: string) {
  if (!basePath) return pathname;
  if (!pathname) return basePath;
  return `${basePath}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

