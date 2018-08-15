import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { SettingsPage } from '../../components/SettingsPage'

test('should render SettingsPage component', () => {
  const wrapper = shallow(
    <SettingsPage
      username="marty_slackjaw"
      name="Marty"
      email="marty@slackjaw.com"
      photo="https://martyslack.jpg"
      file="https://martyslack.jpg"
      hideModal={() => 'placeholder function'}
      startUpdateUser={() => `placeholder function`}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
