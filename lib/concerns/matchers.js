function escapeForRegExp (string) {
  return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
}

function matchAny (string) {
  return new RegExp(escapeForRegExp(string), 'gi')
}

function matchPartial (string) {
  return new RegExp(`(?:^|\\s)${escapeForRegExp(string)}`, 'i')
}

function matchExact (string) {
  return new RegExp(`^${escapeForRegExp(string)}$`, 'i')
}

module.exports = { escapeForRegExp, matchAny, matchPartial, matchExact }
