import { Injectable } from '@angular/core';
import {
  collectionData,
  docData,
  Firestore,
  orderBy,
  where,
} from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  updateDoc,
} from '@firebase/firestore';
import { first, from, Observable, switchMap } from 'rxjs';
import { Diario, DiarioConverter } from '../../models/diario';
import { AuthService } from '../auth/auth.service';
import { UploadService } from '../upload/upload.service';
import { FIRESTORE_COLLECTIONS, STORAGE_PATHS } from '../../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class DiariosService {
  private readonly diarios = collection(this.db, FIRESTORE_COLLECTIONS.DIARIOS).withConverter(DiarioConverter);

  constructor(
    private db: Firestore,
    private authService: AuthService,
    private uploadService: UploadService
  ) {}

  getTodosDiarios(): Observable<Diario[]> {
    const q = query(this.diarios, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' });
  }

  getDiariosUsuario(): Observable<Diario[]> {
    return this.authService.logged.pipe(

      first(),
      switchMap((user) => {
        return collectionData(
          query(this.diarios, where('usuarioId', '==', user?.uid)),
          { idField: 'id' }
        );
      })
    );
  }

  getDiarioById(id: string): Observable<Diario> {
    const diarioDoc = doc(this.diarios, id);
    return docData(diarioDoc, { idField: 'id' });
  }

  addDiario(diario: Diario, imagem?: File): Observable<any> {
    return this.authService.userData.pipe(
      switchMap((user) => {
        if (!this.authService.uid) {
          throw new Error('Usuário não autenticado');
        }

        return this.uploadService
          .upload(imagem, STORAGE_PATHS.DIARIOS(this.authService.uid))
          .pipe(
            switchMap((url) => {
              diario.createdAt = new Date();
              diario.imagem = url ?? STORAGE_PATHS.PLACEHOLDER_IMAGE;
              diario.usuarioId = this.authService.uid;
              diario.usuarioNick = user.nick;
              diario.usuarioName = user.nome;

              return from(addDoc(this.diarios, diario));
            })
          );
      })
    );
  }

  editDiario(diario: Diario, imagem?: File): Observable<void> {
    if (!diario.usuarioId) {
      throw new Error('Diário sem usuário associado');
    }

    const diarioDoc = doc(this.diarios, diario.id);
    return this.uploadService
      .upload(imagem, STORAGE_PATHS.DIARIOS(diario.usuarioId))
      .pipe(
        switchMap((url) => {
          return from(
            updateDoc(diarioDoc, { ...diario, imagem: url ?? diario.imagem })
          );
        })
      );
  }

  deleteDiario(diario: Diario) {
    const diarioDoc = doc(this.diarios, diario.id);
    return from(deleteDoc(diarioDoc));
  }
}
