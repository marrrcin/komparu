/**
 * Default options for fetch to the api.
 * We have to set credentials to include because we need cookies because our
 * restful api uses sessions as a simple subitution for database. This should
 * not be the case in production api.
 */
const fetchInit = {
  credentials: 'include',
}

/**
 * Default api endpoint, for real life it would be nice to get the value
 * from the build environemnt.
 */
const API_ENDPOINT = 'http://localhost:8080'

/**
 * Small abstratctiob from fetch API. Little bit of abastraction is always 
 * healthy.
 */
export const api = (uri, method = 'GET', params) =>
  fetch(API_ENDPOINT+uri, {...fetchInit, ...params, method: 'GET'})
    .then(result => {
      if (result.ok) {
        return result.json()
      }
      else {
        return result.text().then(error => {throw error})
      }
    })
