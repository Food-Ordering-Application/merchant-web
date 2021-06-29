import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Badge,
  Form,
  Label,
  Input,
} from 'reactstrap'
import axios from 'axios'
import { useParams } from 'react-router-dom'

import Select from 'react-select'

import {
  setStaffList,
  setStaff as setStaffAction,
} from '../../../redux/actions'
import { createFile, sortByDay, uploadFile } from 'src/helpers/Utils'
import IntlMessages from '../../../helpers/IntlMessages'
import { Colxx, Separator } from '../../../components/common/CustomBootstrap'
import Breadcrumb from '../../../containers/navs/Breadcrumb'
import FormikBasicFieldLevel from '../../../containers/form-validations/FormikBasicFieldLevel'
import ProfileForm from '../../../components/forms/ProfileForm'
import UploadImage from '../../../components/common/UploadImage'
import { NotificationManager } from 'src/components/common/react-notifications'
import HourSelect from '../../HourSelect'
import Map from '../../../components/map/Map'

import { BASE_URL, STAFF_URL, USER_URL } from 'src/constants'
import './StaffEdit.scss'

const activeOptions = [
  { value: true, label: 'Kích hoạt' },
  { value: false, label: 'Ẩn' },
]

const stockStateOptions = [
  { value: 'IN_STOCK', label: 'Còn hàng' },
  { value: 'OUT_OF_STOCK', label: 'Hết hàng' },
]

const StaffEdit = (props) => {
  const { staffId } = useParams()
  const {
    staffUser: { staffs = [] },
    history,
  } = props

  const staffInfo = staffs.find((item) => item.id === staffId)

  const [staff, setStaff] = useState({
    id: '',
    firstName: '',
    lastName: '',
    fullName: '',
    phone: '',
    IDNumber: '',
    dateOfBirth: '',
  })

  const [loading, setLoading] = useState(false)
  const [loadingImage, setLoadingImage] = useState(false)
  const [loadingStaffList, setLoadingStaffList] = useState(false)

  const merchantId = localStorage.getItem('merchant_id')
  const restaurantId = localStorage.getItem('restaurant_id')

  useEffect(() => {
    if (staffs.length === 0) {
      fetchStaffList()
    }
  }, [])

  useEffect(() => {
    if (staffs.length > 0) {
      setStaff({ ...staffInfo })
    }
  }, [staffs])

  const fetchStaffList = async (page = 0, pageSize) => {
    try {
      setLoadingStaffList(true)
      const accessToken = localStorage.getItem('access_token')
      const { data } = await axios({
        method: 'GET',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/staff`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page,
          size: pageSize,
        },
      })

      if (!data) return

      const {
        data: { results = [], size, total },
      } = data

      const { setStaffList } = props

      //   const pageSize = 10
      // const pageSize = size
      // const newTableData = {
      //   status: true,
      //   totalItem: total,
      //   totalPage: Math.ceil(total / pageSize),
      //   pageSize,
      //   currentPage: '1',
      //   data: results,
      // }

      setStaffList(results)
    } catch (error) {
      console.log('Error in fetching staff list')
      console.log(error)
    } finally {
      setLoadingStaffList(false)
    }
  }

  const updateStaff = async () => {
    let res
    try {
      setLoading(true)

      let updatedStaff = { ...staff }
      const accessToken = localStorage.getItem('access_token')
      res = await axios({
        method: 'PATCH',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/staff/${staffId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          ...updatedStaff,
        },
      })
      const { setStaffAction } = props
      setStaffAction(updatedStaff)
      NotificationManager.success('Updated staff information', 'Success', 3000)
    } catch (error) {
      console.log('Error in fetchStaffInfo')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const redirecToEditProduct = () => {
    const path = window.location.href
    const editPath = path.replace('item', 'edit')
    window.location.replace(editPath)
  }

  const onFormChange = (e) => {
    const {
      target: { name, value },
    } = e

    setStaff((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  // const onActiveChange = ({ value }) => {
  //   setToppingItem((prevState) => ({
  //     ...prevState,
  //     isActive: value,
  //   }))
  // }

  // const onStockStateChange = ({ value }) => {
  //   setToppingItem((prevState) => ({
  //     ...prevState,
  //     state: value,
  //   }))
  // }

  const onSubmit = () => {
    const { id, firstNname, lastName, phone, IDNumber, dateOfBirth } = staff

    updateStaff()
  }

  if (loadingStaffList) {
    return <div className='loading'></div>
  }

  return (
    <div className='StaffEdit'>
      <Row>
        <Colxx xxs='12' md='6' className='mb-4'>
          <div className='create-restaurant-container'>
            <Card
              className='create-restaurant-card'
              style={{ padding: '30px 40px' }}
            >
              <div className='form-restaurant'>
                <CardTitle className='mb-4'>
                  <IntlMessages id='menu.edit-staff' />
                </CardTitle>

                <Form onChange={onFormChange} className='mt-4'>
                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='text'
                      name='fullName'
                      defaultValue={staff.fullName}
                    />
                    <IntlMessages id='menu.full-name' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='text'
                      name='firstName'
                      defaultValue={staff.firstName}
                    />
                    <IntlMessages id='menu.first-name' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='text'
                      name='lastName'
                      defaultValue={staff.lastName}
                    />
                    <IntlMessages id='menu.last-name' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='text'
                      name='phone'
                      defaultValue={staff.phone}
                    />
                    <IntlMessages id='menu.phone' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='text'
                      name='dateOfBirth'
                      defaultValue={staff.dateOfBirth}
                    />
                    <IntlMessages id='menu.date-of-birth' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='number'
                      name='IDNumber'
                      defaultValue={staff.IDNumber}
                    />
                    <IntlMessages id='menu.id-number' />
                  </Label>

                  <div className='d-flex justify-content-end align-items-center'>
                    <Button
                      color='primary'
                      size='lg'
                      onClick={() => {
                        history.push(`/app/staffs/${staffId}`)
                      }}
                    >
                      <span className='label'>
                        <IntlMessages id='back-button' />
                      </span>
                    </Button>

                    <Button
                      color='primary'
                      className={`btn-shadow btn-multiple-state ml-3 ${
                        loading ? 'show-spinner' : ''
                      }`}
                      size='lg'
                      disabled={loading}
                      onClick={onSubmit}
                    >
                      <span className='spinner d-inline-block'>
                        <span className='bounce1' />
                        <span className='bounce2' />
                        <span className='bounce3' />
                      </span>
                      <span className='label'>
                        <IntlMessages id='restaurant.update-button' />
                      </span>
                    </Button>
                  </div>
                </Form>
              </div>
            </Card>
          </div>
        </Colxx>
      </Row>
    </div>
  )
}

const mapStateToProps = ({ staffUser }) => ({
  staffUser,
})

// export default connect(mapStateToProps, mapDispatchToProps)(MenuItemDetail)
export default connect(mapStateToProps, { setStaffList, setStaffAction })(
  StaffEdit
)
