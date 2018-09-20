import React, { Component } from 'react'
import { loadModal, hideModal } from '../../actions/modal'

test('should setup loadModal action object', () => {
  const action = loadModal()

  expect(action).toEqual({
    type: 'SHOW_MODAL'
  })
})

test('should setup hideModal action object', () => {
  const action = hideModal()

  expect(action).toEqual({
    type: 'HIDE_MODAL'
  })
})
