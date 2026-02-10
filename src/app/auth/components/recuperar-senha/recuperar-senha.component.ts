import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss'],
})
export class RecuperarSenhaComponent {
  readonly heroImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80';

  recoverForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  sending = false;
  sent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: HotToastService
  ) {}

  onSubmit(): void {
    const email = this.recoverForm.value.email;
    if (!email) return;

    this.sending = true;

    this.authService
      .recoverPassword(email)
      .pipe(
        this.toast.observe({
          loading: 'Enviando...',
          success: 'Email enviado com sucesso!',
          error: 'Não foi possível enviar. Verifique o email.',
        })
      )
      .subscribe({
        next: () => {
          this.sending = false;
          this.sent = true;
        },
        error: () => {
          this.sending = false;
        },
      });
  }

  reset(): void {
    this.sent = false;
    this.recoverForm.reset();
  }
}
