module.exports = function debounce (fn, delay = 100) {
  let timeoutID

  return function () {
    clearTimeout(timeoutID)

    const args = arguments

    timeoutID = setTimeout(() => fn(...args), delay)
  }
}
