import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { ModalContainer } from '../../components/ModalContainer'

test('should render ModalContainer component', () => {
  const wrapper = shallow(<ModalContainer />)
  expect(wrapper).toMatchSnapshot()
})
