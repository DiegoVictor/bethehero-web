import React, { useContext, useState, useEffect, useCallback } from 'react';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import useInfiniteScroll from 'react-infinite-scroll-hook';

import Logo from 'assets/logo.svg';
import Button from 'components/Button';
import Layout from 'components/Layout';
import Link from 'components/Link';
import NgoContext from 'contexts/Ngo';
import api from 'services/api';
import { Container, Incidents, Header } from './styles';

function IncidentsList() {
  const {
    ngo: { id, name },
    setNgo,
  } = useContext(NgoContext);
  const [incidents, setIncidents] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasNextPage = useCallback((headers) => {
    if (!headers.link || headers.link.search(/rel="last"/gi) === -1) {
      setReachedEnd(true);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('bethehero');
    setNgo({});
    navigate('/');
  }, [navigate, setNgo]);

  const handleDeleteIncident = useCallback(
    async (incident_id) => {
      try {
        await api.delete(`/incidents/${incident_id}`);
        setIncidents(
          incidents.filter((incident) => incident.id !== incident_id)
        );
        toast.success('Caso removido com sucesso!');
      } catch (err) {
        toast.error('Erro ao remover caso, tente novamente!');
      }
    },
    [incidents]
  );

  const [scrollRef] = useInfiniteScroll(
    {
      loading,
      hasNextPage: !reachedEnd,
      onLoadMore: async () => {
        if (!loading) {
          setLoading(true);
          setPage(page + 1);
          const { data, headers } = await api.get(`/ngos/${id}/incidents`, {
            params: { page: page + 1 },
          });

          setIncidents([...incidents, ...data]);
          hasNextPage(headers);
          setLoading(false);
        }
      },
    },
    [id]
  );

  useEffect(() => {
    (async () => {
      const { data, headers } = await api.get(`/ngos/${id}/incidents`, {
        params: { page: 1 },
      });
      if (headers) {
        hasNextPage(headers);
      }
      setIncidents(data);
    })();
  }, [id, hasNextPage]);

  return (
    <Layout>
      <Container>
        <Header>
          <img src={Logo} alt="Be The Hero" />
          <span>Bem-vindo(a) {name}</span>

          <Link to="/incidents/create">
            <Button type="button">Novo caso</Button>
          </Link>

          <button data-testid="logout" type="button" onClick={handleLogout}>
            <FiPower size={20} color="#E02041" />
          </button>
        </Header>

        <h1>Casos</h1>

        <Incidents>
          {incidents.map((incident) => (
            <li key={String(incident.id)} ref={scrollRef}>
              <strong>Caso:</strong>
              <p>{incident.title}</p>
              <strong>Descrição:</strong>
              <p>{incident.description}</p>

              <strong>Valor:</strong>
              <p data-testid={`incident_${incident.id}_value`}>
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(incident.value)}
              </p>

              <button
                data-testid={`incident_${incident.id}_delete`}
                type="button"
                onClick={() => handleDeleteIncident(incident.id)}
              >
                <FiTrash2 size={20} color="#A8A8B3" />
              </button>
            </li>
          ))}
          {(loading || hasNextPage) && <div ref={scrollRef} />}
        </Incidents>
      </Container>
    </Layout>
  );
}

export default IncidentsList;
