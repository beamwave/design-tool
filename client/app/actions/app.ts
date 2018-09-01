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
