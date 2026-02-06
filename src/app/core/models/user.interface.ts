export interface User {
  uid: string;
  email: string | null;
  nome: string;
  nick: string;
  isAdmin?: boolean;
  imagem?: string;
  photoURL?: string;
  /** Nome de exibição do Firebase (para logins sociais) */
  displayName?: string;
}

/**
 * Tipo para dados do usuário armazenados no Firestore
 * Exclui campos que vêm do Firebase Auth
 */
export type UserData = Omit<User, 'displayName' | 'photoURL'>;
