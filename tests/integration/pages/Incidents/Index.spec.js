import React from 'react';
import {
  render,
  fireEvent,
  act,
  screen,
  waitFor,
} from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import MockAdapter from 'axios-mock-adapter';
import { faker } from '@faker-js/faker';

import NgoContext from '../../../../src/contexts/Ngo';
import api from '../../../../src/services/api';
import Index from '../../../../src/pages/Incidents/Index';
import factory from '../../../utils/factory';

const apiMock = new MockAdapter(api);
const ngo = { id: faker.number.int(), name: faker.person.fullName() };
const setNgo = jest.fn();

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

let mockLoadMore = jest.fn();
jest.mock('react-infinite-scroll-hook', () => {
  // eslint-disable-next-line global-require
  const { useRef } = require('react');
  return {
    __esModule: true,
    default: function useInfiniteScroll({ onLoadMore }) {
      mockLoadMore = onLoadMore;

      return [useRef()];
    },
  };
});

describe('Incidents/Index', () => {
  beforeEach(() => {
    apiMock.reset();
  });

  it('should be able to retrieve a list of incidents', async () => {
    const incidents = await factory.attrsMany('Incident', 3);

    apiMock
      .onGet(`/ngos/${ngo.id}/incidents`)
      .reply(200, incidents, { Link: 'rel="last"' });

    const context = { ngo, setNgo };
    const Stub = createRoutesStub([
      {
        path: '/incidents',
        Component: () => (
          <NgoContext.Provider value={context}>
            <Index />
          </NgoContext.Provider>
        ),
      },
    ]);

    render(<Stub initialEntries={['/incidents']} />);

    const [{ title }] = incidents;
    await waitFor(() => screen.getByText(title));

    incidents.forEach((incident) => {
      expect(screen.getByText(incident.title)).toBeInTheDocument();
      expect(screen.getByText(incident.description)).toBeInTheDocument();
      expect(
        screen.getByTestId(`incident_${incident.id}_value`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`incident_${incident.id}_value`).textContent
      ).toBe(
        Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
          .format(incident.value)
          .replace(' ', '\u00a0')
      );
    });
  });

  it('should be able to retrieve the second page of incidents', async () => {
    jest.useFakeTimers();

    const incidents = await factory.attrsMany('Incident', 10);

    apiMock
      .onGet(`/ngos/${ngo.id}/incidents`, { params: { page: 1 } })
      .reply(200, incidents.slice(0, 5))
      .onGet(`/ngos/${ngo.id}/incidents`, { params: { page: 2 } })
      .reply(200, incidents.slice(-5), { link: '' });

    const context = { ngo, setNgo };
    const Stub = createRoutesStub([
      {
        path: '/incidents',
        Component: () => (
          <NgoContext.Provider value={context}>
            <Index />
          </NgoContext.Provider>
        ),
      },
    ]);

    render(<Stub initialEntries={['/incidents']} />);

    const [{ title }] = incidents;
    await waitFor(() => screen.getByText(title));

    await act(async () => {
      fireEvent.scroll(window, {
        target: { scrollY: 100 },
      });
      await mockLoadMore();
    });

    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    incidents.forEach((incident) => {
      expect(screen.getByText(incident.title)).toBeInTheDocument();
      expect(screen.getByText(incident.description)).toBeInTheDocument();
      expect(
        screen.getByTestId(`incident_${incident.id}_value`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`incident_${incident.id}_value`).textContent
      ).toBe(
        Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
          .format(incident.value)
          .replace(' ', '\u00a0')
      );
    });
  });

  it('should be able to delete an incident', async () => {
    const incident = await factory.attrs('Incident');

    apiMock
      .onGet(`/ngos/${ngo.id}/incidents`)
      .reply(200, [incident])
      .onDelete(`/incidents/${incident.id}`)
      .reply(200);

    const context = { ngo, setNgo };
    const Stub = createRoutesStub([
      {
        path: '/incidents',
        Component: () => (
          <NgoContext.Provider value={context}>
            <Index />
          </NgoContext.Provider>
        ),
      },
    ]);

    render(<Stub initialEntries={['/incidents']} />);

    await waitFor(() => screen.getByText(incident.title));

    await act(async () => {
      fireEvent.click(screen.getByTestId(`incident_${incident.id}_delete`));
    });

    expect(mockSuccess).toHaveBeenCalledWith('Caso removido com sucesso!');
  });

  it('should not be able to delete an incident', async () => {
    const incident = await factory.attrs('Incident');

    apiMock
      .onGet(`/ngos/${ngo.id}/incidents`)
      .reply(200, [incident])
      .onDelete(`/incidents/${incident.id}`)
      .reply(400);

    const context = { ngo, setNgo };
    const Stub = createRoutesStub([
      {
        path: '/incidents',
        Component: () => (
          <NgoContext.Provider value={context}>
            <Index />
          </NgoContext.Provider>
        ),
      },
    ]);

    render(<Stub initialEntries={['/incidents']} />);

    await waitFor(() => screen.getByText(incident.title));

    await act(async () => {
      fireEvent.click(screen.getByTestId(`incident_${incident.id}_delete`));
    });

    expect(mockError).toHaveBeenCalledWith(
      'Erro ao remover caso, tente novamente!'
    );
  });

  it('should be able to logout', async () => {
    apiMock.onGet(`/ngos/${ngo.id}/incidents`).reply(200, []);

    const navigate = jest.fn();
    mockNavigate.mockReturnValueOnce(navigate);

    const context = { ngo, setNgo };
    const Stub = createRoutesStub([
      {
        path: '/incidents',
        Component: () => (
          <NgoContext.Provider value={context}>
            <Index />
          </NgoContext.Provider>
        ),
      },
    ]);

    render(<Stub initialEntries={['/incidents']} />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('logout'));
    });

    expect(navigate).toHaveBeenCalledWith('/');
    expect(localStorage.getItem('bethehero')).toBeFalsy();
  });
});
