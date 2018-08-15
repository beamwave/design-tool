import React from 'react'
import api from '../api'
import { environment } from '../../../environment'

import { imageUpload } from './images'

export const login = user => ({
  type: 'LOGIN',
  user
})

export const startLogin = credentials => {
  console.log('in start login')
  return async dispatch => {
    const data = await api.user.login(credentials)
    localStorage.setItem('arsenal', data.token)
    console.log('received data', data)

    const images = await api.image.getAll(data.id)
    console.log('images', images)

    const user = {
      ...data,
      images
    }

    dispatch(login(user))
  }
}

export const startSignup = data => async dispatch => {
  const user = await api.user.signup(data)
  localStorage.setItem('arsenal', user.token)
  dispatch(login(user))
}

export const logout = () => ({
  type: 'LOGOUT'
})

export const startLogout = () => dispatch => {
  localStorage.clear()
  dispatch(logout())
}

export const updateName = (name: string) => ({
  type: 'UPDATE_NAME',
  name
})

export const startUpdateName = name => dispatch => {
  dispatch(updateName(name))
}

export const updateEmail = (email: string) => ({
  type: 'UPDATE_EMAIL',
  email
})

export const startUpdateEmail = email => dispatch => {
  dispatch(updateEmail(email))
}
