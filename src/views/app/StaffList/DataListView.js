import React, { useEffect } from 'react'
import { Card, CustomInput, Badge } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { ContextMenuTrigger } from 'react-contextmenu'
import { Colxx } from '../../../components/common/CustomBootstrap'
import clsx from 'clsx'

const DataListView = ({
  product: driver,
  isSelect,
  collect,
  onCheckItem,
  subItems = [],
  large,
  isTopping,
  onItemClick,
  history,
}) => {
  useEffect(() => {}, [])

  const onNavLinkClick = () => {
    // const path = window.location.href
    // window.location.replace(`${path}/item/${product.id}`)
    console.log('Hello')
  }
  // const linkTo = `?p=${product.id}` || `#`
  // const linkTo = `/item/${product.id}`

  if (!driver) {
    return <div className='loading'></div>
  }

  return (
    <Colxx xxs='12' className={clsx('mb-3')}>
      <ContextMenuTrigger id='menu_id' data={driver.id} collect={collect}>
        <Card
          onClick={(event) => onCheckItem(event, driver.id)}
          className={classnames('d-flex flex-row', {
            active: isSelect,
          })}
        >
          {/* <NavLink to={linkToTopping} className='w-40 w-sm-100'></NavLink> */}
          <div className='pl-2 d-flex flex-grow-1 min-width-zero'>
            <div
              className='card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center'
              style={{
                padding: '1.75rem 0.75rem',
              }}
            >
              {/* <div onClick={onNavLinkClick}> */}
              <NavLink
                to={`/app/staffs/${driver.id}`}
                className='w-15 w-sm-100'
                // onClick={onNavLinkClick}
              >
                <p className='list-item-heading mb-1 truncate'>
                  {driver.IDNumber}
                </p>
              </NavLink>
              {/* </div> */}
              {/* <p className='mb-1 text-md-small w-15 w-sm-100'>
                {product.IDNumber}
              </p> */}
              <p className='mb-1 text-muted text-md-small w-15 w-sm-100'>
                {driver.username}
              </p>
              <p className='mb-1 text-muted text-md-small w-15 w-sm-100'>
                {driver.fullName}
              </p>
              <p className='mb-1 text-muted text-md-small w-15 w-sm-100'>
                {driver.phone}
              </p>
              <p className='mb-1 text-muted text-md-small w-15 w-sm-100'>
                {driver.dateOfBirth}
              </p>
              {/* <div className='w-15 w-sm-100'>
                <Badge color={product.statusColor} pill>
                  {product.status}
                </Badge>
              </div> */}
            </div>
            {/* <div>Hello</div> */}
            <div className='custom-control custom-checkbox pl-1 align-self-center pr-4'>
              <CustomInput
                className='item-check mb-0'
                type='checkbox'
                id={`check_${driver.id}`}
                checked={isSelect}
                onChange={() => {}}
                label=''
              />
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  )
}

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(DataListView)
