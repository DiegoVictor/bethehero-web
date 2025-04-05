import React from 'react';
import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { faker } from '@faker-js/faker';

import NgoContext from '../../../src/contexts/Ngo';
import PrivateRoute from '../../../src/routes/PrivateRoute';
import Incidents from '../../../src/pages/Incidents/Index';
import IfAuthenticatedRedirect from '../../../src/routes/IfAuthenticatedRedirect';
import Login from '../../../src/pages/Login';

const mockNavigate = jest.fn();
jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate(),
  };
});

jest.mock('react-infinite-scroll-hook', () => {
  // eslint-disable-next-line global-require
  const { useRef } = require('react');
  return {
    __esModule: true,
    default: function useInfiniteScroll() {
      return [useRef()];
    },
  };
});

describe('Route', () => {
  const name = faker.person.fullName();
  const token = faker.string.alphanumeric(16);

  it('should redirect when not authenticated and request a privated page', () => {
    const Stub = createRoutesStub([
      {
        path: '/incidents',
        Component: () => (
          <PrivateRoute>
            <Incidents />
          </PrivateRoute>
        ),
      },
      {
        path: '/',
        Component: () => <div>Home</div>,
      },
    ]);
    render(<Stub initialEntries={['/incidents']} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should not redirect when not authenticated and request a guest page', () => {
    const context = { ngo: {}, setNgo: jest.fn() };
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: () => (
          <NgoContext.Provider value={context}>
            <IfAuthenticatedRedirect>
              <Login />
            </IfAuthenticatedRedirect>
          </NgoContext.Provider>
        ),
      },
      {
        path: '/incidents',
        Component: () => <div>Incidents</div>,
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    expect(screen.getByText('Faça seu logon')).toBeInTheDocument();
  });

  it('should redirect when authenticated and request a guest page', async () => {
    const ngo = { name, token };
    const context = { ngo };

    const Stub = createRoutesStub([
      {
        path: '/',
        Component: () => (
          <NgoContext.Provider value={context}>
            <IfAuthenticatedRedirect>
              <Login />
            </IfAuthenticatedRedirect>
          </NgoContext.Provider>
        ),
      },
      {
        path: '/incidents',
        Component: () => <div>Incidents</div>,
      },
    ]);
    render(<Stub initialEntries={['/']} />);

    expect(screen.getByText('Incidents')).toBeInTheDocument();
  });

  it('should be get the requested page', async () => {
    const context = { ngo: { name, token } };
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: () => (
          <NgoContext.Provider value={context}>
            <IfAuthenticatedRedirect>
              <Login />
            </IfAuthenticatedRedirect>
          </NgoContext.Provider>
        ),
      },
      {
        path: '/incidents',
        Component: () => (
          <NgoContext.Provider value={context}>
            <PrivateRoute>
              <Incidents />
            </PrivateRoute>
          </NgoContext.Provider>
        ),
      },
    ]);
    render(<Stub initialEntries={['/']} />);

    expect(screen.getByText('Casos')).toBeInTheDocument();
  });
});
