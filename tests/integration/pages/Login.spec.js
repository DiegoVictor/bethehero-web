import React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { createBrowserHistory } from 'history';
import { toast } from 'react-toastify';
import { faker } from '@faker-js/faker';

import NgoContext from '~/contexts/Ngo';
import api from '~/services/api';
import Login from '~/pages/Login';

jest.mock('react-toastify');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  };
});

describe('Login', () => {
  const apiMock = new MockAdapter(api);
  const history = createBrowserHistory();
  const setNgo = jest.fn();
  const id = faker.datatype.number();
  const name = faker.name.fullName();
  const token = faker.random.alphaNumeric(16);

  it('should be able to login', async () => {
    apiMock.onPost('sessions').reply(200, { ngo: { id, name }, token });

    const setItem = jest.spyOn(localStorage, 'setItem');

    const { getByTestId, getByPlaceholderText } = render(
      <NgoContext.Provider value={{ ngo: {}, setNgo }}>
        <Router location={history.location} navigator={history}>
          <Login />
        </Router>
      </NgoContext.Provider>
    );

    fireEvent.change(getByPlaceholderText('Seu ID'), { target: { value: id } });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(setItem).toHaveBeenCalledWith(
      'bethehero',
      JSON.stringify({ id, name, token })
    );
    expect(setNgo).toHaveBeenCalledWith({ id, name, token });
  });

  it('should not be able to login', async () => {
    apiMock.onPost('sessions').reply(400);
    toast.error = jest.fn();

    const { getByTestId, getByPlaceholderText } = render(
      <NgoContext.Provider value={{ ngo: {}, setNgo }}>
        <Router location={history.location} navigator={history}>
          <Login />
        </Router>
      </NgoContext.Provider>
    );

    fireEvent.change(getByPlaceholderText('Seu ID'), { target: { value: id } });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Usuário e/ou senha incorreto(s)!'
    );
  });

  it('should form validation fail', async () => {
    const { getByTestId, getByText } = render(
      <NgoContext.Provider value={{ ngo: {}, setNgo }}>
        <Router location={history.location} navigator={history}>
          <Login />
        </Router>
      </NgoContext.Provider>
    );

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText('Por favor, informe o id da ONG')).toBeInTheDocument();
  });

  it('should be able to navigate to register page', () => {
    const { getByTestId } = render(
      <NgoContext.Provider value={{ ngo: {}, setNgo }}>
        <Router location={history.location} navigator={history}>
          <Login />
        </Router>
      </NgoContext.Provider>
    );

    fireEvent.click(getByTestId('register'));

    expect(history.location.pathname).toBe('/register');
  });
});
