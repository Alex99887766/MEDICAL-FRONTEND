import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Login from '../Login';

describe('Сторінка Авторизації (Login)', () => {
  // ТЕСТ 1: Перевірка візуального відображення базових елементів
  it('рендерить форму авторизації з усіма необхідними полями', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Перевіряємо наявність заголовка
    expect(screen.getByRole('heading', { name: /вхід/i })).toBeInTheDocument();

    // Перевіряємо наявність полів вводу
    expect(screen.getByLabelText(/електронна пошта/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument();

    // Перевіряємо наявність кнопки
    expect(screen.getByRole('button', { name: /^увійти$/i })).toBeInTheDocument();
  });

  // ТЕСТ 2: Імітація дій користувача (введення тексту)
  it('дозволяє вводити дані в поля email та пароль', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/електронна пошта/i);
    const passwordInput = screen.getByLabelText(/пароль/i);

    // Імітуємо введення тексту
    fireEvent.change(emailInput, { target: { value: 'test@patient.com' } });
    fireEvent.change(passwordInput, { target: { value: 'securepassword123' } });

    // Перевіряємо, чи зберігся текст у стані (value)
    expect(emailInput.value).toBe('test@patient.com');
    expect(passwordInput.value).toBe('securepassword123');
  });

  // ТЕСТ 3: Перевірка навігаційних елементів
  it('містить посилання для переходу на сторінку реєстрації', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Шукаємо текст або кнопку реєстрації
    const registerLink = screen.getByRole('button', { name: /зареєструватися/i });
    expect(registerLink).toBeInTheDocument();
  });
});
