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
