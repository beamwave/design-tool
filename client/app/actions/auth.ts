import React from 'react'
import api from '../api'
import { environment } from '../../../environment'

import { upload } from './images'

export const login = user => ({
  type: 'LOGIN',
  user
})

export const startLogin = credentials => {
  return async dispatch => {
    const userData = await api.user.login(credentials)
    localStorage.setItem('arsenal', userData.token)

    const imageData = await api.image.getAll(userData.id)

    const user = {
      ...userData,
      imageData
    }

    dispatch(login(user))
  }
}

export const startSignup = data => async dispatch => {
  const user = await api.user.signup(data)
  localStorage.setItem('arsenal', user.token)
  dispatch(login(user))
}

export const startRefresh = credentials => {
  return async dispatch => {
    const userData = await api.user.refresh(credentials)
    localStorage.setItem('arsenal', userData.token)

    const imageData = await api.image.getAll(userData.id)

    const user = {
      ...userData,
      imageData
    }

    dispatch(login(user))
  }
}

export const logout = () => ({
  type: 'LOGOUT'
})

export const startLogout = () => dispatch => {
  localStorage.clear()
  dispatch(logout())
}
