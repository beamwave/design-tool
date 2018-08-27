import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactGridGallery from 'react-grid-gallery'
import { FontAwesomeIcon } from '../../../node_modules/@fortawesome/react-fontawesome'
import { check } from '../helpers/helpers'
import { filter } from '../actions/filter'

interface FData {
  category: string
  value: string
}

interface IProps {
  username: string
  category: string
  categories?: any
  images: any[]
  filters?: any[]
  filter?: (by: FData) => any
  history?: any
}

interface IState {
  images: any[]
}

export class DashboardPage extends Component<IProps, IState> {
  state = {
    images: [],
    categories: 'map an object'
  }

  // filter images
  handleFilterChange = ({ target }) => {
    const { filters, filter } = this.props
    // "medium", "device", "wardrobe", "mood", etc.
    // console.log('dataset', target.dataset.filterName)
    // console.log('value', target.value)

    const by = {
      category: target.dataset.filterName,
      value: target.value
    }

    filter(by)
  }

  handleThumbnailClick = (i, e) => {
    const { images, history } = this.props
    const imageId = images[i]._id
    history.push(`/image/${imageId}`)
  }

  componentDidMount = () => {
    const { images: imagesFromServer } = this.props
    console.log('imagesFromServer', imagesFromServer)
    let images
    if (check(imagesFromServer) && Array.isArray(imagesFromServer))
      images = imagesFromServer.map(image => ({
        src: image.url,
        thumbnail: image.url,
        thumbnailHeight: image.height,
        thumbnailWidth: image.width
      }))

    this.setState({ images })
  }

  render = () => {
    const {
      category,
      categories,
      images: imagesFromServer,
      filters
    } = this.props
    const { images } = this.state
    const alive = check(imagesFromServer)
    return (
      <main className="dashboard-page">
        {
          <div>
            <section className="image-results">
              {alive &&
                imagesFromServer.length === 0 && (
                  <p className="null-case">No images to display.</p>
                )}
              {alive &&
                imagesFromServer.length > 0 && (
                  <ReactGridGallery
                    images={check(imagesFromServer) ? images : []}
                    enableImageSelection={false}
                    onClickThumbnail={this.handleThumbnailClick}
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
                      value={filters['medium']}
                      data-filter-name="medium"
                      onChange={this.handleFilterChange}
                    >
                      {categories !== undefined &&
                      categories.hasOwnProperty('medium') ? (
                        categories['medium'].map(option => (
                          <option key={option.name} value={option.name}>
                            {option.name}
                          </option>
                        ))
                      ) : (
                        <option value="n/a">n/a</option>
                      )}
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
                      value={filters['device']}
                      data-filter-name="device"
                      onChange={this.handleFilterChange}
                    >
                      {categories !== undefined &&
                      categories.hasOwnProperty('device') ? (
                        categories['medium'].map(option => (
                          <option key={option.name} value={option.name}>
                            {option.name}
                          </option>
                        ))
                      ) : (
                        <option value="n/a">n/a</option>
                      )}
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
                      value={filters['project']}
                      data-filter-name="project"
                      onChange={this.handleFilterChange}
                    >
                      {categories !== undefined &&
                      categories.hasOwnProperty('device') ? (
                        categories['medium'].map(option => (
                          <option key={option.name} value={option.name}>
                            {option.name}
                          </option>
                        ))
                      ) : (
                        <option value="n/a">n/a</option>
                      )}
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
                      value={filters['topic']}
                      data-filter-name="topic"
                      onChange={this.handleFilterChange}
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
                      value={filters['style']}
                      data-filter-name="style"
                      onChange={this.handleFilterChange}
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
                      value={filters['site']}
                      data-filter-name="site"
                      onChange={this.handleFilterChange}
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
                      value={filters['wardrobe']}
                      data-filter-name="wardrobe"
                      onChange={this.handleFilterChange}
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
                      value={filters['attire']}
                      data-filter-name="attire"
                      onChange={this.handleFilterChange}
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
                      value={filters['mood']}
                      data-filter-name="mood"
                      onChange={this.handleFilterChange}
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
                      value={filters['group']}
                      data-filter-name="group"
                      onChange={this.handleFilterChange}
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
                      value={filters['angle']}
                      data-filter-name="angle"
                      onChange={this.handleFilterChange}
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

const mapStateToProps = (state, props) => ({
  token: state.auth.token,
  username: state.auth.username,
  category: state.app.category,
  categories: state.images.categories,
  images: state.images.all,
  filters: state.filters
})

export default connect<any>(
  mapStateToProps,
  { filter }
)(DashboardPage)
