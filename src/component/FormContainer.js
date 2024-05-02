import React, { useState, useRef, Children, cloneElement, forwardRef, useImperativeHandle } from "react";
import { Form } from "react-bootstrap";

import { DropdownComponent, MultiDropdownComponent } from "./Dropdown";
import { DatePickerComponent } from "./DatePicker";

export const FormText = ({ label, name, value, onChange, required, disabled, type }) => {
  return (
    <Form.Group className="m-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control type={type} value={value} required={required} disabled={disabled} onChange={(e)=> onChange(name, e.target.value)}/>
    </Form.Group>
  )
}

export const FormDropdown = ({ label, name, value, onChange, required, disabled, multiple, items, search, placeholder }) => {
  return (
    <Form.Group className="m-3">
      <Form.Label>{label}</Form.Label>
      {multiple ? 
        <MultiDropdownComponent value={value} items={items} onChange={(value) => onChange(name, value)} required={required} disabled={disabled} search={search} placeholder={placeholder}/>
      :
        <DropdownComponent value={value} items={items} onChange={(value) => onChange(name, value)} required={required} disabled={disabled} search={search} placeholder={placeholder}/>
      }
    </Form.Group>
  )
}

export const FormDatepicker = ({ label, name, value, onChange, required, disabled, type, range, max, min }) => {
  return (
    <Form.Group className="m-3">
      <Form.Label>{label}</Form.Label>
      <DatePickerComponent date={value} type={type} range={range} max={max} min={min} required={required} disabled={disabled} onChange = {(value) => onChange(name, value)}/>
    </Form.Group>
  )
}

export const FormContainer = forwardRef(({ state, children }, ref) => {
  const initialState = state ?? {}
  
  const [formState, setFormState] = useState(initialState)
  const formStateRef = useRef(initialState)

  const onChange = (k, v) => {
    setFormState(prev => ({ ...prev, [k]: v}))
    formStateRef.current[k] = v
  }

  const handler = {
    getState: () => {
      return formStateRef.current
    }
  }

  useImperativeHandle(ref, () => handler)

  return (<>
    {Children.map(children, child => {
      return cloneElement(child, { value: formState[child.props.name], onChange: onChange })
    })}
  </>)
})
