import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Diario } from 'src/app/core/models/diario';

export interface DiarioFormDialogData {
  mode: 'add' | 'edit';
  value?: Diario;
}

@Component({
  selector: 'app-diario-form',
  templateUrl: './diario-form.component.html',
  styleUrls: ['./diario-form.component.scss'],
})
export class DiarioFormComponent {
  mode: 'add' | 'edit' = 'add';
  diario: Diario = {} as Diario;
  imagem?: File;
  icon = 'upload';
  hasImage = false;

  constructor(
    private dialogRef: MatDialogRef<DiarioFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: DiarioFormDialogData
  ) {
    this.mode = data.mode ?? 'add';
    if (data.value) {
      this.diario = { ...data.value };
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if (file) {
      this.imagem = file;
      this.hasImage = true;
      this.icon = 'library_add_check';
    }
  }

  onSubmit(): void {
    this.dialogRef.close({ diario: this.diario, imagem: this.imagem });
  }
}

