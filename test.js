const posthtml = require('posthtml')
const bemSugar = require('./src/')
require('chai').should()


const testCreator = options => (discription, input, output) => {
  it(discription, done => {
    posthtml()
      .use(bemSugar(options))
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

describe('block', () => {
  test(
    'some',
    '<div></div>',
    '<div></div>'
  )
})
