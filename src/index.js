console.log('Hello from %csrc/index.js', 'font-weight:bold')
const solution = require('./solution.js')
const main = () => {
  solution.processingData(solution.prepareData, solution.renderData)
}
// Trigger the process of loading data
main()
