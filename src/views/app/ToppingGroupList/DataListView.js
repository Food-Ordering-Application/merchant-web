import React, { useEffect } from 'react'
import { Card, CustomInput, Badge } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { ContextMenuTrigger } from 'react-contextmenu'
import { Colxx } from '../../../components/common/CustomBootstrap'
import clsx from 'clsx'

const DataListView = ({
  product: group,
  isSelect,
  collect,
  onCheckItem,
  subItems = [],
  large,
  isTopping,
  onItemClick,
  history,
}) => {
  console.log('Hello')
  useEffect(() => {}, [])

  const onNavLinkClick = () => {
    const path = window.location.href
    window.location.replace(`${path}/item/${group.id}`)
  }

  const linkToTopping = `/app/toppings/item/${group.id}`
  const getColor = (status) => {
    if (status === 'COMPLETED') return '#38d043'
    if (status === 'ORDERED') return '#b22ee9'
    if (status === 'DRAFT') return '#787878'
    if (status === 'CONFIRMED') return '#00ccb8'
    if (status === 'CANCELLED') return '#e92e37'
    return 'orange'
  }

  console.log(group)

  if (!group) {
    return <div className='loading'></div>
  }

  return null
  return (
    <Colxx xxs='12' className={clsx('mb-3')}>
      <ContextMenuTrigger id='menu_id' data={group.id} collect={collect}>
        <Card
          onClick={(event) => onCheckItem(event, group.id)}
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
              >
                {group.name || 'Unknown'}
              </p>
              <p className='mb-1 text-muted text-md-small w-15 w-sm-100'>
                {group.index}
              </p>
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  )
}

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(DataListView)
