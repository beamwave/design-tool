import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '../../../node_modules/@fortawesome/react-fontawesome'

export class MySidebarContent extends Component {
  // @ts-ignore
  render = () => {
    return (
      <div className="sidebar-content">
        <div className="trash">
          <FontAwesomeIcon icon="trash-alt" />
        </div>
        <div className="categories">
          <div className="category">
            <p>Staging</p>
            <div className="angle-right">
              <FontAwesomeIcon icon="angle-right" />
            </div>
          </div>
          <div className="category">
            <p>Moodboards</p>
            <div className="angle-right">
              <FontAwesomeIcon icon="angle-right" />
            </div>
          </div>
          <div className="category">
            <p>Collections</p>{' '}
            <div className="angle-right">
              <FontAwesomeIcon icon="angle-right" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(MySidebarContent)
