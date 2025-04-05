import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import MockAdapter from 'axios-mock-adapter';

import api from '../../../src/services/api';
import Register from '../../../src/pages/Register';
import factory from '../../utils/factory';

const mockSuccess = jest.fn();
const mockError = jest.fn();
jest.mock('react-toastify', () => {
  return {
    ...jest.requireActual('react-toastify'),
    toast: {
      success: (message) => mockSuccess(message),
      error: (message) => mockError(message),
    },
  };
});

const mockNavigate = jest.fn();
jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate(),
  };
});

const apiMock = new MockAdapter(api);

describe('Register', () => {
  it('should be able to register', async () => {
    const { id, name, email, whatsapp, city, state } =
      await factory.attrs('Ngo');

    apiMock.onPost('ngos').reply(200, { id });

    const navigate = jest.fn();
    mockNavigate.mockReturnValueOnce(navigate);

    const Stub = createRoutesStub([
      {
        path: '/register',
        Component: () => <Register />,
      },
      {
        path: '/',
        Component: () => <div>Home</div>,
      },
    ]);

    render(<Stub initialEntries={['/register']} />);

    fireEvent.change(screen.getByPlaceholderText('Nome da ONG'), {
      target: { value: name },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: email },
    });
    fireEvent.change(screen.getByPlaceholderText('WhatsApp'), {
      target: { value: whatsapp.substring(0, 10) },
    });
    fireEvent.change(screen.getByPlaceholderText('Cidade'), {
      target: { value: city },
    });
    fireEvent.change(screen.getByPlaceholderText('UF'), {
      target: { value: state },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit'));
    });

    expect(mockSuccess).toHaveBeenCalledWith(
      `ONG cadastrada com sucesso, ID: ${id}`
    );
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('should not be able to register', async () => {
    const { name, email, whatsapp, city, state } = await factory.attrs('Ngo');

    apiMock.onPost('ngos').reply(400);

    const Stub = createRoutesStub([
      {
        path: '/register',
        Component: () => <Register />,
      },
      {
        path: '/',
        Component: () => <div>Home</div>,
      },
    ]);

    render(<Stub initialEntries={['/register']} />);

    fireEvent.change(screen.getByPlaceholderText('Nome da ONG'), {
      target: { value: name },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: email },
    });
    fireEvent.change(screen.getByPlaceholderText('WhatsApp'), {
      target: { value: whatsapp.substring(0, 10) },
    });
    fireEvent.change(screen.getByPlaceholderText('Cidade'), {
      target: { value: city },
    });
    fireEvent.change(screen.getByPlaceholderText('UF'), {
      target: { value: state },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit'));
    });

    expect(mockError).toHaveBeenCalledWith(
      'Erro ao cadastrar ONG, tente novamente!'
    );
  });

  it('should form fail in validation', async () => {
    const Stub = createRoutesStub([
      {
        path: '/register',
        Component: () => <Register />,
      },
      {
        path: '/',
        Component: () => <div>Home</div>,
      },
    ]);

    render(<Stub initialEntries={['/register']} />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit'));
    });

    expect(screen.getByText('O nome da ONG é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('O email é obrigatório')).toBeInTheDocument();
    expect(
      screen.getByText('Um número válido deve conter pelo menos 10 caracteres')
    ).toBeInTheDocument();
    expect(screen.getByText('A cidade é obrigatória')).toBeInTheDocument();
    expect(screen.getByText('O estado é obrigatório')).toBeInTheDocument();
  });

  it('should be able to navigate to login page', () => {
    const Stub = createRoutesStub([
      {
        path: '/register',
        Component: () => <Register />,
      },
      {
        path: '/',
        Component: () => <div>Home</div>,
      },
    ]);

    render(<Stub initialEntries={['/register']} />);

    fireEvent.click(screen.getByTestId('login'));

    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
