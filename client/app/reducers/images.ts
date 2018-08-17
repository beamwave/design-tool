import React from 'react'

export const imageReducer = (state = {}, action = {} as any) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        all: action.user.imageData.images,
        categories: action.user.imageData.categories,
      }

    case 'CREATE_IMAGE':
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
