import React from 'react'
import api from '../path-list'

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

export const trainingWheelsProtocol = () => dispatch =>
  dispatch({ type: 'TRAINING_WHEELS' })

export const searching = () => dispatch =>
  dispatch({
    type: 'SEARCH'
  })

export const startSearch = query => async dispatch => {
  const quizzesByAuthors = await api.quizzes.searchByAuthor(query)
  const quizzesByTags = await api.quizzes.searchByTag(query)

  const quizResults = {
    ...quizzesByAuthors,
    ...quizzesByTags
  }

  return dispatch(search(quizResults))
}

export const search = query => ({
  type: 'QUERY',
  query
})
