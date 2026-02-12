import { Injectable } from '@angular/core';
import { Auth, authState, FacebookAuthProvider, User as FirebaseUser } from '@angular/fire/auth';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {
  AuthProvider,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential
} from '@firebase/auth';
import { collection, setDoc } from '@firebase/firestore';
import { filter, first, from, map, Observable, switchMap, tap } from 'rxjs';
import { UserData } from '../../models';
import { FIRESTORE_COLLECTIONS, ROUTES } from '../../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly usuarios = collection(this.db, FIRESTORE_COLLECTIONS.USUARIOS);

  uid?: string;

  constructor(
    private auth: Auth,
    private db: Firestore,
    private router: Router
  ) { }

  get logged(): Observable<FirebaseUser | null> {
    return authState(this.auth).pipe(
      tap((user) => {
        this.uid = user?.uid;
      })
    );
  }

  get userData(): Observable<UserData> {
    if (!this.uid) {
      throw new Error('Usuário não autenticado');
    }

    const userDoc = doc(this.usuarios, this.uid);
    return docData(userDoc).pipe(first()) as Observable<UserData>;
  }

  get isAdmin(): Observable<boolean> {
    return authState(this.auth).pipe(
      filter((user) => user !== null),
      first(),
      switchMap((user: FirebaseUser | null) => {
        if (!user) {
          return [false];
        }
        const userDoc = doc(this.usuarios, user.uid);
        console.log('userDoc', userDoc);
        return docData(userDoc).pipe(first());
      }),
      map((user) => (user as UserData)?.isAdmin === true)
    );
  }

  signupEmail(email: string, password: string, nome: string, nick: string): Observable<UserCredential> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      tap((creds) => {
        const user = creds.user;
        const userDoc = doc(this.usuarios, user.uid);

        const userData: UserData = {
          uid: user.uid,
          email: user.email,
          nome: nome,
          nick: nick,
        };

        // Usa merge: true para não sobrescrever dados existentes
        setDoc(userDoc, userData, { merge: true });

        this.emailVerificacao(creds.user);
      })
    );
  }

  loginEmail(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      tap((creds) => {
        this.emailVerificacao(creds.user);
      })
    );
  }

  logout(rota: typeof ROUTES.LOGIN | typeof ROUTES.CONFIRMAR_EMAIL): Observable<void> {
    return from(this.auth.signOut()).pipe(
      tap(() => {
        this.router.navigate([rota]);
      })
    );
  }

  emailVerificacao(user: FirebaseUser): void {
    if (!user.emailVerified) {
      sendEmailVerification(user);
      this.logout(ROUTES.CONFIRMAR_EMAIL).subscribe();
    } else {
      this.router.navigate([ROUTES.HOME]);
    }
  }

  loginGoogle(): Observable<UserCredential> {
    return this.socialLogin(
      new GoogleAuthProvider(),
      'Um usuário do Google'
    );
  }

  loginFacebook(): Observable<UserCredential> {
    return this.socialLogin(
      new FacebookAuthProvider(),
      'Um usuário do Facebook'
    );
  }

  /**
   * Método genérico para login social (Google, Facebook, etc)
   * @param provider Provedor de autenticação (Google, Facebook, etc)
   * @param defaultNick Nick padrão caso o usuário não tenha nome de exibição
   */
  private socialLogin(provider: AuthProvider, defaultNick: string): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, provider)).pipe(
      tap((creds) => {
        const user = creds.user;
        const userDoc = doc(this.usuarios, user.uid);

        const userData: UserData = {
          uid: user.uid,
          email: user.email,
          nome: user.displayName || 'Usuário',
          nick: defaultNick,
          imagem: user.photoURL || undefined,
        };

        // Usa merge: true para não sobrescrever dados existentes
        setDoc(userDoc, userData, { merge: true });

        this.router.navigate([ROUTES.HOME]);
      })
    );
  }

  recoverPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }
}
