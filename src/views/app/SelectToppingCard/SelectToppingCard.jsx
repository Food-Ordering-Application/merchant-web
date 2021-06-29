import React, { useState, useEffect } from 'react'
import { Card, CardBody, CustomInput, Input } from 'reactstrap'

import './SelectToppingCard.scss'

const SelectToppingCard = (props) => {
  const { label = 'Topping', customPrice, value, onCustomPriceChange } = props

  const [isChecked, setIsChecked] = useState(true)

  useEffect(() => {
    if (isChecked) {
      onCustomPriceChange(null, value)
    }
  }, [isChecked])

  return (
    <div className='SelectToppingCard mb-3'>
      <Card>
        <CardBody>
          <div className='d-flex align-items-center w-100'>
            <p style={{ width: '40%' }}>{label}</p>

            {isChecked ? (
              <p style={{ width: '30%' }}>
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

            <div style={{ width: '20%', textAlign: 'center' }}>
              <div className='d-flex align-items-center'>
                <span className='default-label'>Giá mặc định </span>
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
              </div>
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
