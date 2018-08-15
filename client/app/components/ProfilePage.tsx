import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface IProps {
  bio
  name
  email
  username
  profileImage
}

export class ProfilePage extends Component<IProps> {
  state = {
    editing: false
  }
  // @ts-ignore
  render = () => {
    const { name, bio } = this.props
    const { editing } = this.state

    return (
      <div className="profile-page">
        <div className="main">
          <section className="profile-top">
            <Dropzone className="dropzone">
              <div className="image">
                <p className="text">Image here</p>
              </div>
            </Dropzone>
            <div className="bio">
              <div className="name-container">
                <p className="name">{name}</p>
                <FontAwesomeIcon icon="pencil-alt" className="name-edit" />
              </div>
              <div className="about-container">
                <p className="about">Javascript developer</p>
                <FontAwesomeIcon icon="pencil-alt" className="about-edit" />
              </div>
              {/* <p className="about">{bio}</p> */}
            </div>
          </section>
          <section className="profile-bottom">
            <p className="info">Profile data</p>
          </section>
        </div>

        {/* <div className="profile-pic-div">
          <div
            className="profile-image"
            style={{
              background: `url(${this.props.profileImage})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '50% 50%',
              width: 300,
              height: 300
            }}
          />
        </div>*/}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  bio: state.auth.bio,
  name: state.auth.name,
  email: state.auth.email,
  username: state.auth.username,
  profileImage: state.auth.profileImage
})

export default connect(mapStateToProps)(ProfilePage)
