import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { LoginPage } from '../../components/LoginPage'

/* add mock function for startLogin */

test('should render LoginPage component', () => {
  const wrapper = shallow(
    <LoginPage startLogin={() => `function placeholder`} />
  )
  expect(wrapper).toMatchSnapshot()
})
