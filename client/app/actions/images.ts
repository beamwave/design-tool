import React from 'react'
import api from '../api'

export const upload = imageData => ({
  type: 'CREATE_IMAGE',
  imageData
})

export const startUpload = data => async dispatch => {
  const { formData, id } = data

  // store all images
  await api.image.upload(formData)

  // get all images
  const imageData = await api.image.getAll(id)

  // update store with images
  dispatch(upload(imageData))
}

export const startAddTag = data => async dispatch => {
  // add tag to image
  const addTag = await api.image.addTag(data)

  // get all images
  const imageData = await api.image.getAll(data.userId)

  // update store with images
  dispatch(upload(imageData))
}
