import React from 'react'

const initialState = {
  trainingWheels: true
}

export const appReducer = (state = initialState, action = {} as any) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        dataIsHere: true,
        category: 'art',
        sidebarOpen: false,
        trainingWheels: true
      }

    case 'LOGOUT':
      return {}

    case 'SIDEBAR':
      return {
        ...state,
        sidebarOpen: action.bool
      }

    case 'CATEGORY':
      return {
        ...state,
        category: action.option
      }

    case 'TRAINING_WHEELS':
      return {
        ...state,
        trainingWheels: !state.trainingWheels
      }

    case 'USER_POINTS':
      return {
        ...state,
        points: action.points.points
      }

    case 'ALL_POINTS':
      return {
        ...state,
        allPoints: action.points.sort((a, b) => b.points - a.points).slice(0, 3)
      }

    default:
      return state
  }
}
