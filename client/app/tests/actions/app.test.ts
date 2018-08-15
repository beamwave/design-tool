import React, { Component } from 'react'
import { search } from '../../actions/app'

test('should test search action', () => {
  const action = search('mock-query')

  expect(action).toEqual({
    type: 'QUERY',
    query: 'mock-query'
  })
})

test('should test sidebar action', () => {
  const action = search('mock-query')

  expect(action).toEqual({
    type: 'QUERY',
    query: 'mock-query'
  })
})
