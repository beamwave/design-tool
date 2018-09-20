import React, { Component } from 'react'
import jsonwebtoken from 'jsonwebtoken'

import { login, startLogout, logout } from '../../actions/auth'
import { generateUuid } from '../../helpers/helpers'

// reset localStorage to prevent leaking
beforeEach(() => {
  localStorage.clear()
})

test('should setup login object', () => {
  const id = generateUuid()
  const jwt = jsonwebtoken.sign({ id }, 'secret')

  const user = {
    id,
    username: 'mokito',
    email: 'mokito@junit.com',
    photo: 'https://url.com/to/profile/image',
    token: jwt,
    imageData: []
  }
  const action = login(user)

  expect(action).toEqual({
    type: 'LOGIN',
    user
  })
})

test('should setup logout object', () => {
  const action = logout()

  expect(action).toEqual({
    type: 'LOGOUT'
  })
})

test('should setup startLogout object', () => {
  // const spy = jest.spyOn(localStorage, 'clear')
  const mockDispatch = jest.fn()

  startLogout()(mockDispatch)

  // ???
  expect(localStorage.clear()).toBeUndefined()
  expect(mockDispatch).toHaveBeenCalled()
  // expect(spy).toHaveBeenCalled()
})

// test('should set sidebar to true', () => {
//   const mockDispatch = jest.fn()
//   const action = sidebar(true)(mockDispatch)

//   expect(mockDispatch).toHaveBeenCalledWith({
//     type: 'SIDEBAR',
//     boolean: true
//   })
// })
