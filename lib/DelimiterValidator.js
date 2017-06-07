module.exports = function validateDelimiterArray (props, propName, componentName) {
  const prop = props[propName]
  const errorPrefix = 'Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`'

  // make sure this is an array
  if (!(prop instanceof Array)) {
    return new Error(errorPrefix + ': delimiters needs to be an array.')
  }

  // and that it's not an empty array
  if (prop.length === 0) {
    return new Error(errorPrefix + ': delimiters array cannot be empty.')
  }

  // and that if it's not empty, the content is numerical
  if (prop.some(e => typeof e !== 'number')) {
    return new Error(errorPrefix + ': delimiters must be keyCode integers.')
  }
}
