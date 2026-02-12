import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { map, Observable, Subject } from 'rxjs';
import { Diario } from 'src/app/core/models/diario';
import { DiariosService } from 'src/app/core/services/diarios/diarios.service';
import { DiarioDetailComponent } from '../diario-detail/diario-detail.component';
import { DiarioFormComponent } from '../diario-form/diario-form.component';
import { takeUntil } from 'rxjs/operators';

const STICKY_FOOTER_CLASS = 'layout-sticky-footer';

@Component({
  selector: 'app-diario-list',
  templateUrl: './diario-list.component.html',
  styleUrls: ['./diario-list.component.scss'],
})
export class DiarioListComponent implements OnInit, OnDestroy {
  allDiarios$?: Observable<Diario[]>;
  meusDiarios$?: Observable<Diario[]>;

  pagina: number = 1;
  activeTab: 'todos' | 'meus' = 'todos';

  constructor(
    private dialog: MatDialog,
    private diariosService: DiariosService,
    private toast: HotToastService,
    private breakpointObserver: BreakpointObserver,
    @Inject(DOCUMENT) private document: Document
  ) {}

  private readonly destroy$ = new Subject<void>();

  trackByDiarioId(_: number, diario: Diario): string {
    return diario.id ?? '';
  }

  setActiveTab(tab: 'todos' | 'meus'): void {
    this.activeTab = tab;
    this.updateBodyClass();
  }

  private updateBodyClass(): void {
    if (this.activeTab === 'meus') {
      this.document.body.classList.add(STICKY_FOOTER_CLASS);
    } else {
      this.document.body.classList.remove(STICKY_FOOTER_CLASS);
    }
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove(STICKY_FOOTER_CLASS);
    this.destroy$.next();
    this.destroy$.complete();
  }

  qtColumns = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(({ matches }) => {
        if (matches) {
          return { cols: 3, row: 1 };
        }
        return { cols: 1, row: 1 };
      })
    );

  onClickView(diario: Diario): void {
    this.dialog.open(DiarioDetailComponent, {
      data: diario,
      maxWidth: '900px',
      width: '90vw',
      panelClass: 'detail-dialog',
      autoFocus: false,
    });
  }

  onClickAdd() {
    const ref = this.dialog.open(DiarioFormComponent, {
      maxWidth: '512px',
      data: { mode: 'add' },
    });
    ref
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result) {
            this.diariosService
              .addDiario(result.diario, result.imagem)
              .pipe(
                takeUntil(this.destroy$),
                this.toast.observe({
                  loading: 'Adicionando...',
                  error: 'Ocorreu um erro',
                  success: 'Diário adicionado',
                })
              )
              .subscribe();
          }
        },
      });
  }

  onClickEdit(diario: Diario) {
    const ref = this.dialog.open(DiarioFormComponent, {
      maxWidth: '512px',
      data: { mode: 'edit', value: { ...diario } },
    });
    ref
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result) {
            this.diariosService
              .editDiario(result.diario, result.imagem)
              .pipe(
                takeUntil(this.destroy$),
                this.toast.observe({
                  loading: 'Atualizando...',
                  error: 'Ocorreu um erro',
                  success: 'Diário atualizado',
                })
              )
              .subscribe();
          }
        },
      });
  }

  onClickDelete(diario: Diario) {
    const canDelete = confirm('Deseja mesmo deletar?');
    if (canDelete) {
      this.diariosService
        .deleteDiario(diario)
        .pipe(
          takeUntil(this.destroy$),
          this.toast.observe({ success: 'Diário apagado!' })
        )
        .subscribe();
    }
  }

  ngOnInit(): void {
    this.allDiarios$ = this.diariosService.getTodosDiarios();
    this.meusDiarios$ = this.diariosService.getDiariosUsuario();
    this.updateBodyClass();
  }
}
