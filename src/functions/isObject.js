
const isObject = (obj) => {
  return (!!obj && Object.keys(obj).length > 0)
}

export default isObject