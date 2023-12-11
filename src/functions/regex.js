export function isEmailValid(email) {
  let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regEmail.test(email);
}

export function checkSpace(text) {
  let reg_space = /\s/g;
  return reg_space.test(text);
}

export function isFirstLetterAlphabet(str) {
  let reg_olnyAlphabet = /^[a-zA-Z]/;
  return reg_olnyAlphabet.test(str.charAt(0));
}


export function isHtml(str) {
  let reg_isHtml = /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/
  return reg_isHtml.test(str);
}

export function isUrlWithHttps(urlToTest) {
  let reg_isHtml = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  return reg_isHtml.test(urlToTest);
}


export function isUrl(urlToTest) {
  let reg_isHtml = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  return reg_isHtml.test(urlToTest);
}
