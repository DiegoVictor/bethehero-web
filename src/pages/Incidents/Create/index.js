import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
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
  title: Yup.string().min(3).required('O título é obrigatório'),
  description: Yup.string()
    .min(10, 'A descrição deve conter pelo menos 10 caracteres')
    .required('A descrição é obrigatória'),
  value: Yup.string().required('O valor é obrigatório'),
});

function IncidentCreate() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleCreate = async (event) => {
    event.preventDefault();
    setErrors({});

    try {
      const formData = new FormData(event.target);
      const { title, description, value } = Object.fromEntries(
        formData.entries()
      );

      await schema.validate(
        { title, description, value },
        { abortEarly: false }
      );

      await api.post('incidents', { title, description, value });
      toast.success('Caso cadastrado com sucesso!');

      navigate('/incidents');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};

        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });

        setErrors(validationErrors);
      } else {
        toast.error('Erro ao cadastrar caso, tente novamente!');
      }
    }
  };

  return (
    <Layout>
      <Container>
        <div>
          <Section>
            <img src={Logo} alt="Be The Hero" />
            <h1>Novo Caso</h1>
            <p>
              Descreva o caso detalhadamente para encontrar um héroi para
              resolver isso.
            </p>
            <Link data-testid="back" to="/incidents">
              <FiArrowLeft size={20} color="#E02041" />
              Voltar
            </Link>
          </Section>

          <Form ref={formRef} onSubmit={handleCreate}>
            <Input name="title" placeholder="Título do caso" />
            <Input type="textarea" name="description" placeholder="Descrição" />
            <Input
              name="value"
              type="number"
              min="1"
              step="0.01"
              placeholder="Valor em reais"
            />

            <Button
              data-testid="submit"
              type="submit"
              onClick={() => {
                formRef.current.submitForm();
              }}
            >
              Cadastrar
            </Button>
          </Form>
        </div>
      </Container>
    </Layout>
  );
}

export default IncidentCreate;
