import React, { Component, Fragment } from 'react'
import { Row } from 'reactstrap'

import axios from 'axios'

import { servicePath } from '../../../constants/defaultValues'

import Pagination from '../../../containers/pages/Pagination'
import ContextMenuContainer from '../../../containers/pages/ContextMenuContainer'
import ListPageHeading from '../../../containers/pages/ListPageHeading'
import DataListView from './DataListView'
import ImageListView from './ImageListView'
import ThumbListView from './ThumbListView'
import AddNewModal from '../../../containers/pages/AddNewModal'
import isEqual from 'lodash.isequal'
import Select from 'react-select'

function collect(props) {
  return { data: props.data }
}
const apiUrl = servicePath + '/cakes/paging'

// const temp = {
//   status: true,
//   totalItem: 20,
//   totalPage: 2,
//   pageSize: '10',
//   currentPage: '1',
//   data: [
//     {
//       id: 18,
//       title: 'Cơm chiên',
//       img: '/assets/img/bebinca-thumb.jpg',
//       category: 'Món chính',
//       status: 'Đang chuẩn bị',
//       statusColor: 'secondary',
//       description: 'Homemade cheesecake with fresh berries and mint',
//       sales: 574,
//       stock: 16,
//       date: '01.04.2021',
//     },
//   ],
// }

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

  componentDidUpdate(prevProps) {
    const {
      data: { data: newData },
    } = this.props
    const {
      data: { data: prevData },
      prevPage,
    } = prevProps

    if (!isEqual(newData, prevData)) {
      this.dataListRender()
    }
  }

  componentWillUnmount() {
    this.mouseTrap.unbind('ctrl+a')
    this.mouseTrap.unbind('command+a')
    this.mouseTrap.unbind('ctrl+d')
    this.mouseTrap.unbind('command+d')
  }

  toggleModal = () => {
    const { history } = this.props
    // history.push(`/app/staffs/create`)
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
    this.props.onPageChange(page)
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
    if (!event.target.className.includes('custom-control')) {
      // Menu item clicked
      const { history } = this.props
      // history.push(`/app/dishes/${id}`)
    }
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

    const { onSelect } = this.props
    let selectedItems = this.state.selectedItems

    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter((x) => x !== id)
    } else {
      selectedItems.push(id)
    }
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
      this.setState({
        selectedItems,
      })
      onSelect(selectedItems)
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

  dataListRender() {
    const { selectedPageSize, currentPage, selectedOrderOption, search } =
      this.state
    const { data = {}, isTopping = false } = this.props

    let items = data.data
    items = items.filter(
      (item) =>
        item.delivery &&
        item.delivery.customerName &&
        item.delivery.customerName.toLowerCase().includes(search)
    )
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

  timeOptions = [
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
  ]

  onTimeSelect = ({ value }) => {
    this.props.onTimeSelect(value)
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
    const { match, onDeleteItems } = this.props
    const startIndex = (currentPage - 1) * selectedPageSize
    const endIndex = currentPage * selectedPageSize

    return !this.state.isLoading || this.props.loading ? (
      <div className='loading' />
    ) : (
      <Fragment>
        <div className='disable-text-selection'>
          <ListPageHeading
            heading='menu.order-list'
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
            // isStaffList={true}
            isOrderList
          />
          <div
            style={{ width: '110px', marginBottom: '15px', marginLeft: 'auto' }}
          >
            <Select
              className={`react-select`}
              placeholder={'Chọn tháng'}
              classNamePrefix='react-select-active-state'
              options={this.timeOptions}
              value={this.timeOptions.find(
                (option) => option.value === this.props.time
              )}
              styles={{
                // Fixes the overlapping problem of the component
                menu: (provided) => ({ ...provided, zIndex: 9999 }),
              }}
              onChange={this.onTimeSelect}
              // onBlur={handleBlur}
            />
          </div>
          <AddNewModal
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            categories={categories}
          />
          <Row>
            {this.state.items.map((product) => {
              if (this.state.displayMode === 'imagelist') {
                return (
                  // <ImageListView
                  //   key={product.id}
                  //   product={product}
                  //   isSelect={this.state.selectedItems.includes(product.id)}
                  //   collect={collect}
                  //   onCheckItem={this.onCheckItem}
                  // />
                  <DataListView
                    key={product.id}
                    product={product}
                    isSelect={this.state.selectedItems.includes(product.id)}
                    onCheckItem={this.onCheckItem}
                    collect={collect}
                  />
                )
              } else if (this.state.displayMode === 'thumblist') {
                return (
                  // <ThumbListView
                  //   key={product.id}
                  //   product={product}
                  //   isSelect={this.state.selectedItems.includes(product.id)}
                  //   collect={collect}
                  //   onCheckItem={this.onCheckItem}
                  // />
                  <DataListView
                    key={product.id}
                    product={product}
                    isSelect={this.state.selectedItems.includes(product.id)}
                    onCheckItem={this.onCheckItem}
                    collect={collect}
                  />
                )
              } else {
                return (
                  <DataListView
                    key={product.id}
                    product={product}
                    isSelect={this.state.selectedItems.includes(product.id)}
                    onCheckItem={this.onCheckItem}
                    collect={collect}
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
