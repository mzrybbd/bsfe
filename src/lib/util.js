import axios from 'axios'

export default function (obj) {
  return new Promise((resolve, reject) => {
    obj.data = obj.data || {}
    let options = {
      url: obj.url,
      method: 'post',
      baseURL: 'http://localhost:3000',
      transformRequest: [function (data) {
        return JSON.stringify(data)
      }],
      transformResponse: [function (data) {
        if (typeof data !== 'object') {
          try {
            data = JSON.parse(data)
          } catch (error) {
            console.log(error)
          }
        }
        return data
      }],
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      },
      data: obj.data
    }
    axios.request(options).then(response => {
      resolve(response.data)
    }).catch(response => {
      reject(response)
    })
  })
}