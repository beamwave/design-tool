import React, { Component } from 'react'
import { upload } from '../../actions/images'
import { generateUuid } from '../../helpers/helpers'

test('should setup upload action object', () => {
  const id = generateUuid()
  const imageData = {
    id,
    name: 'Zombie Playground',
    type: 'art',
    medium: 'digital',
    artist: 'Jason Chan',
    height: 400,
    width: 500,
    trainingWheels: '0',
    file: 'file'
  }

  const action = upload(imageData)

  expect(action).toEqual({
    type: 'UPLOAD_IMAGE',
    imageData
  })
})
