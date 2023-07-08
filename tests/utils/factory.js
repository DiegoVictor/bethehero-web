import { faker } from '@faker-js/faker';
import factory from 'factory-girl';

factory.define(
  'Ngo',
  {},
  {
    id: faker.number.int,
    name: faker.person.fullName,
    email: faker.internet.email,
    whatsapp: () => faker.phone.number('###########'),
    city: faker.location.city,
    state: faker.location.state({ abbreviated: true }),
  }
);

factory.define(
  'Incident',
  {},
  {
    id: faker.number.int,
    title: () => faker.lorem.words(3),
    description: faker.lorem.paragraph,
    value: () => Number(faker.finance.amount()),
  }
);

export default factory;
