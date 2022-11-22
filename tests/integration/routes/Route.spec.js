import React from 'react';
import { render } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router, Routes, Route } from 'react-router-dom';
import { faker } from '@faker-js/faker';

import NgoContext from '~/contexts/Ngo';
import PrivateRoute from '~/routes/PrivateRoute';
import Incidents from '~/pages/Incidents/Index';
import IfAuthenticatedRedirect from '~/routes/IfAuthenticatedRedirect';
import Login from '~/pages/Login';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  };
});

describe('Route', () => {
  const name = faker.name.fullName();
  const token = faker.random.alphaNumeric(16);

  it('should redirect when not authenticated and request a privated page', () => {
    const history = createBrowserHistory();
    history.push('/incidents');

    render(
      <Router location={history.location} navigator={history}>
        <Routes>
          <Route
            path="/incidents"
            element={
              <PrivateRoute>
                <Incidents />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    );

    expect(history.location.pathname).toBe('/');
  });

  it('should not redirect when not authenticated and request a guest page', () => {
    const history = createBrowserHistory();

    render(
      <Router location={history.location} navigator={history}>
        <Routes>
          <Route
            path="/"
            element={
              <IfAuthenticatedRedirect>
                <Login />
              </IfAuthenticatedRedirect>
            }
          />
        </Routes>
      </Router>
    );

    expect(history.location.pathname).toBe('/');
  });

  it('should redirect when authenticated and request a guest page', async () => {
    const history = createBrowserHistory();

    render(
      <NgoContext.Provider value={{ ngo: { name, token } }}>
        <Router
          location={history.location}
          navigator={history}
          initialEntries={['/']}
        >
          <Routes>
            <Route
              path="/"
              element={
                <IfAuthenticatedRedirect>
                  <Login />
                </IfAuthenticatedRedirect>
              }
            />
            <Route
              path="/incidents"
              element={
                <PrivateRoute>
                  <Incidents />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </NgoContext.Provider>
    );

    expect(history.location.pathname).toBe('/incidents');
  });

  it('should be get the requested page', () => {
    const history = createBrowserHistory();
    history.push('/incidents');

    render(
      <NgoContext.Provider value={{ ngo: { name, token } }}>
        <Router location={history.location} navigator={history}>
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
            <Route
              path="/incidents"
              element={
                <PrivateRoute>
                  <Incidents />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </NgoContext.Provider>
    );

    expect(history.location.pathname).toBe('/incidents');
  });
});
