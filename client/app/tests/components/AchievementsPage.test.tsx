import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { AchievementsPage } from '../../components/AchievementsPage'

test('should render AchievementsPage component', () => {
  const wrapper = shallow(<AchievementsPage />)
  expect(wrapper).toMatchSnapshot()
})
