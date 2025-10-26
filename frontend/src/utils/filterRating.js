export default function (items, rating) {
  if (!items || !Array.isArray(items)) return [];
  return items.filter((item) => item.rate >= rating);
}
