import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { CreateQuizPage } from '../../components/CreateQuizPage'

/* add mock function for startCreateNewQuiz */

test('should render CreateQuizPage component', () => {
  const wrapper = shallow(
    <CreateQuizPage
      startCreateNewQuiz={() => 'function'}
      quizzes={['mock quiz data']}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
