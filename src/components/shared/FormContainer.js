import React from 'react';

function FormContainer({ children, onSubmit }) {
  return (
    <form
      className="flex flex-column items-stretch overflow-y-auto pa3"
      onSubmit={onSubmit}
    >
      {children}
    </form>
  )
}

export default FormContainer;
