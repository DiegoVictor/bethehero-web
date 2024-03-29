import React, { useCallback, useContext, useRef } from 'react';
import { FiPlusSquare } from 'react-icons/fi';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Heroes from 'assets/heroes.png';
import Logo from 'assets/logo.svg';
import Button from 'components/Button';
import Input from 'components/Input';
import Layout from 'components/Layout';
import Link from 'components/Link';
import NgoContext from 'contexts/Ngo';
import api from 'services/api';
import { Container, Form } from './styles';

function Login() {
  const formRef = useRef(null);
  const { setNgo } = useContext(NgoContext);

  const handleLogin = useCallback(
    async ({ id }) => {
      try {
        const schema = Yup.object().shape({
          id: Yup.string().required('Por favor, informe o id da ONG'),
        });

        await schema.validate({ id }, { abortEarly: false });

        const {
          data: { ngo, token },
        } = await api.post('sessions', { id });

        localStorage.setItem(
          'bethehero',
          JSON.stringify({ id: ngo.id, name: ngo.name, token })
        );

        setNgo({ id: ngo.id, name: ngo.name, token });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors = {};
          err.inner.forEach((error) => {
            validationErrors[error.path] = error.message;
          });

          formRef.current.setErrors(validationErrors);
        } else {
          toast.error('Usuário e/ou senha incorreto(s)!');
        }
      }
    },
    [setNgo]
  );

  return (
    <Layout>
      <Container>
        <section>
          <img src={Logo} alt="Be The Hero" />
          <Form ref={formRef} onSubmit={handleLogin}>
            <h1>Faça seu logon</h1>

            <Input name="id" placeholder="Seu ID" />
            <Button data-testid="submit" type="submit">
              Entrar
            </Button>

            <Link data-testid="register" to="/register">
              <FiPlusSquare size={20} color="#E02041" />
              Não tenho cadastro
            </Link>
          </Form>
        </section>
        <img src={Heroes} alt="Heroes" />
      </Container>
    </Layout>
  );
}

export default Login;
