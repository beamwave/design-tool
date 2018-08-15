import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { ResetPasswordPage } from '../../components/ResetPasswordPage'

test('should render ResetPasswordPage component', () => {
  const wrapper = shallow(<ResetPasswordPage />)
  expect(wrapper).toMatchSnapshot()
})
