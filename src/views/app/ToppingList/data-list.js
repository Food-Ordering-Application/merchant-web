import React, { Component, Fragment } from 'react'
import { Row } from 'reactstrap'
import axios from 'axios'
import isEqual from 'lodash.isequal'

import { servicePath } from '../../../constants/defaultValues'
import DataListView from '../../../containers/pages/DataListView'
import Pagination from '../../../containers/pages/Pagination'
import ContextMenuContainer from '../../../containers/pages/ContextMenuContainer'
import ListPageHeading from '../../../containers/pages/ListPageHeading'
import ImageListView from '../../../containers/pages/ImageListView'
import ThumbListView from '../../../containers/pages/ThumbListView'
import AddNewModal from '../../../containers/pages/AddNewModal'

// import mockData from './mockData.json'

function collect(props) {
  return { data: props.data }
}
const apiUrl = servicePath + '/cakes/paging'

const temp = {
  status: true,
  totalItem: 20,
  totalPage: 2,
  pageSize: '10',
  currentPage: '1',
  data: [
    {
      id: 18,
      title: 'Cơm chiên',
      img: '/assets/img/bebinca-thumb.jpg',
      category: 'Món chính',
      status: 'Đang chuẩn bị',
      statusColor: 'secondary',
      description: 'Homemade cheesecake with fresh berries and mint',
      sales: 574,
      stock: 16,
      date: '01.04.2021',
    },
  ],
}

class DataListPages extends Component {
  constructor(props) {
    super(props)
    this.mouseTrap = require('mousetrap')

    this.state = {
      displayMode: 'list',

      selectedPageSize: 10,
      orderOptions: [
        { column: 'title', label: 'Tên sản phẩm' },
        { column: 'category', label: 'Category' },
        { column: 'status', label: 'Status' },
      ],
      pageSizes: [10, 20, 30, 50, 100],

      categories: [
        { label: 'Món chính', value: 'Món chính', key: 0 },
        { label: 'Món phụ', value: 'Món phụ', key: 1 },
        { label: 'Món thêm', value: 'Món phụ', key: 2 },
        { label: 'Món tráng miệng', value: 'Món tráng miệng', key: 3 },
      ],

      selectedOrderOption: { column: 'title', label: 'Tên sản phẩm' },
      dropdownSplitOpen: false,
      modalOpen: false,
      currentPage: 1,
      totalItemCount: 0,
      totalPage: 1,
      search: '',
      selectedItems: [],
      lastChecked: null,
      isLoading: false,
    }
  }
  componentDidMount() {
    this.dataListRender()
    this.mouseTrap.bind(['ctrl+a', 'command+a'], () =>
      this.handleChangeSelectAll(false)
    )
    this.mouseTrap.bind(['ctrl+d', 'command+d'], () => {
      this.setState({
        selectedItems: [],
      })
      return false
    })
  }

  componentWillUnmount() {
    this.mouseTrap.unbind('ctrl+a')
    this.mouseTrap.unbind('command+a')
    this.mouseTrap.unbind('ctrl+d')
    this.mouseTrap.unbind('command+d')
  }

  toggleModal = () => {
    const { history } = this.props
    history.push(`/app/dishes/create`)
    // this.setState({
    //   modalOpen: !this.state.modalOpen,
    // })
  }

  changeOrderBy = (column) => {
    this.setState(
      {
        selectedOrderOption: this.state.orderOptions.find(
          (x) => x.column === column
        ),
      },
      () => this.dataListRender()
    )
  }
  changePageSize = (size) => {
    this.setState(
      {
        selectedPageSize: size,
        currentPage: 1,
      },
      () => this.dataListRender()
    )
  }
  changeDisplayMode = (mode) => {
    this.setState({
      displayMode: mode,
    })
    return false
  }
  onChangePage = (page) => {
    this.props.handlePageChange(page)
    this.setState(
      {
        currentPage: page,
      },
      () => this.dataListRender()
    )
  }

  onSearchKey = (e) => {
    if (e.key === 'Enter') {
      this.setState(
        {
          search: e.target.value.toLowerCase(),
        },
        () => this.dataListRender()
      )
    }
  }

  onCheckItem = (event, id) => {
    if (
      event.target.tagName === 'A' ||
      (event.target.parentElement && event.target.parentElement.tagName === 'A')
    ) {
      return true
    }
    if (this.state.lastChecked === null) {
      this.setState({
        lastChecked: id,
      })
    }

    let selectedItems = this.state.selectedItems
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter((x) => x !== id)
    } else {
      selectedItems.push(id)
    }
    const { onSelect } = this.props
    onSelect(selectedItems)
    this.setState({
      selectedItems,
    })

    if (event.shiftKey) {
      var items = this.state.items
      var start = this.getIndex(id, items, 'id')
      var end = this.getIndex(this.state.lastChecked, items, 'id')
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1)
      selectedItems.push(
        ...items.map((item) => {
          return item.id
        })
      )
      selectedItems = Array.from(new Set(selectedItems))
      onSelect(selectedItems)
      this.setState({
        selectedItems,
      })
    }
    document.activeElement.blur()
  }

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i
      }
    }
    return -1
  }
  handleChangeSelectAll = (isToggle) => {
    const { onSelect } = this.props
    if (this.state.selectedItems.length >= this.state.items.length) {
      if (isToggle) {
        this.setState({
          selectedItems: [],
        })
        onSelect([])
      }
    } else {
      const newSelectedItems = this.state.items.map((x) => x.id)
      this.setState({
        selectedItems: newSelectedItems,
      })
      onSelect(newSelectedItems)
    }
    document.activeElement.blur()
    return false
  }

  dataListRender(itemArr) {
    const { selectedPageSize, currentPage, selectedOrderOption, search } =
      this.state

    const { data = {} } = this.props
    let items = itemArr || data.data

    if (search) {
      items = items.filter((item) => {
        return item.title.toString().toLowerCase().includes(search)
      })
    }

    this.setState({
      totalPage: data.totalPage,
      items,
      selectedItems: [],
      totalItemCount: data.totalItem,
      isLoading: true,
    })
  }

  onContextMenuClick = (e, data, target) => {
    console.log('onContextMenuClick - selected items', this.state.selectedItems)
    console.log('onContextMenuClick - action : ', data.action)
  }

  onContextMenu = (e, data) => {
    const clickedProductId = data.data
    if (!this.state.selectedItems.includes(clickedProductId)) {
      this.setState({
        selectedItems: [clickedProductId],
      })
    }

    return true
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      data: { data: prevData },
    } = this.props
    const {
      data: { data: nextData },
    } = nextProps
    if (!isEqual(prevData, nextData)) {
      this.dataListRender(nextData)
      return true
    }
    return true
  }

  render() {
    const {
      currentPage,
      items,
      displayMode,
      selectedPageSize,
      totalItemCount,
      selectedOrderOption,
      selectedItems,
      orderOptions,
      pageSizes,
      modalOpen,
      categories,
    } = this.state
    const {
      match,
      subData = [],
      onDeleteItems,
      onActiveItems,
      onDeactiveItems,
      isTopping,
    } = this.props
    const startIndex = (currentPage - 1) * selectedPageSize
    const endIndex = currentPage * selectedPageSize

    return !this.state.isLoading ? (
      <div className='loading' />
    ) : (
      <Fragment>
        <div className='disable-text-selection'>
          <ListPageHeading
            heading='menu.topping-data-list'
            displayMode={displayMode}
            changeDisplayMode={this.changeDisplayMode}
            handleChangeSelectAll={this.handleChangeSelectAll}
            changeOrderBy={this.changeOrderBy}
            changePageSize={this.changePageSize}
            selectedPageSize={selectedPageSize}
            totalItemCount={totalItemCount}
            selectedOrderOption={selectedOrderOption}
            match={match}
            startIndex={startIndex}
            endIndex={endIndex}
            selectedItemsLength={selectedItems ? selectedItems.length : 0}
            itemsLength={items ? items.length : 0}
            onSearchKey={this.onSearchKey}
            orderOptions={orderOptions}
            pageSizes={pageSizes}
            toggleModal={this.toggleModal}
            onDeleteItems={onDeleteItems}
            onDeactiveItems={onDeactiveItems}
            onActiveItems={onActiveItems}
            isTopping={isTopping}
          />
          <AddNewModal
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            categories={categories}
          />
          <Row>
            {this.state.items.map((product) => {
              if (this.state.displayMode === 'imagelist') {
                return (
                  <ImageListView
                    key={product.id}
                    product={product}
                    isSelect={this.state.selectedItems.includes(product.id)}
                    collect={collect}
                    onCheckItem={this.onCheckItem}
                  />
                )
              } else if (this.state.displayMode === 'thumblist') {
                return (
                  <ThumbListView
                    key={product.id}
                    product={product}
                    isSelect={this.state.selectedItems.includes(product.id)}
                    collect={collect}
                    onCheckItem={this.onCheckItem}
                  />
                )
              } else {
                return (
                  <DataListView
                    key={product.id}
                    large
                    isTopping={true}
                    product={product}
                    isSelect={this.state.selectedItems.includes(product.id)}
                    onCheckItem={this.onCheckItem}
                    collect={collect}
                    subItems={[{ name: 'ASdasda' }, { name: 'LOLOL' }]}
                  />
                )
              }
            })}
            <Pagination
              currentPage={this.props.currentPage || this.state.currentPage}
              totalPage={this.props.totalPage || this.state.totalPage}
              onChangePage={(i) => this.onChangePage(i)}
            />
            <ContextMenuContainer
              onContextMenuClick={this.onContextMenuClick}
              onContextMenu={this.onContextMenu}
            />
          </Row>
        </div>
      </Fragment>
    )
  }
}
export default DataListPages
