import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { Modal } from '../../components/Modal'

/* add mock function for onClose */

test('should render Modal component', () => {
  const wrapper = shallow(<Modal onClose={() => `placeholder function`} />)
  expect(wrapper).toMatchSnapshot()
})
