import React from 'react';
import { cleanup, render } from '@testing-library/react';
import App from './App';

afterEach(cleanup);
describe('App', () => {
  test('renders', () => {
    const { getByRole } = render(<App />);

    expect(getByRole(/main/i)).toBeInTheDocument();
  });
});
