/* eslint-disable no-unused-expressions */

const R = require('ramda')
const posthtml = require('posthtml')
require('chai').should()

const {
  default: bemSugar,
  getClassList,
  processBlock,
  startWith,
} = require('./src/')



const testCreator = ({ defaults = {}, useBefore = [], useAfter = [] } = {}) =>
(discription, input, output, config) => {
  it(discription, done => {
    const resultConfig = R.merge(defaults, config || {})
    const plugins = [...useBefore, bemSugar(resultConfig), ...useAfter]

    plugins.reduce((processor, plugin) => processor.use(plugin), posthtml())
      .process(input)
      .then(result => {
        result.html.should.be.equal(output)
        done()
      })
      .catch(done)
  })
}

const defaults = {
  blockPrefix: '-',
  elemPrefix: '__',
  modPrefix: '_',
  modDlmtr: '_',
}


const test = testCreator({ defaults })


// wrapper which delete extra left spaces in template strings
// useful for html code
const removeTemplateStringsSpaces = R.pipe(
  // remove 4 spaces from start because there are 4 in tests
  str => `\n    ${str}`,
  R.split('\n'),
  R.map(R.slice(4, Infinity)),
  R.join('\n')
)

const fullTest = (discription, input, output, config) =>
  testCreator({
    defaults,
    useBefore: [require('posthtml-jade')()],
    useAfter: [require('posthtml-bem')()],
  })(discription, input, removeTemplateStringsSpaces(output), config)


describe('getClassList', () => {
  it('should throws if angument is not a string', () => {
    R.partial(getClassList, [123]).should.throw()
  })

  it('should right process emtry string', () => {
    getClassList('').should.be.eql([])
  })

  it('should right process one class', () => {
    getClassList('class').should.be.eql(['class'])
  })

  it('should right process few classes', () => {
    getClassList('some classes').should.be.eql(['some', 'classes'])
  })

  it('should right process extra spaces', () => {
    getClassList('some  classes').should.be.eql(['some', 'classes'])
    getClassList('   some  classes   ').should.be.eql(['some', 'classes'])
  })

  it('should right process falsy values', () => {
    getClassList('0 false null undefined').should.be.eql(['0', 'false', 'null', 'undefined'])
  })
})


describe('startWith', () => {
  it('should works', () => {
    startWith('12', '1234').should.be.true
    startWith('12', '234').should.be.false
  })

  it('should be curried', () => {
    startWith('12')('1234').should.be.true
    startWith('12')('234').should.be.false
  })
})


describe('processBlock', () => {
  it('should remove empty class', () => {
    const tree = {
      tag: 'div',
      attrs: { class: '-block' },
    }

    processBlock(defaults, tree).should.be.eql({
      tag: 'div',
      attrs: {
        block: 'block',
      },
    })
  })

  it('should keep another classes', () => {
    const tree = {
      tag: 'div',
      attrs: { class: '-block js-something' },
    }

    processBlock(defaults, tree).should.be.eql({
      tag: 'div',
      attrs: {
        block: 'block',
        class: 'js-something',
      },
    })
  })
})


describe('block', () => {
  test(
    'should change prefixed class to block="unprefixed-class"',
    '<div class="-block"></div>',
    '<div block="block"></div>'
  )

  test(
    'should works with different prefix',
    '<div class="b-block"></div>',
    '<div block="block"></div>',
    { blockPrefix: 'b-' }
  )

  test(
    'should keep another classes',
    '<div class="-block another-class and-more"></div>',
    '<div class="another-class and-more" block="block"></div>'
  )
})


describe('element', () => {
  test(
    'should change prefixed class to elem="unprefixed-class"',
    '<div class="__element"></div>',
    '<div elem="element"></div>'
  )

  test(
    'should works with different prefix',
    '<div class="e-element"></div>',
    '<div elem="element"></div>',
    { elemPrefix: 'e-' }
  )

  test(
    'should keep another classes',
    '<div class="__element another-class and-more"></div>',
    '<div class="another-class and-more" elem="element"></div>'
  )

  test(
    'should works with block',
    '<div class="-block __element"></div>',
    '<div block="block" elem="element"></div>'
  )
})


describe('mods', () => {
  test(
    'should change prefixed class to mods="mod:value"',
    '<div class="_mod_value"></div>',
    '<div mods="mod:value"></div>'
  )

  test(
    'should change prefixed class to mods="mod"',
    '<div class="_mod"></div>',
    '<div mods="mod"></div>'
  )

  test(
    'should works with different prefix and delimiter',
    '<div class="m-mod--value"></div>',
    '<div mods="mod:value"></div>',
    { modPrefix: 'm-', modDlmtr: '--' }
  )

  test(
    'should keep another classes',
    '<div class="_mod another-class and-more"></div>',
    '<div class="another-class and-more" mods="mod"></div>'
  )

  test(
    'should works with block',
    '<div class="-block _mod"></div>',
    '<div block="block" mods="mod"></div>'
  )

  test(
    'should works with element',
    '<div class="__element _mod_value"></div>',
    '<div elem="element" mods="mod:value"></div>'
  )

  test(
    'should works with element',
    '<div class="__element _mod_value _another_mod"></div>',
    '<div elem="element" mods="mod:value another:mod"></div>'
  )
})


describe('full', () => {
  fullTest(
    'should compile jade',
    '.-block my block',
    '<div class="block">my block</div>'
  )

  fullTest(
    'should compile jade',
    `.-block
      .__element content`,
    `<div class="block">
      <div class="block__element">content</div>
    </div>`
  )
})
