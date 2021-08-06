export function queryDocument(query) {
  const queryResult = document.querySelector(query);
  if (!(queryResult instanceof HTMLElement)) {
    throw new Error(`No match for query "${query}"`);
  }
  return queryResult;
}
export function queryDocumentAll(query) {
  const queryResults = document.querySelectorAll(query);
  const filteredQueries = Array.from(queryResults).filter((queryResult) => queryResult instanceof HTMLElement);
  const diff = queryResults.length - filteredQueries.length;
  if (diff) {
    throw new Error(`${diff} query matches were invalid "${query}"`);
  }
  return filteredQueries;
}
