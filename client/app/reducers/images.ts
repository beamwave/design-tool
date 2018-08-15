import React from 'react'

export const imageReducer = (state = {}, action = {} as any) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        all: action.user.images,
        categories: action.user.categories
      }

    case 'CREATE_IMAGE':
      console.log('in reducer', action)
      return {
        ...state,
        all: action.images
      }

    case 'UPDATE_IMAGE':
      return {
        ...state,
        all: action.images
      }

    case 'DELETE_IMAGE':
      return {
        ...state,
        all: action.images
      }

    default:
      return state
  }
}
