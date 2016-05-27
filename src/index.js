const R = require('ramda')

const getClassList = exports.getClassList = R.pipe(
  R.unless(R.is(String), () => { throw new Error('getClassList argument should be a string') }),
  R.split(' '),
  R.reject(R.equals(''))
)


const startWith = exports.startWith = R.uncurryN(
  2,
  str => R.pipe(
    R.take(str.length),
    R.equals(str)
  )
)

const slicePrefix = prefixProp => config => {
  return R.slice(config[prefixProp].length, Infinity)
}

const process = R.curry(({
  prefixProp,
  attr,
  processClass = slicePrefix(prefixProp),
}, config, node) => {
  if (!node.attrs.class) return node

  const classList = getClassList(node.attrs.class)
  const isClassToProcess = startWith(config[prefixProp])

  const getProcessedClass = R.pipe(
    R.find(isClassToProcess),
    R.ifElse(
      R.identity,
      processClass(config),
      R.F
    )
  )

  const classWithoutPrefix = getProcessedClass(classList)
  if (!classWithoutPrefix) return node

  const newClassList = R.reject(isClassToProcess, classList)

  return R.pipe(
    R.assocPath(['attrs', attr], classWithoutPrefix),
    newClassList.length
      ? R.assocPath(['attrs', 'class'], R.join(' ', newClassList))
      : R.dissocPath(['attrs', 'class'])
  )(node)
})


const processBlock = exports.processBlock = process({
  prefixProp: 'blockPrefix',
  attr: 'block',
})


const processElement = exports.processElement = process({
  prefixProp: 'elemPrefix',
  attr: 'elem',
})


exports.default = config => { // eslint-disable-line
  return function posthtmlBemSugar(tree) {
    tree.match({ attrs: { class: true } }, R.pipe(
      processBlock(config),
      processElement(config)
    ))
    return tree
  }
}
