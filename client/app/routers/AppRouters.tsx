import React, { Component } from 'react'
import { Router, Route, Switch, RouteComponentProps } from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import decode from 'jwt-decode'

import { configureStore } from '../store/configureStore'

import { Pages } from './Routes'
import { login } from '../actions/auth'
import api from '../api'

const store = configureStore()

interface IPayload {
  id: string
  email: string
  name: string
  photo: string
  username: string
}

// TODO: data persistence from localhost
if (localStorage.getItem('arsenal')) {
  const payload: IPayload = decode(localStorage.getItem('arsenal'))
  const userData = {
    id: payload.id,
    email: payload.email,
    username: payload.username,
    photo: payload.photo,
    token: localStorage.getItem('arsenal')
    // confirmed: payload.confirmed
  }

  let user = {
    ...userData,
    imageData: []
  }

  store.dispatch(login(user))

  const fetchImages = async () => {
    const imageData = await api.image.getAll(userData.id)
    user = {
      ...userData,
      imageData
    }
    store.dispatch(login(user))
  }

  fetchImages()
}

export class AppRouter extends Component {
  render = () => {
    return (
      <Provider store={store}>
        <Pages />
      </Provider>
    )
  }
}

export default hot(module)(AppRouter)
