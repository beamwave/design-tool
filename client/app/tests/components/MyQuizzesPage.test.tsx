import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { MyQuizzesPage } from '../../components/MyQuizzesPage'

/* add mock data for quizzes and quizAttempts (rename to allAttempts or vice versa) */

test('should render MyQuizzesPage component', () => {
  const wrapper = shallow(
    <MyQuizzesPage
      username="PappalooseGoose"
      type="placeholder"
      quizzes={['quizzes array placeholder']}
      quizAttempts={['quizAttempts array placeholder']}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
