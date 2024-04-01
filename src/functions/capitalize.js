

const capitalize = (text) => {
  if (text == "") {
    return text;
  }
  let newtext = "";
  let array = text.split(" ");
  array.forEach(element => {
    newtext = newtext + " " + element.charAt(0).toUpperCase() + element.slice(1,)
  });

  return newtext
}

export default capitalize