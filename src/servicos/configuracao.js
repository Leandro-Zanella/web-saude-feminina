export const URL_BASE_API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export function montarUrlMidia(caminho) {
  if (!caminho) {
    return null;
  }
  return `${URL_BASE_API}${caminho}`;
}
