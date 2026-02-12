import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit, OnDestroy {

  imagem = 'https://www.unitur.com.br/wp-content/uploads/2020/04/picture-2606675_1280-768x512.jpg';
  signupForm = this.fb.group(
    {
      nome: ['', [Validators.required]],
      nick: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      confirma_senha: [''],
    },
    { validators: [this.matchPasswords] }
  );

  hidePassword = true;
  hideConfirm = true;

  matchPasswords(control: AbstractControl): ValidationErrors | null {
    return control.get('senha')!.value !== control.get('confirma_senha')!.value
      ? { matchPasswords: true }
      : null;
  }

  siteKey: string;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private toast: HotToastService
  ) { this.siteKey = '6Lf5nmQgAAAAAGBE82rwfwIllPqz90bkIuXEjzei'; }

  onSubmit() {
    const { email, senha, nick, nome } = this.signupForm.value;
    this.authService
      .signupEmail(email, senha, nome, nick)
      .pipe(
        takeUntil(this.destroy$),
        this.toast.observe({
          success: 'Usuário criado com sucesso',
          error: 'Um erro ocorreu',
          loading: 'Criando usuário...',
        })
      )
      .subscribe();
  }

  onLoginGoogle() {
    this.authService
      .loginGoogle()
      .pipe(
        takeUntil(this.destroy$),
        this.toast.observe({
          success: 'Login efetuado',
          error: 'Operação cancelada',
          loading: 'Fazendo login...',
        })
      )
      .subscribe();
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
