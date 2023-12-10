export const getBaseUrl = () => {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const protocol = process.env.NEXT_PUBLIC_VERCEL_URL ? 'https://' : 'http://';
  return `${protocol}${base}`;
};

export const convertFullDate = (date: string | Date | undefined) => {
  if (!date) return;
  const options = { day: 'numeric', month: 'long', year: 'numeric' } as const;
  return new Date(date).toLocaleString(undefined, options);
};

export const convertShortDate = (date: string | Date | undefined) => {
  if (!date) return;
  const options = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  } as const;
  return new Date(date).toLocaleDateString(undefined, options);
};