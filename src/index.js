const R = require('ramda')

const getClassList = exports.getClassList = R.pipe(
  R.split(' '),
  R.reject(R.equals(''))
)

exports.default = config => { // eslint-disable-line
  return function posthtmlBemSugar(tree) {
    return tree
  }
}
