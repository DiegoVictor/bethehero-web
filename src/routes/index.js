import React, { useState, useEffect, useMemo } from 'react';
import {
  BrowserRouter,
  Routes as BrowserRoutes,
  Route,
} from 'react-router-dom';

import NgoContext from '../contexts/Ngo';
import { setAuthorization } from '../services/api';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Incidents from '../pages/Incidents/Index';
import IncidentCreate from '../pages/Incidents/Create';
import IfAuthenticatedRedirect from './IfAuthenticatedRedirect';

export default () => {
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

  const context = useMemo(
    () => ({
      ngo,
      setNgo,
    }),
    [ngo, setNgo]
  );

  return (
    <NgoContext.Provider value={context}>
      <BrowserRouter>
        <BrowserRoutes>
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
        </BrowserRoutes>
      </BrowserRouter>
    </NgoContext.Provider>
  );
};
