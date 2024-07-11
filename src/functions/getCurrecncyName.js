
const getCurrecncyName = (code) => {
  return currecnyName[code]
}

export default getCurrecncyName

const currecnyName = {
  "gbp": "UK Pound",
  "eur": "Euro",
  "usd": "US Dollar"
}