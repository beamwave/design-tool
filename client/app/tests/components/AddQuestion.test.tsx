import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { AddQuestion } from '../../components/AddQuestion'

test('should render AddQuestion component', () => {
  const wrapper = shallow(<AddQuestion />)
  expect(wrapper).toMatchSnapshot()
})
