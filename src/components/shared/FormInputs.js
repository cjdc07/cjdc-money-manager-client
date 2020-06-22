import React, { Fragment, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

function FieldContainer({id, label, children}) {
  return (
    <Fragment>
      <label htmlFor={id} className="f5 b mb2">{label}</label>
      <div className="mb2">
        {children}
      </div>
    </Fragment>
  );
}

export function FormInputTextArea({ id, value, onChange, placeholder, label, validator }) {
  return (
    <Fragment>
      <FieldContainer id={id} label={label}>
        <div className="w-100 mb1 pa2 ba br2 b--black-40">
          <textarea
            id={id}
            className="min-w-100 bw0"
            value={value}
            onChange={onChange}
            type="text"
            placeholder={placeholder}
          />
        </div>
        <span className="red f6">{validator && validator.message(id, value, 'required')}</span>
      </FieldContainer>
    </Fragment>
  );
}

export function FormInputSelect({ id, value, onChange, label, data, validator, disabled }) {
  return (
    <Fragment>
      <FieldContainer id={id} label={label}>
        <div className="flex flex-column w-100 h-auto mb1 pa2 ba br2 b--black-40">
          <div className="flex justify-between">
            <div className="flex w-100">
              <select className="w-100 bw0 bb" defaultValue={value} onChange={onChange} disabled={disabled}>
                <option value="" default>-- Select Account -- </option>
                {data.map((item) => (<option key={item.id} value={item.id}>{item.name}</option>))}
              </select>
            </div>
          </div>
        </div>
        <span className="red f6">{validator && validator.message(id, value, 'required')}</span>
      </FieldContainer>
    </Fragment>
  )
}

export function FormInputSelectCategory({ id, value, onChange, label, data, validator }) {
  const [ showDropdown, setShowDropdown ] = useState(false);
  const [ selections, setSelections ] = useState(data);
  const [ selected, setSelected ] = useState('');

  useEffect(() => {
    setSelected(value ? value : '');
  }, [value])

  const filterSelection = (filter) => {
    setSelections(data.filter((selection) => selection.value.toLowerCase().includes(filter.toLowerCase())));
  };

  // TODO: Fix implementation. category id should be used as value

  return (
    <Fragment>
      <FieldContainer id={id} label={label}>
        <div className="flex flex-column w-100 h-auto mb1 pa2 ba br2 b--black-40">
          <div className="flex justify-between">
            <div className="flex w-100">
              <input
                className="w-100 bw0 bb"
                value={selected}
                onChange={(e) => {
                  if (!showDropdown) {
                    setShowDropdown(true);
                  }
                  filterSelection(e.target.value);
                  setSelected(e.target.value);
                  onChange(e.target.value)
                }}
                onClick={() => {
                  if (!showDropdown) {
                    setShowDropdown(true);
                  }
                  filterSelection(selected);
                }}
                type="text"
                placeholder={'Category'}
              />
            </div>
            <div
              className="w-10 pr1"
              onClick={() => {
                setShowDropdown(!showDropdown);
                filterSelection(selected);
              }}
            >
              {showDropdown
                ? <FontAwesomeIcon icon={faCaretUp} className="fr"/>
                : <FontAwesomeIcon icon={faCaretDown} className="fr"/>
              }
            </div>
          </div>
          <div className={`${showDropdown ? 'db' : 'dn'} max-h4 overflow-y-auto`}>
            <ul className="list pa0 pt1 pl1 ma0">
              {(selected !== '' || selections.length < 1)
                && (
                  <li
                    onClick={() => setShowDropdown(false)}
                    className={`mv2 gray ${(selections.length === 1 && (selections[0].value.toLowerCase() === selected.toLowerCase())) && 'dn'}`}
                    key={selected}
                    value={selected}
                  >
                    {`(Create ${selected} category)`}
                  </li>
                )
              }
              {selections.map(selection => (
                <li
                  onClick={() => {
                    setSelected(selection.value);
                    onChange(selection.value);
                    setShowDropdown(false);
                  }}
                  className="mv2"
                  key={selection.value}
                  value={selection.value}>{selection.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <span className="red f6">{validator && validator.message(id, value, 'required')}</span>
      </FieldContainer>
    </Fragment>
  );
}

export function FormInputText({ id, value, onChange, placeholder, label, validator, type = 'text', disabled }) {
  return (
    <Fragment>
      <FieldContainer id={id} label={label}>
        <div className="w-100 mb1 pa2 ba br2 b--black-40">
          <input
            id={id}
            className="min-w-100 bw0"
            value={value}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
        <span className="red f6">{validator && validator.message(id, value, 'required')}</span>
      </FieldContainer>
    </Fragment>
  );
}

export function FormInputCurrency({ id, value, onChange, placeholder, label, validator, disabled }) {
  return (
    <Fragment>
      <FieldContainer id={id} label={label}>
        <div className="flex items-center w-100 mb1 pa1 ba br2 b--black-40">
          <span className="pa1 f4 b">₱</span>
          <input
            id={id}
            className="min-w-90 bw0"
            value={value}
            onChange={onChange}
            type="text"
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
        <span className="red f6">{validator && validator.message(id, value, 'required|numeric')}</span>
      </FieldContainer>
    </Fragment>
  );
}
