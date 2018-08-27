import React from 'react'

export const imageReducer = (state = {}, action = {} as any) => {
  switch (action.type) {
    case 'LOGIN':
      console.log('login action..', action)
      return {
        all: action.user.imageData.images,
        categories: action.user.imageData.categories
      }

    case 'CREATE_IMAGE':
      return {
        ...state,
        all: action.imageData.images,
        categories: action.imageData.categories
      }

    case 'UPDATE_IMAGE':
      return {
        ...state,
        all: action.imageData.images,
        categories: action.imageData.categories
      }

    case 'DELETE_IMAGE':
      return {
        ...state,
        all: action.imageData.images,
        categories: action.imageData.categories
      }

    default:
      return state
  }
}
