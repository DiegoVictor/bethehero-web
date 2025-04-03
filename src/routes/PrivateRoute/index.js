import React, { useContext } from 'react';
import { Navigate } from 'react-router';
import PropTypes from 'prop-types';

import NgoContext from 'contexts/Ngo';

function PrivateRoute({ children }) {
  const { ngo } = useContext(NgoContext);

  if (!ngo.token) {
    return <Navigate to="/" />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired,
};

export default PrivateRoute;
