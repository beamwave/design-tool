import React from 'react'
import api from '../api'

export const search = data => ({
  type: 'SEARCH',
  data
})

// Do I really need this? Dashboard does, but...
export const filter = data => ({
  type: 'FILTER',
  data
})

export const startSearch = data => {
  return async (dispatch, getState) => {
    // if type is unchanged, just filter ?

    const query = {
      ...data,
      id: getState().auth.id
    }

    console.log('in search action', query, getState())

    // else, send type and query to db
    const imageResultsByTag = await api.image.getAllByTags(query)
    // just a tag search right ?

    console.log('results', imageResultsByTag)

    const queryResults = {}

    return dispatch(search(imageResultsByTag))

    // const quizzesByAuthors = await api.quizzes.searchByAuthor(query)
    // const quizzesByTags = await api.quizzes.searchByTag(query)
    // let quizzesByAuthors, quizzesByTags

    // const quizResults = {
    //   ...quizzesByAuthors,
    //   ...quizzesByTags
    // }

    // return dispatch(search(quizResults))
  }
}
