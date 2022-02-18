import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import NgoContext from '~/contexts/Ngo';

export default function IfAuthenticatedRedirect({ children }) {
  const { ngo } = useContext(NgoContext);

  if (ngo?.token) {
    return <Navigate to="/incidents" />;
  }

  return children;
}

IfAuthenticatedRedirect.propTypes = {
  children: PropTypes.element.isRequired,
};
