import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Diario } from 'src/app/core/models/diario';
import { DiariosService } from 'src/app/core/services/diarios/diarios.service';

@Component({
  selector: 'app-diario-add',
  templateUrl: './diario-add.component.html',
  styleUrls: ['./diario-add.component.scss'],
})
export class DiarioAddComponent implements OnInit {
  diario: Diario = {} as Diario;
  img?: File;
  icone: String = 'upload';

  constructor(
    private ref: MatDialogRef<DiarioAddComponent>,
    private diarioService: DiariosService
  ) {}

  setImage(ev: any) {
    this.img = ev.target.files[0];
    document.querySelector('.btnCheck')?.classList.add('btnCheck2');
    this.icone = 'library_add_check';
  }

  onSubmit() {
    this.ref.close({ diario: this.diario, imagem: this.img });

  }



  ngOnInit(): void {}
}
