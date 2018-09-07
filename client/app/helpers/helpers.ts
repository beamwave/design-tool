// deep comparison of two arrays of objects
export const deepEquals = (a, b) => {
  if (a instanceof Array && b instanceof Array) return arraysEqual(a, b)
  if (
    Object.getPrototypeOf(a) === Object.prototype &&
    Object.getPrototypeOf(b) === Object.prototype
  )
    return objectsEqual(a, b)
  if (a instanceof Map && b instanceof Map) return mapsEqual(a, b)
  if (a instanceof Set && b instanceof Set)
    throw 'Error: set equality by hashing not implemented.'
  if (
    (a instanceof ArrayBuffer || ArrayBuffer.isView(a)) &&
    (b instanceof ArrayBuffer || ArrayBuffer.isView(b))
  )
    return typedArraysEqual(a, b)

  return a == b // see note[1] -- IMPORTANT
}

const arraysEqual = (a, b) => {
  if (a.length != b.length) return false
  for (let i = 0; i < a.length; i++) if (!deepEquals(a[i], b[i])) return false

  return true
}
const objectsEqual = (a, b) => {
  let aKeys = Object.getOwnPropertyNames(a)
  let bKeys = Object.getOwnPropertyNames(b)
  if (aKeys.length != bKeys.length) return false
  aKeys.sort()
  bKeys.sort()
  for (let i = 0; i < aKeys.length; i++)
    if (aKeys[i] != bKeys[i])
      // keys must be strings
      return false

  return deepEquals(aKeys.map(k => a[k]), aKeys.map(k => b[k]))
}
const mapsEqual = (a, b) => {
  if (a.size != b.size) return false
  let aPairs = Array.from(a)
  let bPairs = Array.from(b)
  aPairs.sort((x, y): any => x[0] < y[0])
  bPairs.sort((x, y): any => x[0] < y[0])
  for (let i = 0; i < a.length; i++)
    if (
      !deepEquals(aPairs[i][0], bPairs[i][0]) ||
      !deepEquals(aPairs[i][1], bPairs[i][1])
    )
      return false

  return true
}

const typedArraysEqual = (a, b) => {
  a = new Uint8Array(a)
  b = new Uint8Array(b)
  if (a.length != b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] != b[i]) return false

  return true
}

// check existence
export const check = obj => obj !== undefined && obj !== null

// generate uuids
export const generateUuid = () => {
  let d = new Date().getTime()
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now() //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

// compare objects
export const compareObjects = (obj1, obj2) => {
  //check for obj2 overlapping props
  if (!Object.keys(obj2).every(key => obj1.hasOwnProperty(key))) return false

  //check every key for being same
  return Object.keys(obj1).every(key => {
    //if object
    if (typeof obj1[key] == 'object' && typeof obj2[key] == 'object')
      //recursively check
      return compareObjects(obj1[key], obj2[key])
    //do the normal compare
    else return obj1[key] === obj2[key]
  })
}
