import React, { Component } from 'react'
import { search } from '../../actions/filter'

test('should test search action', () => {
  const action = search('mock-query')

  expect(action).toEqual({
    type: 'SEARCH',
    query: 'mock-query'
  })
})

test('should test sidebar action', () => {
  const action = search('mock-query')

  expect(action).toEqual({
    type: 'SEARCH',
    query: 'mock-query'
  })
})
