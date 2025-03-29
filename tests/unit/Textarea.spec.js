import React from 'react';
import { render } from '@testing-library/react';
import { faker } from '@faker-js/faker';

import Textarea from '../../src/components/Textarea';

describe('Textarea', () => {
  it('should be able to render a textarea', () => {
    const placeholder = faker.lorem.words(3);
    const { getByPlaceholderText } = render(
      <form>
        <Textarea name="description" placeholder={placeholder} />
      </form>
    );

    expect(getByPlaceholderText(placeholder)).toBeInTheDocument();
    expect(getByPlaceholderText(placeholder).tagName).toBe('TEXTAREA');
  });

  it('should be able to render a input error', async () => {
    const error = faker.lorem.words(5);

    const { getByText } = render(
      <form>
        <Textarea
          name="name"
          placeholder={faker.lorem.words(3)}
          error={error}
        />
      </form>
    );

    expect(getByText(error)).toBeInTheDocument();
  });
});
