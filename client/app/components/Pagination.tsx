import React, { Component } from 'react'

interface IProps {
  items: any
  initialPage: number
  onChangePage?: (length: number, page?: number, size?: number) => any
  getPager?: (
    totalItems?: number,
    currentPage?: number,
    pageSize?: number
  ) => any
}

interface IState {
  pager: {
    totalPages?: number
    startIndex?: number
    endIndex?: number
    currentPage?: number
  }
  totalPage?: number
}

export class Pagination extends Component<IProps, IState> {
  // constructor(props) {
  //     super(props);
  //     this.state = { pager: {} };
  // }

  state = {
    pager: {} as any
  }

  // @ts-ignore
  componentWillMount = () => {
    const { items, initialPage } = this.props
    // set page if items array isn't empty
    if (items && items.length) this.setPage(initialPage)
  }

  // @ts-ignore
  componentDidUpdate = (prevProps, prevState) => {
    const { items, initialPage } = this.props

    // @ts-ignore
    // reset page if items array has changed
    if (items !== prevProps.items) {
      this.setPage(initialPage)
    }
  }

  setPage = page => {
    const { items, onChangePage } = this.props
    const { pager } = this.state

    if (page < 1 || page > pager.totalPages) {
      return
    }

    // @ts-ignore
    // get new pager object for specified page
    let newPager = this.getPager(items.length, page)

    // get new page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1)

    // update state
    this.setState({ pager: newPager })

    // call change page function in parent component
    onChangePage(pageOfItems)
  }

  getPager = (totalItems, currentPage, pageSize) => {
    // default to first page
    currentPage = currentPage || 1

    // default page size is 10
    pageSize = pageSize || 10

    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize)

    let startPage, endPage
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1
      endPage = totalPages
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1
        endPage = 10
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9
        endPage = totalPages
      } else {
        startPage = currentPage - 5
        endPage = currentPage + 4
      }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1)

    // create an array of pages to ng-repeat in the pager control
    const pages = [...Array(endPage + 1 - startPage).keys()].map(
      i => startPage + i
    )

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    }
  }

  // @ts-ignore
  render = () => {
    const { pager } = this.state

    if (!pager.pages || pager.pages.length <= 1) {
      // don't display pager if there is only 1 page
      return null
    }

    return (
      <ul className="pagination">
        <li className={pager.currentPage === 1 ? 'disabled' : ''}>
          <a onClick={() => this.setPage(1)}>First</a>
        </li>
        <li className={pager.currentPage === 1 ? 'disabled' : ''}>
          <a onClick={() => this.setPage(pager.currentPage - 1)}>Previous</a>
        </li>
        {pager.pages.map((page, index) => (
          <li
            key={index}
            className={pager.currentPage === page ? 'active' : ''}
          >
            <a onClick={() => this.setPage(page)}>{page}</a>
          </li>
        ))}
        <li
          className={pager.currentPage === pager.totalPages ? 'disabled' : ''}
        >
          <a onClick={() => this.setPage(pager.currentPage + 1)}>Next</a>
        </li>
        <li
          className={pager.currentPage === pager.totalPages ? 'disabled' : ''}
        >
          <a onClick={() => this.setPage(pager.totalPages)}>Last</a>
        </li>
      </ul>
    )
  }
}

export default Pagination
