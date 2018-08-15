import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { SidebarContent } from '../../components/SidebarContent'

test('should render SidebarContent component', () => {
  const mock: any = jest.fn()
  const wrapper = shallow(
    <SidebarContent match={mock} location={mock} history={mock} />
  )
  expect(wrapper).toMatchSnapshot()
})
