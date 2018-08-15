import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { SignupPage } from '../../components/SignupPage'

test('should render SignupPage component', () => {
  const wrapper = shallow(
    <SignupPage startSignup={() => `placeholder function`} />
  )
  expect(wrapper).toMatchSnapshot()
})
