import React from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';

import Theme from '../../styles/theme';

export default function Layout({ children }) {
  return (
    <>
      <Theme />
      <ToastContainer autoClose={false} closeOnClick={false} />
      {children}
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};
