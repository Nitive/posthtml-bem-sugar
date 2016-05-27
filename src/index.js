const R = require('ramda')

const getClassList = exports.getClassList = R.pipe(
  R.unless(R.is(String), () => { throw new Error('getClassList argument should be a string') }),
  R.split(' '),
  R.reject(R.equals(''))
)

exports.default = config => { // eslint-disable-line
  return function posthtmlBemSugar(tree) {
    return tree
  }
}
