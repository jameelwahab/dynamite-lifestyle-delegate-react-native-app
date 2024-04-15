

// const numFormatter = (num,toFixed=0) => {

//   if (num > 999 && num < 1000000) {
//     return (num / 1000).toFixed(toFixed) + 'K'; // convert to K for number from > 1000 < 1 million
//   } else if (num > 1000000) {
//     return (num / 1000000).toFixed(toFixed) + 'M'; // convert to M for number from > 1 million
//   } else if (num < 900) {
//     return num; // if value < 1000, nothing to do
//   }

// }

// export default numFormatter



const numFormatter = (num, unit = 1) => {
  if (num >= 1000000000) {
    let n = (num / 1000000000)
    if (!(n % 1 == 0)) {
      n = n.toFixed(unit);
    }
    return n + 'B'; // convert to M for number from > 1 million
  } else if (num >= 1000000) {
    let n = (num / 1000000)
    if (!(n % 1 == 0)) {
      n = n.toFixed(unit);
    }
    return n + 'M'; // convert to M for number from > 1 million
  } else if (num > 999 && num < 1000000) {
    let n = (num / 1000)
    if (!(n % 1 == 0)) {
      n = n.toFixed(unit);
    }
    return n + 'K'; // convert to K for number from > 1000 < 1 million
  } else {
    let n = num;
    if (!(n % 1 == 0)) {
      n = n.toFixed(unit);
    }
    return n // if value < 1000, nothing to do
  }

}

export default numFormatter