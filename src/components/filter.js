export function filterBy(contacts, filterCallback) {
  return contacts.filter(filterCallback);
}

export function containsText(data, search) {
  const clean = search.trim().toLowerCase();
  return data.toLowerCase().includes(clean);
}
