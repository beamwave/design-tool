import React, { Component } from 'react'
import { connect } from 'react-redux'

export class AchievementsPage extends Component {
  //@ts-ignore
  render = () => {
    return (
      <div className="achievements-page">
        <div className="main">
          <header>
            <h1 className="title">Achievements</h1>
          </header>
          <main>
            <p className="placeholder-text">List all achievements here.</p>
          </main>
        </div>
      </div>
    )
  }
}

export default connect()(AchievementsPage)
