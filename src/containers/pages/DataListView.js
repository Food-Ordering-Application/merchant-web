import React, { useEffect } from 'react'
import { Card, CustomInput, Badge } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { ContextMenuTrigger } from 'react-contextmenu'
import { Colxx } from '../../components/common/CustomBootstrap'
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
  useEffect(() => {
    console.log(window.location.href)
  }, [])

  const onNavLinkClick = () => {
    const path = window.location.href
    window.location.replace(`${path}/item/${product.id}`)
  }
  // const linkTo = `?p=${product.id}` || `#`
  // const linkTo = `/item/${product.id}`

  const linkToTopping = `/app/toppings/item/${product.id}`

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
          <div className='pl-2 d-flex flex-grow-1 min-width-zero'>
            <div
              className='card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center'
              style={{
                padding: '1.75rem 0.75rem',
                opacity: product.isActive ? 1 : 0.4,
              }}
            >
              {isTopping ? (
                <div
                  className='d-flex justify-content-between align-items-lg-center w-100'
                  style={{ minWidth: 250 }}
                >
                  {/* <NavLink to={`?p=${product.id}`} className='w-40 w-sm-100'> */}
                  <NavLink
                    to={linkToTopping}
                    className='w-sm-100'
                    style={{ width: '35%' }}
                  >
                    {/* <a href='/hello'> */}
                    <p className='list-item-heading mb-1 truncate p-1 hover-orange'>
                      {product.title}
                    </p>
                    {/* </a> */}
                  </NavLink>

                  <p
                    className='mb-1 text-muted text-md-small w-sm-100 p-1'
                    style={{ width: '45%' }}
                  >
                    {product.description}
                  </p>

                  <p
                    className='mb-1 text-muted text-md-small w- w-sm-100 p-1'
                    style={{ width: '20%' }}
                  >
                    {product.price}đ
                  </p>
                </div>
              ) : (
                <>
                  <p
                    className='list-item-heading mb-1 truncate hover-orange'
                    style={{ width: '35%' }}
                    onClick={onNavLinkClick}
                  >
                    {product.title}
                  </p>
                  <p
                    className='mb-1 text-muted text-md-small w-sm-100'
                    style={{ width: '25%' }}
                  >
                    {product.category}
                  </p>
                  <p
                    className='mb-1 text-muted text-md-small w-sm-100'
                    style={{ width: '25%' }}
                  >
                    {product.price}đ
                  </p>
                </>
              )}

              <div className='w-15 w-sm-100'>
                <Badge
                  color={product.state === 'IN_STOCK' ? 'primary' : 'danger'}
                  pill
                >
                  {product.state === 'IN_STOCK' ? 'Còn hàng' : 'Hết hàng'}
                </Badge>
              </div>
            </div>
            {/* <div>Hello</div> */}
            <div className='custom-control custom-checkbox pl-1 align-self-center pr-4'>
              <CustomInput
                className='item-check mb-0'
                type='checkbox'
                id={`check_${product.id}`}
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
