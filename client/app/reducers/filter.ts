import React from 'react'

export const filterReducer = (state = {}, action = {} as any) => {
  switch (action.type) {
    case 'LOGIN':
      let filters = {}
      for (let category in action.user.imageData.categories)
        filters[category] = false
      return {
        ...filters
      }

    case 'FILTER':
      console.log('hit filter route: ', action.filter)
      return {
        ...state,
        [action.filter.category]: action.filter.value
      }

    default:
      return state
  }
}
