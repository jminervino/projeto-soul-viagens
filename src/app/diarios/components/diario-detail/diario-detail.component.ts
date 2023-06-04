import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, first } from 'rxjs';
import { Diario } from 'src/app/core/models/diario';
import { DiariosService } from 'src/app/core/services/diarios/diarios.service';

@Component({
  selector: 'app-diario-detail',
  templateUrl: './diario-detail.component.html',
  styleUrls: ['./diario-detail.component.scss'],
})
export class DiarioDetailComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Diario,
    private route: ActivatedRoute,
    private diariosService: DiariosService
  ) {}

  diario$?: Observable<Diario>;

  ngOnInit(): void {
    this.diario$ = this.diariosService.getDiarioById(
      this.data.id!
    );


  }
}
