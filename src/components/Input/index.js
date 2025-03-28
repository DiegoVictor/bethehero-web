import React from 'react';
import PropTypes from 'prop-types';

import { Container, ErrorMessage } from './styles';

function Input({ name, min, step, error, type, placeholder, ...rest }) {
  return (
    <Container {...rest}>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        min={min}
        step={step}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  min: PropTypes.string,
  step: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
  placeholder: '',
  error: '',
  min: '1',
  step: '0.01',
};

export default Input;
