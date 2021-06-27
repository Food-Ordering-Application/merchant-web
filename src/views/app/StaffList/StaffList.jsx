import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Colxx, Separator } from '../../../components/common/CustomBootstrap'
import Bluebird from 'bluebird'
import { USER_URL } from 'src/constants'
import { accessToken } from 'mapbox-gl'
import { connect } from 'react-redux'
import { Row, Col, Button } from 'reactstrap'
import { setStaffList } from '../../../redux/actions'
import DataList from './data-list'
import IntlMessages from '../../../helpers/IntlMessages'
import { NotificationManager } from 'src/components/common/react-notifications'

import './StaffList.scss'

const StaffList = (props) => {
  const merchantId = localStorage.getItem('merchant_id')
  const restaurantId = localStorage.getItem('restaurant_id')

  const [loadingStaffList, setLoadingStaffList] = useState(false)
  const [tableData, setTableData] = useState({ data: [] })
  const [selectedItems, setSelectedItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { history, staffs: staffList } = props

  useEffect(() => {
    fetchStaffList()
  }, [])

  const fetchStaffList = async () => {
    try {
      setLoadingStaffList(true)
      const accessToken = localStorage.getItem('access_token')
      const { data } = await axios({
        method: 'GET',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/staff`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!data) return

      const {
        data: { results = [], size, total },
      } = data

      const { setStaffList } = props

      //   const pageSize = 10
      const pageSize = size
      const newTableData = {
        status: true,
        totalItem: total,
        totalPage: Math.ceil(total / pageSize),
        pageSize,
        currentPage: '1',
        data: results,
      }

      setTableData(newTableData)
      setStaffList(results, history)
    } catch (error) {
      console.log('Error in fetching staff list')
      console.log(error)
    } finally {
      setLoadingStaffList(false)
    }
  }

  const onDeleteItems = async () => {
    try {
      setLoading(true)
      const accessToken = localStorage.getItem('access_token')

      await Bluebird.map(selectedItems, async (staffId) => {
        const { data } = await axios({
          method: 'DELETE',
          url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/staff/${staffId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        if (!data) return
      })

      setTableData((prevState) => {
        return {
          ...prevState,
          data: prevState.data.filter(
            (item) => !selectedItems.includes(item.id)
          ),
        }
      })
      NotificationManager.success(
        `Deleted ${selectedItems.length} staffs!`,
        'Success',
        3000
      )
      // getMenuItems({ merchantId, restaurantId, menuId })
    } catch (error) {
      console.log('Error in Delete Menu Items')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onSelect = (ids) => {
    setSelectedItems(ids)
  }

  const redirectToCreateStaff = () => {
    history.push('/app/staffs/create')
  }

  if (loadingStaffList) {
    return <div className='loading'></div>
  }

  if (tableData.data.length === 0) {
    return (
      <div>
        <p>Nhà hàng chưa có tài khoản nhân viên nào. Tạo mới ngay!</p>
        <Button
          color='primary'
          size='lg'
          className='top-right-button mr-2'
          onClick={redirectToCreateStaff}
        >
          <IntlMessages id='pages.add-new' />
        </Button>
      </div>
    )
  }

  return (
    <div className='StaffList'>
      <Row>
        <Colxx xxs='12'>
          <Separator className='mb-5' />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs='12' className='mb-4'>
          <p>
            <IntlMessages id='menu.staff-list' />
          </p>
          {tableData.data.length > 0 && (
            <DataList
              history={history}
              data={tableData}
              onDeleteItems={onDeleteItems}
              onSelect={onSelect}
            />
          )}
        </Colxx>
      </Row>
    </div>
  )
}

const mapStateToProps = ({ staffUser: { staffs, loadingStaffList } }) => ({
  staffs,
  loadingStaffList,
})

export default connect(mapStateToProps, { setStaffList })(StaffList)
