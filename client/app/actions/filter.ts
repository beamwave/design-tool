import React from 'react'
import api from '../api'
import { throttle, debounce } from 'throttle-debounce'

// Do I really need this? Dashboard does, but...
export const filter = data => ({
  type: 'FILTER',
  data
})

export const search = data => ({
  type: 'SEARCH',
  data
})

export const query = query => dispatch =>
  dispatch({
    type: 'QUERY',
    query
  })

export const startSearch = data => {
  console.log('in action creator!')
  return async (dispatch, getState) => {
    const conditions = {
      ...data,
      id: getState().auth.id
    }

    // send api call here
    const imageResultsByTag = await api.image.getAllByTags(conditions)

    console.log('the image results:', imageResultsByTag)
    // then dispatch image results to store
    return dispatch(search(imageResultsByTag))
  }
}
