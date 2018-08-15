import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { SearchResults } from '../../components/SearchResults'

test('should render SearchResults component', () => {
  const wrapper = shallow(
    <SearchResults
      query="html"
      quizzes={['array of quizzes placeholder']}
      showSearch={true}
      startGetSearchedQuiz={() => `placeholder function`}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
