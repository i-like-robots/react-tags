function escapeForRegExp (string) {
  return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
}

module.exports = { escapeForRegExp }
