import { Field, Formik } from 'formik'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Form, FormGroup, Label } from 'reactstrap'
import IntlMessages from 'src/helpers/IntlMessages'

const MenuGroupCreate = (props) => {
  const initialValues = {
    name: '',
    index: '',
    isActive: true,
  }

  const handleSubmit = (values) => {
    const { createMenuGroup, loading, history } = props
    if (!loading) {
      if (values.name !== '' && values.index !== '') {
        props.onSubmit(values)
        // createMenuGroup(values, history)
      }
    }
  }

  const validateName = (value) => {
    let error
    if (!value || !value.trim()) {
      error = `Please enter menu group's name`
    } else if (value.length < 2) {
      error = 'Value must be longer than 2 characters'
    }
    return error
  }

  const validateIndex = (value) => {
    let error
    if (!value) {
      error = `Please enter menu group's index`
    } else if (isNaN(value)) {
      error = 'Value must be a number'
    }
    return error
  }

  return (
    <div className='mb-4'>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ errors, touched, handleSubmit }) => (
          <Form
            className='av-tooltip tooltip-label-bottom'
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <FormGroup className='form-group has-float-label'>
              <Label>
                <IntlMessages id='menu.group-name' />
              </Label>
              <Field
                className='form-control'
                name='name'
                validate={validateName}
              />
              {errors.name && touched.name && (
                <div className='invalid-feedback d-block'>{errors.name}</div>
              )}
            </FormGroup>

            <FormGroup className='form-group has-float-label'>
              <Label>
                <IntlMessages id='menu.group-index' />
              </Label>
              <Field
                className='form-control'
                name='index'
                type='number'
                validate={validateIndex}
              />
              {errors.index && touched.index && (
                <div className='invalid-feedback d-block'>{errors.index}</div>
              )}
            </FormGroup>

            <Button
              color='primary'
              className={`btn-shadow btn-multiple-state`}
              size='lg'
            >
              <span className='spinner d-inline-block'>
                <span className='bounce1' />
                <span className='bounce2' />
                <span className='bounce3' />
              </span>
              <span className='label'>
                <IntlMessages id='menu.menu-group-create-btn' />
              </span>
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default MenuGroupCreate
