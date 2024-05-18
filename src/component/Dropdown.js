import React, { useState } from 'react'
import { Dropdown, Form, InputGroup } from 'react-bootstrap';
import { FaChevronDown, FaTimes } from "react-icons/fa";

const CustomToggle = React.forwardRef(({ children, onClick, label, clear, required, disabled, clearCallback }, ref) => {
  return (<>
    {disabled ? (
      <Form.Control value={label} />
    ): (
      <InputGroup ref={ref}>
        <Form.Control className="border-end-0" value={label} type="text" disabled={disabled} required={required}  onClick={(e) => { e.preventDefault(); onClick(e); }}/>
        
        {clear === true && (label != null && label !== "") && 
          <InputGroup.Text  className="border-start-0 border-end-0 bg-white">
            <FaTimes onClick={() => clearCallback()}/>
          </InputGroup.Text>
        }
        
        <InputGroup.Text className='border-start-0 bg-white'  onClick={(e) => { e.preventDefault(); onClick(e); }}>
          <FaChevronDown />
        </InputGroup.Text>
      </InputGroup>
    )}
  </>)
});

const CustomMenu = React.forwardRef(({ children, style, className, search, placeholder, 'aria-labelledby': labeledBy }, ref) => {
  const [value, setValue] = useState('');
  
  return (
    <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
      {search && 
        <Form.Control autoFocus className="my-2 w-100" placeholder={placeholder} onChange={(e) => setValue(e.target.value)} value={value} />
      }
      
      <ul className="list-unstyled">
        {React.Children.toArray(children).filter((child) => !value || child.props.children.toLowerCase().includes(value.toLowerCase()))}
      </ul>
    </div>
  );
});

export const DropdownComponent = ({ value, items, onChange, search, placeholder, disabled, required, clear }) => {
  const onSelect = (target) => {
    const item = items.filter((item) => item[0] === target)[0]

    onChange(item[0])
  }

  return (
    <Dropdown autoClose={true} onSelect={onSelect}>
      <Dropdown.Toggle as={CustomToggle} label={value ? items.filter((item) => item[0] === value)[0][1] : ""} required={required} disabled={disabled} clear={clear} clearCallback={() => onChange(null)}/>

      <Dropdown.Menu as={CustomMenu} style={{"width": "100%", "maxHeight": "300px", "overflowY": "auto"}} search={search} placeholder={placeholder}>
        {(items ?? []).map((item) =>
          <Dropdown.Item eventKey={item[0]}>{item[1]}</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export const MultiDropdownComponent = ({ value, items, onChange, search, placeholder, disabled, required, clear }) => {
  const onSelect = (target) => {
    const item = items.filter((item) => item[0] === target)[0]
    const exist = value != null && value.includes(target)

    const clone = value ? [...value] : []
    exist ? clone.splice(clone.indexOf(item[0]), 1) : clone.push(item[0])

    onChange(clone)
  }

  return (
    <Dropdown autoClose="outside" onSelect={onSelect} >
      <Dropdown.Toggle as={CustomToggle} label={(value.length > 0) ? items.filter((item) => value.includes(item[0])).map((item) => item[1]).join(", ") : ""} required={required} disabled={disabled} clear={clear} clearCallback={() => onChange(null)}/>
      <Dropdown.Menu as={CustomMenu} style={{"width": "100%", "maxHeight": "300px", "overflowY": "auto"}} search={search} placeholder={placeholder}>
        {(items ?? []).map((item) =>
          <Dropdown.Item style={{"backgroundColor": value.includes(item[0]) ? "DarkGray" : "white", "color": "black"}} eventKey={item[0]}>{item[1]}</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}
