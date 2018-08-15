import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { ProfilePage } from '../../components/ProfilePage'

test('should render ProfilePage component', () => {
  const wrapper = shallow(
    <ProfilePage
      username="BananaDumpling"
      bio="nice to meet"
      name="Tess Eless"
      email="tess@eless.com"
      profileImage="https://profileimage.jpg"
    />
  )
  expect(wrapper).toMatchSnapshot()
})
