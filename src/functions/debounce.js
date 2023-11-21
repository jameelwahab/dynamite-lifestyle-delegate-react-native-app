let timer;

export default function debounce(func, timeout = 300) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func()
    }, timeout);
  
}


