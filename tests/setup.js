import { beforeEach } from 'vitest';

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '';
});

if (typeof window !== 'undefined') {
  window.route = (name) => `/${String(name || '').replace(/\./g, '/')}`;
}
