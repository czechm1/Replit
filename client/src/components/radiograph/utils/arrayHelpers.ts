export function arrayObjectIndexOf<T>(
  myArray: T[],
  searchTerm: any,
  property: keyof T,
): number {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i][property] === searchTerm) return i;
  }
  return -1;
}
