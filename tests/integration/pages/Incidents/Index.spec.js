import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createBrowserHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';
import { faker } from '@faker-js/faker';

import NgoContext from '../../../../src/contexts/Ngo';
import api from '../../../../src/services/api';
import Index from '../../../../src/pages/Incidents/Index';
import factory from '../../../utils/factory';

jest.mock('react-toastify');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
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
  const apiMock = new MockAdapter(api);
  const history = createBrowserHistory();
  const ngo = { id: faker.number.int(), name: faker.person.fullName() };
  const setNgo = jest.fn();

  beforeEach(() => {
    apiMock.reset();
  });

  it('should be able to retrieve a list of incidents', async () => {
    const incidents = await factory.attrsMany('Incident', 3);
    apiMock
      .onGet(`/ngos/${ngo.id}/incidents`)
      .reply(200, incidents, { Link: 'rel="last"' });

    let getByText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <NgoContext.Provider value={{ ngo, setNgo }}>
          <Router location={history.location} navigator={history}>
            <Index />
          </Router>
        </NgoContext.Provider>
      );

      getByText = component.getByText;
      getByTestId = component.getByTestId;
    });

    incidents.forEach((incident) => {
      expect(getByText(incident.title)).toBeInTheDocument();
      expect(getByText(incident.description)).toBeInTheDocument();
      expect(getByTestId(`incident_${incident.id}_value`)).toBeInTheDocument();
      expect(getByTestId(`incident_${incident.id}_value`).textContent).toBe(
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

    let getByText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <NgoContext.Provider value={{ ngo, setNgo }}>
          <Router location={history.location} navigator={history}>
            <Index />
          </Router>
        </NgoContext.Provider>
      );

      getByText = component.getByText;
      getByTestId = component.getByTestId;
    });

    fireEvent.scroll(window, {
      target: { scrollY: 100 },
    });

    await act(async () => {
      await mockLoadMore();
    });

    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    incidents.forEach((incident) => {
      expect(getByText(incident.title)).toBeInTheDocument();
      expect(getByText(incident.description)).toBeInTheDocument();
      expect(getByTestId(`incident_${incident.id}_value`)).toBeInTheDocument();
      expect(getByTestId(`incident_${incident.id}_value`).textContent).toBe(
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
    toast.success = jest.fn();

    apiMock
      .onGet(`/ngos/${ngo.id}/incidents`)
      .reply(200, [incident])
      .onDelete(`/incidents/${incident.id}`)
      .reply(200);

    let getByTestId;
    await act(async () => {
      const component = render(
        <NgoContext.Provider value={{ ngo, setNgo }}>
          <Router location={history.location} navigator={history}>
            <Index />
          </Router>
        </NgoContext.Provider>
      );

      getByTestId = component.getByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`incident_${incident.id}_delete`));
    });

    expect(toast.success).toHaveBeenCalledWith('Caso removido com sucesso!');
  });

  it('should not be able to delete an incident', async () => {
    const incident = await factory.attrs('Incident');
    toast.error = jest.fn();

    apiMock
      .onGet(`/ngos/${ngo.id}/incidents`)
      .reply(200, [incident])
      .onDelete(`/incidents/${incident.id}`)
      .reply(400);

    let getByTestId;
    await act(async () => {
      const component = render(
        <NgoContext.Provider value={{ ngo, setNgo }}>
          <Router location={history.location} navigator={history}>
            <Index />
          </Router>
        </NgoContext.Provider>
      );

      getByTestId = component.getByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`incident_${incident.id}_delete`));
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Erro ao remover caso, tente novamente!'
    );
  });

  it('should be able to logout', async () => {
    apiMock.onGet(`/ngos/${ngo.id}/incidents`).reply(200, []);

    let getByTestId;
    await act(async () => {
      const component = render(
        <NgoContext.Provider value={{ ngo, setNgo }}>
          <Router location={history.location} navigator={history}>
            <Index />
          </Router>
        </NgoContext.Provider>
      );

      getByTestId = component.getByTestId;
    });

    fireEvent.click(getByTestId('logout'));

    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(localStorage.getItem('bethehero')).toBeFalsy();
  });
});
