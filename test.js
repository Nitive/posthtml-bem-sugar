const posthtml = require('posthtml')
const { default: bemSugar, getClassList } = require('./src/')
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

const test = testCreator({
  blockPrefix: '-',
  elemPrefix: '__',
  modPrefix: '_',
  modDlmtr: '_',
})

describe('utilities', () => {
  it('getClassList', () => {
    getClassList('some classes').should.be.eql(['some', 'classes'])
    getClassList('some  classes').should.be.eql(['some', 'classes'])
    getClassList('   some  classes   ').should.be.eql(['some', 'classes'])
    getClassList('0 false null undefined').should.be.eql(['0', 'false', 'null', 'undefined'])
  })
})

describe('block', () => {
  test(
    'some',
    '<div></div>',
    '<div></div>'
  )
})
