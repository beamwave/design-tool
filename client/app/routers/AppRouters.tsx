import React, { Component } from 'react'
import { Router, Route, Switch, RouteComponentProps } from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import decode from 'jwt-decode'

import { Pages } from './Routes'

import { login } from '../actions/auth'
import { configureStore } from '../store/configureStore'

const store = configureStore()

interface IPayload {
  email: string
  name: string
  photo: string
  username: string
}

// TODO: data persistence from localhost
if (localStorage.getItem('arsenal')) {
  const payload: IPayload = decode(localStorage.getItem('arsenal'))
  const user = {
    token: localStorage.getItem('arsenal'),
    email: payload.email,
    username: payload.username,
    photo: payload.photo
    // confirmed: payload.confirmed
  }
  store.dispatch(login(user))
}

export class AppRouter extends Component {
  // @ts-ignore
  render = () => {
    return (
      <Provider store={store}>
        <Pages />
      </Provider>
    )
  }
}

export default hot(module)(AppRouter)
