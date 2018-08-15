import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { DashboardPage } from '../../components/DashboardPage'

test('should render DashboardPage component', () => {
  const wrapper = shallow(
    <DashboardPage
      username="named_manager"
      category="art"
      images={['img_1', 'img_2', 'img_3']}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
