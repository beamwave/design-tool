import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import numeral from 'numeral'
import ReactGridGallery from 'react-grid-gallery'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '../../../node_modules/@fortawesome/react-fontawesome'

interface IProps {
  username: string
  category: string
  images: any[]
}

interface IState {
  images: any[]
}

export class DashboardPage extends Component<IProps, IState> {
  state = {
    images: []
  }

  check = obj => obj !== undefined && obj !== null

  // @ts-ignore
  componentDidMount = () => {
    const { images: imagesFromServer } = this.props
    let images
    if (this.check(imagesFromServer))
      images = imagesFromServer.map(image => ({
        src: image.url,
        thumbnail: image.url,
        thumbnailHeight: image.height,
        thumbnailWidth: image.width
      }))

    this.setState({ images })
  }

  //@ts-ignore
  render = () => {
    const { category, images: imagesFromServer } = this.props
    const { images } = this.state
    const alive = this.check(imagesFromServer)
    return (
      <main className="dashboard-page">
        {
          <div>
            <section className="image-results">
              {alive &&
                imagesFromServer.length === 0 && (
                  <div>No images to display.</div>
                )}
              {alive &&
                imagesFromServer.length > 0 && (
                  <ReactGridGallery
                    images={this.check(imagesFromServer) ? images : []}
                    enableImageSelection={false}
                  />
                )}
            </section>
            <aside className="primary-config">
              {category === 'art' && (
                <main>
                  <form className="filter-container">
                    <label htmlFor="select">medium</label>
                    <div className="angle-down">
                      <FontAwesomeIcon icon="angle-down" className="icon" />
                    </div>
                    <select
                      name="select"
                      className="select"
                      value={category}
                      // onChange={this.handleCategoryChange}
                    >
                      <option value="art">art</option>
                      <option value="comments">comments</option>
                      <option value="clothes">clothes</option>
                      <option value="people">people</option>
                    </select>
                  </form>
                  <form className="filter-container">
                    <label htmlFor="select">device</label>
                    <div className="angle-down">
                      <FontAwesomeIcon icon="angle-down" className="icon" />
                    </div>
                    <select
                      name="select"
                      className="select"
                      value={category}
                      // onChange={this.handleCategoryChange}
                    >
                      <option value="art">art</option>
                      <option value="comments">comments</option>
                      <option value="clothes">clothes</option>
                      <option value="people">people</option>
                    </select>
                  </form>
                  <form className="filter-container">
                    <label htmlFor="select">project</label>
                    <div className="angle-down">
                      <FontAwesomeIcon icon="angle-down" className="icon" />
                    </div>
                    <select
                      name="select"
                      className="select"
                      value={category}
                      // onChange={this.handleCategoryChange}
                    >
                      <option value="art">art</option>
                      <option value="comments">comments</option>
                      <option value="clothes">clothes</option>
                      <option value="people">people</option>
                    </select>
                  </form>
                </main>
              )}
              {category === 'comments' && (
                <main>
                  <form className="filter-container">
                    <label htmlFor="select">topic</label>
                    <div className="angle-down">
                      <FontAwesomeIcon icon="angle-down" className="icon" />
                    </div>
                    <select
                      name="select"
                      className="select"
                      value={category}
                      // onChange={this.handleCategoryChange}
                    >
                      <option value="art">art</option>
                      <option value="comments">comments</option>
                      <option value="clothes">clothes</option>
                      <option value="people">people</option>
                    </select>
                  </form>
                  <form className="filter-container">
                    <label htmlFor="select">style</label>
                    <div className="angle-down">
                      <FontAwesomeIcon icon="angle-down" className="icon" />
                    </div>
                    <select
                      name="select"
                      className="select"
                      value={category}
                      // onChange={this.handleCategoryChange}
                    >
                      <option value="art">art</option>
                      <option value="comments">comments</option>
                      <option value="clothes">clothes</option>
                      <option value="people">people</option>
                    </select>
                  </form>
                  <form className="filter-container">
                    <label htmlFor="select">site</label>
                    <div className="angle-down">
                      <FontAwesomeIcon icon="angle-down" className="icon" />
                    </div>
                    <select
                      name="select"
                      className="select"
                      value={category}
                      // onChange={this.handleCategoryChange}
                    >
                      <option value="art">art</option>
                      <option value="comments">comments</option>
                      <option value="clothes">clothes</option>
                      <option value="people">people</option>
                    </select>
                  </form>
                </main>
              )}
              {category === 'clothes' && (
                <main>
                  <form className="filter-container">
                    <label htmlFor="select">wardrobe</label>
                    <div className="angle-down">
                      <FontAwesomeIcon icon="angle-down" className="icon" />
                    </div>
                    <select
                      name="select"
                      className="select"
                      value={category}
                      // onChange={this.handleCategoryChange}
                    >
                      <option value="art">art</option>
                      <option value="comments">comments</option>
                      <option value="clothes">clothes</option>
                      <option value="people">people</option>
                    </select>
                  </form>
                  <form className="filter-container">
                    <label htmlFor="select">attire</label>
                    <div className="angle-down">
                      <FontAwesomeIcon icon="angle-down" className="icon" />
                    </div>
                    <select
                      name="select"
                      className="select"
                      value={category}
                      // onChange={this.handleCategoryChange}
                    >
                      <option value="art">art</option>
                      <option value="comments">comments</option>
                      <option value="clothes">clothes</option>
                      <option value="people">people</option>
                    </select>
                  </form>
                </main>
              )}
              {category === 'people' && (
                <main>
                  <form className="filter-container">
                    <label htmlFor="select">mood</label>
                    <div className="angle-down">
                      <FontAwesomeIcon icon="angle-down" className="icon" />
                    </div>
                    <select
                      name="select"
                      className="select"
                      value={category}
                      // onChange={this.handleCategoryChange}
                    >
                      <option value="art">art</option>
                      <option value="comments">comments</option>
                      <option value="clothes">clothes</option>
                      <option value="people">people</option>
                    </select>
                  </form>
                  <form className="filter-container">
                    <label htmlFor="select">group</label>
                    <div className="angle-down">
                      <FontAwesomeIcon icon="angle-down" className="icon" />
                    </div>
                    <select
                      name="select"
                      className="select"
                      value={category}
                      // onChange={this.handleCategoryChange}
                    >
                      <option value="art">art</option>
                      <option value="comments">comments</option>
                      <option value="clothes">clothes</option>
                      <option value="people">people</option>
                    </select>
                  </form>
                  <form className="filter-container">
                    <label htmlFor="select">angle</label>
                    <div className="angle-down">
                      <FontAwesomeIcon icon="angle-down" className="icon" />
                    </div>
                    <select
                      name="select"
                      className="select"
                      value={category}
                      // onChange={this.handleCategoryChange}
                    >
                      <option value="art">art</option>
                      <option value="comments">comments</option>
                      <option value="clothes">clothes</option>
                      <option value="people">people</option>
                    </select>
                  </form>
                </main>
              )}
            </aside>
            <aside className="secondary-config">
              {category === 'art' && (
                <main>
                  <div className="filter-group">
                    <div className="input-group">
                      <label htmlFor="color">color</label>
                      <input
                        className="input"
                        name="color"
                        type="text"
                        placeholder="#hex or name"
                      />
                      <div className="color-group">
                        <div className="color-1" />
                        <div className="color-2" />
                        <div className="color-3" />
                        <FontAwesomeIcon icon="angle-right" className="icon" />
                      </div>
                    </div>
                  </div>
                  <div className="filter-group">
                    <div className="input-group">
                      <label htmlFor="length">length</label>
                      <input name="length" type="text" placeholder="px" />
                    </div>
                    <div className="input-group">
                      <label htmlFor="width">width</label>
                      <input name="width" type="text" placeholder="px" />
                    </div>
                  </div>
                </main>
              )}
              {category === 'comments' && (
                <main>
                  <div className="filter-group">
                    <div className="input-group">
                      <label htmlFor="username">username</label>
                      <input className="names" name="username" type="text" />
                    </div>
                  </div>
                </main>
              )}
              {category === 'clothes' && (
                <main>
                  <div className="filter-group">
                    <div className="input-group">
                      <label htmlFor="color">color</label>
                      <input
                        className="input"
                        name="color"
                        type="text"
                        placeholder="#hex or name"
                      />
                      <div className="color-group">
                        <div className="color-1" />
                        <div className="color-2" />
                        <div className="color-3" />
                        <FontAwesomeIcon icon="angle-right" className="icon" />
                      </div>
                    </div>
                  </div>
                  <div className="filter-group gender">
                    <div className="input-group">
                      <label>gender</label>
                      <FontAwesomeIcon icon="male" className="male-icon" />
                    </div>
                    <div className="input-group">
                      <FontAwesomeIcon icon="female" className="female-icon" />
                    </div>
                  </div>
                </main>
              )}
              {category === 'people' && (
                <main>
                  <div className="filter-group">
                    <div className="input-group">
                      <label htmlFor="name">name</label>
                      <input className="names" name="name" type="text" />
                    </div>
                  </div>
                  <div className="filter-group gender">
                    <div className="input-group">
                      <label>gender</label>
                      <FontAwesomeIcon icon="male" className="male-icon" />
                    </div>
                    <div className="input-group">
                      <FontAwesomeIcon icon="female" className="female-icon" />
                    </div>
                  </div>
                </main>
              )}
            </aside>
          </div>
        }
      </main>
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  username: state.auth.username,
  category: state.app.category,
  images: state.images.all
})

export default connect(mapStateToProps)(DashboardPage)