import { faker } from '@faker-js/faker';
import factory from 'factory-girl';

factory.define(
  'Ngo',
  {},
  {
    id: faker.datatype.number,
    name: faker.name.fullName,
    email: faker.internet.email,
    whatsapp: () => faker.phone.number('###########'),
    city: faker.address.city,
    state: faker.address.stateAbbr,
  }
);

factory.define(
  'Incident',
  {},
  {
    id: faker.datatype.number,
    title: () => faker.lorem.words(3),
    description: faker.lorem.paragraph,
    value: () => Number(faker.finance.amount()),
  }
);

export default factory;
