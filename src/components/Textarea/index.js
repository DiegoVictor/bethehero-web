import React from 'react';
import PropTypes from 'prop-types';

import { Container, ErrorMessage } from './styles';

function Input({ name, error, type, placeholder, ...rest }) {
  return (
    <Container {...rest}>
      <textarea name={name} type={type} placeholder={placeholder} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
  placeholder: '',
  error: '',
};

export default Input;
