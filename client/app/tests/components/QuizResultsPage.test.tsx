import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { QuizResultsPage } from '../../components/QuizResultsPage'

test('should render QuizResultsPage component', () => {
  const wrapper = shallow(<QuizResultsPage quiz="quiz placeholder" />)
  expect(wrapper).toMatchSnapshot()
})
