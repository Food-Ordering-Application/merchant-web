import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap'
import axios from 'axios'
import { useParams } from 'react-router-dom'

import { getToppingItems, getMenus } from '../../../redux/actions'
import { Colxx, Separator } from '../../../components/common/CustomBootstrap'

import './StaffDetail.scss'

const StaffDetail = (props) => {
  const { staffId } = useParams()

  const {
    staffUser: { staffs = [] },
    history,
  } = props
  const merchantId = localStorage.getItem('merchant_id')
  const restaurantId = localStorage.getItem('restaurant_id')
  const [loading, setLoading] = useState(false)

  const staff = staffs.find((item) => item.id === staffId)

  const redirecToEditStaff = () => {
    history.push(`/app/staffs/edit/${staffId}`)
  }

  if (!staff) {
    return <div className='loading'></div>
  }

  const { IDNumber, dateOfBirth, fullName, phone, username: userName } = staff

  return (
    <div className='StaffDetail'>
      <p className='title'>{fullName}</p>
      <Separator className='mb-4 mt-3' />

      <Row className='mt-4'>
        <Colxx md='6' className=''>
          <Card>
            <CardBody>
              <div className='section'>
                <p className='section-heading'>
                  Số ID: <span className='text-orange bold'>{IDNumber}</span>
                </p>
              </div>

              <div className='section'>
                <p className='section-heading'>
                  Tên đăng nhập:{' '}
                  <span className='text-orange bold'>{userName}</span>
                </p>
              </div>

              <div className='section'>
                <p className='section-heading'>
                  Số điện thoại:{' '}
                  <span className='text-orange bold'>{phone}</span>
                </p>
              </div>

              <div className='section'>
                <p className='section-heading'>
                  Ngày sinh:{' '}
                  <span className='text-orange bold'>
                    {dateOfBirth.replaceAll(`-`, `/`)}
                  </span>
                </p>
              </div>

              <div className='section'>
                <p className='section-heading bold'>Nhân viên</p>
              </div>

              <Button
                color='primary'
                style={{ marginLeft: 'auto', display: 'block' }}
                onClick={redirecToEditStaff}
              >
                Chỉnh sửa
              </Button>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </div>
  )
}

const mapStateToProps = ({ staffUser }) => ({
  staffUser,
})

// export default connect(mapStateToProps, mapDispatchToProps)(MenuItemDetail)
export default connect(mapStateToProps, { getToppingItems, getMenus })(
  StaffDetail
)
