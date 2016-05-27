const R = require('ramda')

const getClassList = R.pipe(
  R.unless(R.is(String), () => { throw new Error('getClassList argument should be a string') }),
  R.split(' '),
  R.reject(R.equals(''))
)

exports.getClassList = getClassList


const startWith = str => R.pipe(
  R.take(str.length),
  R.equals(str)
)

const processBlock = (config, node) => {
  const classList = getClassList(node.attrs.class)
  const isBlock = startWith(config.blockPrefix)

  const getBlockName = R.pipe(
    R.find(isBlock),
    R.slice(config.blockPrefix.length, Infinity)
  )

  const blockName = getBlockName(classList)
  const newClassList = R.reject(isBlock, classList)

  return R.pipe(
    R.assocPath(['attrs', 'block'], blockName),
    newClassList.length
      ? R.assocPath(['attrs', 'class'], R.join(' ', newClassList))
      : R.dissocPath(['attrs', 'class'])
  )(node)
}

exports.processBlock = processBlock


exports.default = config => { // eslint-disable-line
  return function posthtmlBemSugar(tree) {
    tree.match({ attrs: { class: true } }, node => {
      return processBlock(config, node)
    })
    return tree
  }
}
