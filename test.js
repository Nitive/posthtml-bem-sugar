const R = require('ramda')
const posthtml = require('posthtml')
require('chai').should()

const {
  default: bemSugar,
  getClassList,
  processBlock,
} = require('./src/')



const testCreator = defaultConfig => (discription, input, output, config) => {
  it(discription, done => {
    const resultConfig = Object.assign(defaultConfig, config || {})

    posthtml()
      .use(bemSugar(resultConfig))
      .process(input)
      .then(result => {
        output.should.be.equal(result.html)
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

const test = testCreator(defaults)

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
    '<div class="b-block another-class and-more"></div>',
    '<div class="another-class and-more" block="block"></div>'
  )

  test(
    'should keep another classes',
    '<div class="b-block another-class and-more"></div>',
    '<div class="another-class and-more" block="block"></div>'
  )
})
