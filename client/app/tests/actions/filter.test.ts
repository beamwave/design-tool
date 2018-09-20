import React, { Component } from 'react'

import { search, query } from '../../actions/filter'

test('should setup search object', () => {
  const input = 'titans'
  const action = search(input)

  expect(action).toEqual({
    type: 'SEARCH',
    data: input
  })
})

test('should dispatch query with user input', () => {
  const input = 'avengers'
  const mockDispatch = jest.fn()
  const action = query(input)(mockDispatch)

  expect(mockDispatch).toBeCalledWith({
    type: 'QUERY',
    query: input
  })
})
