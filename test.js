const posthtml = require('posthtml')
const { default: bemSugar, getClassList, processBlock } = require('./src/')
require('chai').should()


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
  it('getClassList validation', () => {
    (() => getClassList(123)).should.throw('getClassList argument should be a string')
  })

  it('getClassList should right process emtry string', () => {
    getClassList('').should.be.eql([])
  })

  it('getClassList should right process one class', () => {
    getClassList('class').should.be.eql(['class'])
  })

  it('getClassList should right process few classes', () => {
    getClassList('some classes').should.be.eql(['some', 'classes'])
  })

  it('getClassList should right process extra spaces', () => {
    getClassList('some  classes').should.be.eql(['some', 'classes'])
    getClassList('   some  classes   ').should.be.eql(['some', 'classes'])
  })

  it('getClassList should right process falsy values', () => {
    getClassList('0 false null undefined').should.be.eql(['0', 'false', 'null', 'undefined'])
  })
})


describe('processBlock', () => {
  it('processBlock should remove empty class', () => {
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

  it('processBlock should keep another classes', () => {
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
