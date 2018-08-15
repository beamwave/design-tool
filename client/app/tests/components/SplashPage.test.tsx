import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { SplashPage } from '../../components/SplashPage'

test('should render SplashPage component', () => {
  const wrapper = shallow(<SplashPage />)
  expect(wrapper).toMatchSnapshot()
})
