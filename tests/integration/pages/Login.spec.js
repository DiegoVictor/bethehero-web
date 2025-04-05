import React from 'react';
import { act, render, fireEvent, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import MockAdapter from 'axios-mock-adapter';
import { faker } from '@faker-js/faker';

import NgoContext from '../../../src/contexts/Ngo';
import api from '../../../src/services/api';
import Login from '../../../src/pages/Login';

const apiMock = new MockAdapter(api);
const setNgo = jest.fn();
const id = faker.number.int();
const name = faker.person.fullName();
const token = faker.string.alphanumeric(16);

const mockError = jest.fn();
jest.mock('react-toastify', () => {
  return {
    ...jest.requireActual('react-toastify'),
    toast: {
      error: (message) => mockError(message),
    },
  };
});

describe('Login', () => {
  it('should be able to login', async () => {
    apiMock.onPost('sessions').reply(200, { ngo: { id, name }, token });

    const setItem = jest.spyOn(localStorage, 'setItem');

    const context = { ngo: {}, setNgo };
    const Stub = createRoutesStub([
      {
        path: '/login',
        Component: () => (
          <NgoContext.Provider value={context}>
            <Login />
          </NgoContext.Provider>
        ),
      },
      {
        path: '/register',
        Component: () => <div>Register</div>,
      },
    ]);

    render(<Stub initialEntries={['/login']} />);

    fireEvent.change(screen.getByPlaceholderText('Seu ID'), {
      target: { value: id },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit'));
    });

    expect(setItem).toHaveBeenCalledWith(
      'bethehero',
      JSON.stringify({ id, name, token })
    );
    expect(setNgo).toHaveBeenCalledWith({ id, name, token });
  });

  it('should not be able to login', async () => {
    apiMock.onPost('sessions').reply(400);

    const context = { ngo: {}, setNgo };
    const Stub = createRoutesStub([
      {
        path: '/login',
        Component: () => (
          <NgoContext.Provider value={context}>
            <Login />
          </NgoContext.Provider>
        ),
      },
      {
        path: '/register',
        Component: () => <div>Register</div>,
      },
    ]);

    render(<Stub initialEntries={['/login']} />);

    fireEvent.change(screen.getByPlaceholderText('Seu ID'), {
      target: { value: id },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit'));
    });

    expect(mockError).toHaveBeenCalledWith('Usuário e/ou senha incorreto(s)!');
  });

  it('should form validation fail', async () => {
    const context = { ngo: {}, setNgo };
    const Stub = createRoutesStub([
      {
        path: '/login',
        Component: () => (
          <NgoContext.Provider value={context}>
            <Login />
          </NgoContext.Provider>
        ),
      },
      {
        path: '/register',
        Component: () => <div>Register</div>,
      },
    ]);

    render(<Stub initialEntries={['/login']} />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit'));
    });

    expect(
      screen.getByText('Por favor, informe o id da ONG')
    ).toBeInTheDocument();
  });

  it('should be able to navigate to register page', () => {
    const context = { ngo: {}, setNgo };
    const Stub = createRoutesStub([
      {
        path: '/login',
        Component: () => (
          <NgoContext.Provider value={context}>
            <Login />
          </NgoContext.Provider>
        ),
        index: true,
      },
      {
        path: '/register',
        Component: () => <div>Register</div>,
      },
    ]);
    render(<Stub initialEntries={['/login']} />);

    fireEvent.click(screen.getByTestId('register'));

    expect(screen.getByText('Register')).toBeInTheDocument();
  });
});
