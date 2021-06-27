import React, { useEffect } from 'react'
import { Card, CustomInput, Badge } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { ContextMenuTrigger } from 'react-contextmenu'
import { Colxx } from '../../../components/common/CustomBootstrap'
import clsx from 'clsx'

const DataListView = ({
  product,
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
    const path = window.location.href
    window.location.replace(`${path}/item/${product.id}`)
  }

  const linkToTopping = `/app/toppings/item/${product.id}`
  const getColor = (status) => {
    if (status === 'COMPLETED') return '#38d043'
    if (status === 'ORDERED') return '#b22ee9'
    if (status === 'DRAFT') return '#787878'
    if (status === 'CONFIRMED') return '#00ccb8'
    if (status === 'CANCELLED') return '#e92e37'
    return 'orange'
  }

  if (!product) {
    return <div className='loading'></div>
  }

  return (
    <Colxx xxs='12' className={clsx('mb-3')}>
      <ContextMenuTrigger id='menu_id' data={product.id} collect={collect}>
        <Card
          onClick={(event) => onCheckItem(event, product.id)}
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
              <p
                className='list-item-heading mb-1 truncate w-sm-100'
                style={{ width: '22%' }}
                // onClick={onNavLinkClick}
              >
                {product.delivery?.customerName || 'Unknown'}
              </p>
              <p className='mb-1 text-muted text-md-small w-15 w-sm-100'>
                {product.orderItems.length} món
              </p>
              <p className='mb-1 text-muted text-md-small w-15 w-sm-100'>
                {product.grandTotal}đ
              </p>
              <p className='mb-1 text-muted text-md-small w-15 w-sm-100'>
                {product.updatedAt.substring(0, 10)}
              </p>

              <div className='w-15 w-sm-100'>
                {/* <Badge color={getColor(product.status)} pill> */}
                <span
                  style={{
                    backgroundColor: getColor(product.status),
                    padding: '0.55em 0.75em 0.6em 0.75em',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: '10rem',
                    color: 'white',
                    marginBotton: '0.25rem',
                  }}
                >
                  {product.status}
                </span>
              </div>
            </div>
            {/* <div>Hello</div> */}
            {/* <div className='custom-control custom-checkbox pl-1 align-self-center pr-4'>
              <CustomInput
                className='item-check mb-0'
                type='checkbox'
                id={`check_${product.id}`}
                checked={isSelect}
                onChange={() => {}}
                label=''
              />
            </div> */}
          </div>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  )
}

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(DataListView)
