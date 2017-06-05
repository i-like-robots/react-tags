module.exports = function validateDelimiterArray (props, propName, componentName) {
  const prop = props[propName]

  // make sure this is an array
  if (!(prop instanceof Array)) {
    return new Error(
      'Invalid prop `' + propName + '` supplied to' +
      ' `' + componentName + '`: delimiters needs to be an array.'
    )
  }

  // and that it's not an empty array
  if (prop.length === 0) {
    return new Error(
      'Invalid prop `' + propName + '` supplied to' +
      ' `' + componentName + '`: delimiters array cannot be empty.'
    )
  }

  // and that it's not an empty array
  if (prop.some(e => typeof e !== 'number')) {
    return new Error(
      'Invalid prop `' + propName + '` supplied to' +
      ' `' + componentName + '`: delimiters must be keyCode integers.'
    )
  }
}
