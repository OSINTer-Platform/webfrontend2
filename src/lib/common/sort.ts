export function sortDocumentsById<Document>(
  ids: string[],
  documents: Document[],
  getId: (doc: Document) => string
) {
  const lookupTable: { [key: string]: number } = Object.fromEntries(
    ids.map((id, i) => [id, i])
  );
  const filteredDocuments = documents.filter(
    (document) => getId(document) in lookupTable
  );

  filteredDocuments.sort(
    (a, b) => lookupTable[getId(a)] - lookupTable[getId(b)]
  );
  return filteredDocuments;
}
