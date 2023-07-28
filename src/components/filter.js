export function filterBy(tasksMap, filterCallback) {
  const filtered = [...tasksMap].filter(filterCallback);
  return new Map(filtered);
}

export function containsText(data, search) {
  const clean = search.trim().toLowerCase();
  return data.toLowerCase().includes(clean);
}
