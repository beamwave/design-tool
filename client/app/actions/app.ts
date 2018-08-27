import React from 'react'
import api from '../api'

export const sidebar = bool => dispatch =>
  dispatch({
    type: 'SIDEBAR',
    bool
  })

export const changeCategory = option => dispatch =>
  dispatch({
    type: 'CATEGORY',
    option
  })

export const toggleEditMode = () => dispatch => dispatch({ type: 'EDIT' })

export const trainingWheelsProtocol = () => dispatch =>
  dispatch({ type: 'TRAINING_WHEELS' })

export const searching = () => dispatch =>
  dispatch({
    type: 'SEARCH'
  })

export const startSearch = query => async dispatch => {
  // if type is unchanged, just filter ?

  // else, send type and query to db

  // just a tag search right ?

  const queryResults = {}

  return dispatch(search(queryResults))

  // const quizzesByAuthors = await api.quizzes.searchByAuthor(query)
  // const quizzesByTags = await api.quizzes.searchByTag(query)
  // let quizzesByAuthors, quizzesByTags

  // const quizResults = {
  //   ...quizzesByAuthors,
  //   ...quizzesByTags
  // }

  // return dispatch(search(quizResults))
}

export const search = query => ({
  type: 'QUERY',
  query
})
