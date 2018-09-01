import React from 'react'

export const imageReducer = (state = {}, action = {} as any) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        all: action.user.imageData.images,
        tags: action.user.imageData.tags,
        categories: action.user.imageData.categories
      }

    case 'UPLOAD_IMAGE':
      return {
        ...state,
        all: action.imageData.images,
        tags: action.imageData.tags,
        categories: action.imageData.categories
      }

    case 'QUERY_BY_TAGS':
      return {
        ...state,
        all: action.imageData.images
      }

    case 'SEARCH':
      console.log('and this is the action', action)
      return {
        ...state,
        all: action.data.images
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
