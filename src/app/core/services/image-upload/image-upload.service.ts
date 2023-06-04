import { Injectable } from '@angular/core';
import { getDownloadURL, ref, uploadBytes, Storage } from '@angular/fire/storage';
import { Observable, switchMap, from } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private storage: Storage) { }

  uploadUserImage(image: File, path: string): Observable<string>{
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)))
  }

}
