import { render, screen } from '@testing-library/react';
import Login from './components/login';

test('renders login form', () => {
  render(<App />);
  const loginButton = screen.getByRole('button', { name: /login/i });
  expect(loginButton).toBeInTheDocument();
});
