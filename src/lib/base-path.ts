export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(pathname: string) {
  if (!pathname) return "";
  if (!basePath) return pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${basePath}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function imagePath(filename: string) {
  if (!filename) return "";
  const cleanName = filename.startsWith("/") ? filename : `/${filename}`;
  return cleanName;
}
