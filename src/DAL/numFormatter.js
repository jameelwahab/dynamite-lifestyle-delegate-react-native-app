

const numFormatter = (num,toFixed=0) => {

  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(toFixed) + 'K'; // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(toFixed) + 'M'; // convert to M for number from > 1 million
  } else if (num < 900) {
    return num; // if value < 1000, nothing to do
  }

}

export default numFormatter