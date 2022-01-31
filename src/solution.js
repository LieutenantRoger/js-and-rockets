/**
 * Trigger the process of loading data
 * @param {*} process data callback
 * @param {*} render data callback
 */
const processingData = (callback1, callback2) => {
  const elementWrapper = document.getElementById('out')
  elementWrapper.replaceChildren('Loading Data')
  const apiUrl = process.env.DATA_API || 'https://api.spacexdata.com/v3/launches/past'
  fetch(apiUrl).then(response => response.json()).then((res) => {
    callback1 && callback1(res, callback2)
  }).catch((err) => {
    callback1 && callback1([], callback2)
  })
}

/**
 * Process data
 * @param {*} the data to be filtered and sorted
 * @param {*} the render data callback
 * @returns
 */
const prepareData = (data, callback) => {
  // 2018 UTC start time
  const start = Date.UTC(2018, 1, 1, 0, 0, 0)
  // 2018 UTC end time
  const end = Date.UTC(2019, 1, 1, 0, 0, 0)
  data = data.filter(item => {
    const c = new Date(item.launch_date_utc).getTime()
    const payloads = item.rocket.second_stage.payloads
    let isNasaCustomer = false
    payloads.forEach(item => {
      item.customers.forEach(customer => {
        // NASA needs to be one of the customer
        if (customer.indexOf('NASA') >= 0) {
          isNasaCustomer = true
        }
      })
    })
    return c >= start && c < end && isNasaCustomer
  })
  data.sort((a, b) => {
    if (a.rocket.second_stage.payloads.length == b.rocket.second_stage.payloads.length) {
      return (new Date(b.launch_date_utc)).getTime() - ((new Date(a.launch_date_utc)).getTime())
    }
    return b.rocket.second_stage.payloads.length - a.rocket.second_stage.payloads.length
  })
  data = data.map(item => {
    const r = {}
    r.flight_number = item.flight_number
    r.mission_name = item.mission_name
    r.payloads_count = item.rocket.second_stage.payloads.length
    return r
  })
  callback && callback(data)
  // return the processed data to convenient the unit test
  return data
}

/**
 * Render the actual data on the UI
 *
 * @param {*} data to be rendered
 * @returns
 */
const renderData = (data) => {
  const elementWrapper = document.getElementById('out')
  if (data.length == 0) {
    elementWrapper.innerHTML = "There's no rocket launched during 2018 for NASA"
    return
  }
  elementWrapper.innerHTML = JSON.stringify(data, null, 2)
}

module.exports = {
  processingData: processingData,
  prepareData: prepareData,
  renderData: renderData
}
