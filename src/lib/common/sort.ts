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

export function shuffle<T>(list: T[]): T[] {
  var i = list.length;

  while (--i > 0) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = list[j];
    list[j] = list[i];
    list[i] = temp;
  }

  return list;
}
