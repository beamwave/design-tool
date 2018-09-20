import React, { Component } from 'react'

import {
  sidebar,
  changeCategory,
  toggleEditMode,
  trainingWheelsProtocol
} from '../../actions/app'

test('should set sidebar to true', () => {
  const mockDispatch = jest.fn()
  const action = sidebar(true)(mockDispatch)

  expect(mockDispatch).toHaveBeenCalledWith({
    type: 'SIDEBAR',
    boolean: true
  })
})

test('should set sidebar to false', () => {
  const mockDispatch = jest.fn()
  const action = sidebar(false)(mockDispatch)

  expect(mockDispatch).toHaveBeenCalledWith({
    type: 'SIDEBAR',
    boolean: false
  })
})

test('should toggle editmode', () => {
  const mockDispatch = jest.fn()
  const action = toggleEditMode()(mockDispatch)

  expect(mockDispatch).toHaveBeenCalledWith({
    type: 'EDIT'
  })
})
