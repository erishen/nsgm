import axios from 'axios'
import { getLocalApiPrefix } from './common'

export const getLocalGraphql = (query: string, variables: any = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .post(getLocalApiPrefix() + '/graphql', {
        query,
        variables
      })
      .then((res) => {
        // console.log('axios_res', res)
        if (res) {
          const { data } = res
          resolve(data)
        } else {
          reject()
        }
      })
      .catch((_e) => {
        // console.error('axios_e', _e)
        reject(_e)
      })
  })
}
