
const isArray = (arr, length = 0) => {
  return (!!arr && Array.isArray(arr) && arr.length > length)
}

export default isArray