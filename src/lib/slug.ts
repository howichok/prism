export function slugifyText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function buildUserHandle(source: string, suffix?: string) {
  const base = slugifyText(source).replace(/-/g, "");
  const safeBase = base || "member";
  const safeSuffix = suffix?.slice(-4).toLowerCase() ?? Math.random().toString(36).slice(2, 6);

  return `${safeBase}-${safeSuffix}`;
}
