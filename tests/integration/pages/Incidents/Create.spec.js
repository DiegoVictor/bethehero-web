import React from 'react';
import { act, render, fireEvent, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
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
jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate(),
  };
});

const apiMock = new MockAdapter(api);

describe('Incidents/Create', () => {
  it('should be able to back to incidents page', () => {
    const Stub = createRoutesStub([
      {
        path: '/incidents/create',
        Component: () => <Create />,
      },
      {
        path: '/incidents',
        Component: () => <div>Incidents</div>,
      },
    ]);

    render(<Stub initialEntries={['/incidents/create']} />);

    fireEvent.click(screen.getByTestId('back'));

    expect(screen.getByText('Incidents')).toBeInTheDocument();
  });

  it('should be able to create an incident', async () => {
    const { title, description, value } = await factory.attrs('Incident');

    apiMock.onPost('incidents').reply(200);

    const navigate = jest.fn();
    mockNavigate.mockReturnValueOnce(navigate);

    const Stub = createRoutesStub([
      {
        path: '/incidents/create',
        Component: () => <Create />,
      },
      {
        path: '/incidents',
        Component: () => <div>Incidents</div>,
      },
    ]);

    render(<Stub initialEntries={['/incidents/create']} />);

    fireEvent.change(screen.getByPlaceholderText('Título do caso'), {
      target: { value: title },
    });
    fireEvent.change(screen.getByPlaceholderText('Descrição'), {
      target: { value: description },
    });
    fireEvent.change(screen.getByPlaceholderText('Valor em reais'), {
      target: { value },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit'));
    });

    expect(mockSuccess).toHaveBeenCalledWith('Caso cadastrado com sucesso!');
    expect(navigate).toHaveBeenCalledWith('/incidents');
  });

  it('should not be able to create an incident', async () => {
    const { title, description, value } = await factory.attrs('Incident');

    apiMock.onPost('incidents').reply(400);

    const navigate = jest.fn();
    mockNavigate.mockReturnValueOnce(navigate);

    const Stub = createRoutesStub([
      {
        path: '/incidents/create',
        Component: () => <Create />,
      },
      {
        path: '/incidents',
        Component: () => <div>Incidents</div>,
      },
    ]);

    render(<Stub initialEntries={['/incidents/create']} />);

    fireEvent.change(screen.getByPlaceholderText('Título do caso'), {
      target: { value: title },
    });
    fireEvent.change(screen.getByPlaceholderText('Descrição'), {
      target: { value: description },
    });
    fireEvent.change(screen.getByPlaceholderText('Valor em reais'), {
      target: { value },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit'));
    });

    expect(mockError).toHaveBeenCalledWith(
      'Erro ao cadastrar caso, tente novamente!'
    );
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should form fail in validation', async () => {
    const Stub = createRoutesStub([
      {
        path: '/incidents/create',
        Component: () => <Create />,
      },
      {
        path: '/incidents',
        Component: () => <div>Incidents</div>,
      },
    ]);

    render(<Stub initialEntries={['/incidents/create']} />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit'));
    });

    expect(screen.getByText('O título é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('A descrição é obrigatória')).toBeInTheDocument();
    expect(screen.getByText('O valor é obrigatório')).toBeInTheDocument();
  });
});
