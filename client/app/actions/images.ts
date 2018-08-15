import React from 'react'
import api from '../api'

export const imageUpload = images => ({
  type: 'CREATE_IMAGE',
  images
})

export const startImageUpload = data => async dispatch => {
  console.log('in action')
  const image = await api.image.upload(data)
  console.log('after api call', image)
  dispatch(imageUpload(image))
}
