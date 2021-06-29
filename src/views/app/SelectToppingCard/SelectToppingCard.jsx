import React, { useState, useEffect } from 'react'
import { Card, CardBody, CustomInput, Input } from 'reactstrap'

import './SelectToppingCard.scss'

const SelectToppingCard = (props) => {
  const {
    label = 'Topping',
    customPrice,
    value,
    selected,
    onCustomPriceChange,
    onMenuItemAdded,
  } = props

  const [isChecked, setIsChecked] = useState(true)
  const [isAdded, setIsAdded] = useState(selected)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isChecked) {
      onCustomPriceChange(null, value)
    }
  }, [isChecked])

  useEffect(() => {
    onMenuItemAdded(value, isAdded)
  }, [isAdded])

  return (
    <div className='SelectToppingCard mb-3'>
      <Card style={{ opacity: selected ? 1 : '0.4' }}>
        <CardBody>
          <div className='d-flex align-items-center w-100'>
            <p style={{ width: '40%' }}>{label}</p>

            {isChecked ? (
              <p style={{ width: '25%' }}>
                {customPrice}
                {customPrice && 'đ'}
              </p>
            ) : (
              <div className='price-input' style={{ width: '35%' }}>
                <Input
                  type='number'
                  onChange={(e) => onCustomPriceChange(e.target.value, value)}
                />
              </div>
            )}

            <div style={{ width: '28%', textAlign: 'center' }}>
              {selected && (
                <div className='d-flex align-items-center'>
                  <CustomInput
                    className='mb-0'
                    type='checkbox'
                    id={`check_${value}`}
                    defaultChecked={isChecked}
                    onChange={(e) => {
                      console.log(e)
                      setIsChecked((prevState) => !prevState)
                    }}
                    label=''
                  />
                  <span className='default-label'>Giá mặc định </span>
                </div>
              )}
            </div>

            <div
              style={{ width: '7%' }}
              className='d-flex justify-content-center'
            >
              <CustomInput
                className='mb-0'
                type='checkbox'
                id={`check_${value}`}
                defaultChecked={selected}
                onChange={(e) => {
                  setIsAdded((prevState) => !prevState)
                }}
                label=''
              />
            </div>
            {/* <div style={{ width: '10%', textAlign: 'center' }}>
              <div className='d-flex align-items-center'>
                <span className='default-label'>Giá định </span>
                <CustomInput
                  className='mb-0'
                  type='checkbox'
                  id={`select_${value}`}
                  defaultChecked={isChecked}
                  onChange={(e) => {
                    console.log(e)
                    setIsChecked((prevState) => !prevState)
                  }}
                  label=''
                />
              </div>
            </div> */}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default SelectToppingCard
