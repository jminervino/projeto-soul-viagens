import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Diario } from 'src/app/core/models/diario';
import { DiariosService } from 'src/app/core/services/diarios/diarios.service';

@Component({
  selector: 'app-diario-detail',
  templateUrl: './diario-detail.component.html',
  styleUrls: ['./diario-detail.component.scss'],
})
export class DiarioDetailComponent implements OnInit {
  diario$?: Observable<Diario>;
  isModal = false;

  constructor(
    private route: ActivatedRoute,
    private diariosService: DiariosService,
    @Optional() private dialogRef: MatDialogRef<DiarioDetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: Diario
  ) {
    this.isModal = !!this.dialogRef;
  }

  close(): void {
    this.dialogRef?.close();
  }

  ngOnInit(): void {
    if (this.data) {
      this.diario$ = of(this.data);
    } else {
      this.diario$ = this.diariosService.getDiarioById(
        this.route.snapshot.params['id']
      );
    }
  }
}
