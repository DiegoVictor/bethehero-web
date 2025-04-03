import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Logo from 'assets/logo.svg';
import Button from 'components/Button';
import Input from 'components/Input';
import Layout from 'components/Layout';
import Link from 'components/Link';
import api from 'services/api';
import { Container, Form, Section } from './styles';

const schema = Yup.object().shape({
  name: Yup.string().min(3).required('O nome da ONG é obrigatório'),
  email: Yup.string()
    .email('Digite um email válido')
    .required('O email é obrigatório'),
  whatsapp: Yup.string()
    .required('O WhatsApp é obrigatório')
    .min(10, 'Um número válido deve conter pelo menos 10 caracteres')
    .max(11, 'Um número válido deve conter no máximo 11 caracteres'),
  city: Yup.string().required('A cidade é obrigatória'),
  state: Yup.string()
    .required('O estado é obrigatório')
    .max(2, 'Digite apenas a UF do estado'),
});

function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    try {
      const formData = new FormData(event.target);
      const { name, email, whatsapp, city, state } = Object.fromEntries(
        formData.entries()
      );

      await schema.validate(
        { name, email, whatsapp, city, state },
        { abortEarly: false }
      );

      const { data } = await api.post('ngos', {
        name,
        email,
        whatsapp,
        city,
        uf: state,
      });

      toast.success(`ONG cadastrada com sucesso, ID: ${data.id}`);

      navigate('/');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });

        setErrors(validationErrors);
      } else {
        toast.error('Erro ao cadastrar ONG, tente novamente!');
      }
    }
  };

  return (
    <Layout>
      <Container>
        <div>
          <Section>
            <img src={Logo} alt="Be The Hero" />
            <h1>Cadastro</h1>
            <p>
              Faça seu cadastro, entre na plataforma e ajude pessoas a
              encontrarem os casos da sua ONG.
            </p>
            <Link data-testid="login" to="/">
              <FiArrowLeft size={20} color="#E02041" />
              Já tenho cadastro
            </Link>
          </Section>

          <Form method="post" onSubmit={handleSubmit}>
            <Input name="name" placeholder="Nome da ONG" error={errors.name} />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              error={errors.email}
            />
            <Input
              name="whatsapp"
              placeholder="WhatsApp"
              error={errors.whatsapp}
            />

            <div>
              <Input name="city" placeholder="Cidade" error={errors.city} />
              <Input
                name="state"
                placeholder="UF"
                style={{ width: 90 }}
                error={errors.state}
              />
            </div>

            <Button data-testid="submit" type="submit">
              Cadastrar
            </Button>
          </Form>
        </div>
      </Container>
    </Layout>
  );
}

export default Register;
