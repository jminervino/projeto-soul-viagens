/**
 * Constantes de rotas da aplicação
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CONFIRMAR_EMAIL: '/confirmar-email',
  DASHBOARD: '/dashboard',
} as const;

/**
 * Constantes de coleções do Firestore
 */
export const FIRESTORE_COLLECTIONS = {
  USUARIOS: 'usuarios',
  DIARIOS: 'diarios',
} as const;

/**
 * Constantes de storage do Firebase
 */
export const STORAGE_PATHS = {
  DIARIOS: (userId: string) => `diarios/${userId}/`,
  PLACEHOLDER_IMAGE: 'assets/img/placeholder.png',
} as const;

/**
 * Constantes de mensagens de feedback
 */
export const TOAST_MESSAGES = {
  LOGIN: {
    success: 'Boas Vindas',
    error: 'Um erro ocorreu',
    loading: 'Fazendo login...',
  },
  LOGIN_GOOGLE_FACEBOOK: {
    success: 'Login efetuado',
    error: 'Operação cancelada',
    loading: 'Fazendo login...',
  },
} as const;

/**
 * Constantes de validação
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
} as const;
