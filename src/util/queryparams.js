import 'server-only';

export function getQueryParams(filter, page, size) {
  const filteredParams = Object.entries({
    ...filter,
    page: page - 1, // El backend utiliza índice de página 0
    size,
  }).reduce((acc, [key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

  return new URLSearchParams(filteredParams).toString();
}