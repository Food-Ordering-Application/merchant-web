import React, { useState } from 'react'
import ImageUploading from 'react-images-uploading'
import IntlMessages from '../../../helpers/IntlMessages'

import './upload.scss'

const UploadImage = (props) => {
  const { onImageChange, limit = 2, defaultImageUrl } = props

  const [images, setImages] = useState([])
  const [controlVisible, setControlVisible] = useState(false)
  const [showDefaultImg, setShowDefaultImg] = useState(true)
  const maxNumber = 1

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex)
    setImages(imageList)
    onImageChange(imageList, addUpdateIndex)
  }

  const onMouseOver = () => {
    setControlVisible(true)
  }

  const onMouseLeave = () => {
    setControlVisible(false)
  }

  return (
    <div className='image-upload-container'>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey='data_url'
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className='upload__image-wrapper'>
            <span
              className='upload-select-btn'
              style={isDragging ? { color: 'red' } : undefined}
              onClick={(a, b) => {
                setShowDefaultImg(false)
                onImageUpload(a, b)
              }}
              {...dragProps}
            >
              <IntlMessages id='restaurant.click-or-drop' />
            </span>
            &nbsp;
            {limit !== 1 && (
              <button
                type='button'
                onClick={(a, b) => {
                  setShowDefaultImg(false)
                  onImageRemoveAll(a, b)
                }}
              >
                <IntlMessages id='restaurant.remove-all' />
              </button>
            )}
            {defaultImageUrl && showDefaultImg && (
              <div className='default-img'>
                <img src={defaultImageUrl} alt='default' />
              </div>
            )}
            {imageList.map((image, index) => (
              <div key={index} className='image-item'>
                <img
                  src={image['data_url']}
                  alt=''
                  width='100'
                  onMouseOver={onMouseOver}
                />
                {controlVisible && (
                  <div
                    className='image-item__btn-wrapper d-flex align-items-center justify-content-center'
                    onMouseOver={onMouseOver}
                    onMouseLeave={onMouseLeave}
                  >
                    <button
                      type='button'
                      className='mr-2'
                      // onMouseOver={() => console.log('HIHI')}
                      onClick={() => {
                        onImageUpdate(index)
                      }}
                    >
                      <IntlMessages id='restaurant.update' />
                    </button>
                    <button
                      type='button'
                      onMouseOver={onMouseOver}
                      onClick={() => onImageRemove(index)}
                    >
                      <IntlMessages id='restaurant.remove' />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  )
}

export default UploadImage
