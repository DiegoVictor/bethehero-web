import React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import api from '../../../../src/services/api';
import Create from '../../../../src/pages/Incidents/Create';
import factory from '../../../utils/factory';

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

describe('Incidents/Create', () => {
  it('should be able to back to incidents page', () => {
    const { getByTestId } = render(
      <Router location={history.location} navigator={history}>
        <Create />
      </Router>
    );

    fireEvent.click(getByTestId('back'));

    expect(history.location.pathname).toBe('/incidents');
  });

  it('should be able to create an incident', async () => {
    const { title, description, value } = await factory.attrs('Incident');

    apiMock.onPost('incidents').reply(200);

    const navigate = jest.fn();
    mockNavigate.mockReturnValueOnce(navigate);

    const { getByPlaceholderText, getByTestId } = render(
      <Router location={history.location} navigator={history}>
        <Create />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Título do caso'), {
      target: { value: title },
    });
    fireEvent.change(getByPlaceholderText('Descrição'), {
      target: { value: description },
    });
    fireEvent.change(getByPlaceholderText('Valor em reais'), {
      target: { value },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(mockSuccess).toHaveBeenCalledWith('Caso cadastrado com sucesso!');
    expect(navigate).toHaveBeenCalledWith('/incidents');
  });

  it('should not be able to create an incident', async () => {
    const { title, description, value } = await factory.attrs('Incident');

    apiMock.onPost('incidents').reply(400);

    const navigate = jest.fn();
    mockNavigate.mockReturnValueOnce(navigate);

    const { getByPlaceholderText, getByTestId } = render(
      <Router location={history.location} navigator={history}>
        <Create />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Título do caso'), {
      target: { value: title },
    });
    fireEvent.change(getByPlaceholderText('Descrição'), {
      target: { value: description },
    });
    fireEvent.change(getByPlaceholderText('Valor em reais'), {
      target: { value },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(mockError).toHaveBeenCalledWith(
      'Erro ao cadastrar caso, tente novamente!'
    );
    expect(navigate).not.toHaveBeenCalledWith('/incidents');
  });

  it('should form fail in validation', async () => {
    const { getByTestId, getByText } = render(
      <Router location={history.location} navigator={history}>
        <Create />
      </Router>
    );

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText('O título é obrigatório')).toBeInTheDocument();
    expect(getByText('A descrição é obrigatória')).toBeInTheDocument();
    expect(getByText('O valor é obrigatório')).toBeInTheDocument();
  });
});
