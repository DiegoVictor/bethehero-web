import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import NgoContext from '~/contexts/Ngo';
import { setAuthorization } from '~/services/api';

import PrivateRoute from '~/routes/PrivateRoute';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import Incidents from '~/pages/Incidents/Index';
import IncidentCreate from '~/pages/Incidents/Create';
import IfAuthenticatedRedirect from './IfAuthenticatedRedirect';

function Routes() {
  const [ngo, setNgo] = useState({});

  useEffect(() => {
    if (localStorage.bethehero) {
      const store = JSON.parse(localStorage.bethehero);
      if (store) {
        setNgo(store);
      }
    }
  }, []);

  useEffect(() => {
    const { token } = ngo;
    if (token) {
      setAuthorization(token);
    }
  }, [ngo]);

  return (
    <NgoContext.Provider
      value={{
        ngo,
        setNgo,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            index
            element={
              <IfAuthenticatedRedirect>
                <Login />
              </IfAuthenticatedRedirect>
            }
          />
          <Route path="/register" element={<Register />} />

          <Route
            path="/incidents"
            privated
            element={
              <PrivateRoute>
                <Incidents />
              </PrivateRoute>
            }
          />
          <Route
            path="/incidents/create"
            privated
            element={
              <PrivateRoute>
                <IncidentCreate />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </NgoContext.Provider>
  );
}

export default Routes;
