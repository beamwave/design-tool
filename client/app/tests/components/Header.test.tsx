import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { Header } from '../../components/Header'

test('should render Header component', () => {
  const wrapper = shallow(
    <Header
      photo="url"
      username="mock-user"
      isAuthenticated={true}
      trainingWheels={false}
      startLogout={() => console.log('placeholder')}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
