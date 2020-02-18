import React from 'react';
import { render } from '@testing-library/react';
import Layout from './components/layout';

test('renders learn react link', () => {
  const { getByText } = render(<Layout />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
