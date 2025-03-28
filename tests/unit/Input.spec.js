import React from 'react';
import { render } from '@testing-library/react';
import { faker } from '@faker-js/faker';

import Input from '../../src/components/Input';

describe('Input', () => {
  it('should be able to render an input', () => {
    const placeholder = faker.lorem.words(3);
    const { getByPlaceholderText } = render(
      <form>
        <Input name="name" placeholder={placeholder} />
      </form>
    );

    expect(getByPlaceholderText(placeholder)).toBeInTheDocument();
    expect(getByPlaceholderText(placeholder).tagName).toBe('INPUT');
  });

  it('should be able to render a input error', async () => {
    const error = faker.lorem.words(5);

    const { getByText } = render(
      <form>
        <Input name="name" placeholder={faker.lorem.words(3)} error={error} />
      </form>
    );

    expect(getByText(error)).toBeInTheDocument();
  });
});
