import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
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
jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate(),
  };
});

const apiMock = new MockAdapter(api);
const history = createBrowserHistory();

describe('Register', () => {
  it('should be able to register', async () => {
    const { id, name, email, whatsapp, city, state } =
      await factory.attrs('Ngo');

    apiMock.onPost('ngos').reply(200, { id });

    const navigate = jest.fn();
    mockNavigate.mockReturnValueOnce(navigate);

    const { getByPlaceholderText, getByTestId } = render(
      <Router location={history.location} navigator={history}>
        <Register />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Nome da ONG'), {
      target: { value: name },
    });
    fireEvent.change(getByPlaceholderText('Email'), {
      target: { value: email },
    });
    fireEvent.change(getByPlaceholderText('WhatsApp'), {
      target: { value: whatsapp.substring(0, 10) },
    });
    fireEvent.change(getByPlaceholderText('Cidade'), {
      target: { value: city },
    });
    fireEvent.change(getByPlaceholderText('UF'), {
      target: { value: state },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(mockSuccess).toHaveBeenCalledWith(
      `ONG cadastrada com sucesso, ID: ${id}`
    );
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('should not be able to register', async () => {
    const { name, email, whatsapp, city, state } = await factory.attrs('Ngo');

    apiMock.onPost('ngos').reply(400);

    const { getByPlaceholderText, getByTestId } = render(
      <Router location={history.location} navigator={history}>
        <Register />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Nome da ONG'), {
      target: { value: name },
    });
    fireEvent.change(getByPlaceholderText('Email'), {
      target: { value: email },
    });
    fireEvent.change(getByPlaceholderText('WhatsApp'), {
      target: { value: whatsapp.substring(0, 10) },
    });
    fireEvent.change(getByPlaceholderText('Cidade'), {
      target: { value: city },
    });
    fireEvent.change(getByPlaceholderText('UF'), {
      target: { value: state },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(mockError).toHaveBeenCalledWith(
      'Erro ao cadastrar ONG, tente novamente!'
    );
  });

  it('should form fail in validation', async () => {
    const { getByTestId, getByText } = render(
      <Router location={history.location} navigator={history}>
        <Register />
      </Router>
    );

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText('O nome da ONG é obrigatório')).toBeInTheDocument();
    expect(getByText('O email é obrigatório')).toBeInTheDocument();
    expect(
      getByText('Um número válido deve conter pelo menos 10 caracteres')
    ).toBeInTheDocument();
    expect(getByText('A cidade é obrigatória')).toBeInTheDocument();
    expect(getByText('O estado é obrigatório')).toBeInTheDocument();
  });

  it('should be able to navigate to login page', () => {
    const { getByTestId } = render(
      <Router location={history.location} navigator={history}>
        <Register />
      </Router>
    );

    fireEvent.click(getByTestId('login'));

    expect(history.location.pathname).toBe('/');
  });
});
