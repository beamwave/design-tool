import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { StorePage } from '../../components/StorePage'

test('should render StorePage component', () => {
  const wrapper = shallow(<StorePage />)
  expect(wrapper).toMatchSnapshot()
})
