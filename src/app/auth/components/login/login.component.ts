import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { TOAST_MESSAGES, VALIDATION } from 'src/app/core/constants/app.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  readonly imagem = 'https://www.blogvambora.com.br/wp-content/uploads/2019/08/chip-de-viagem-europa.jpg';
  readonly siteKey = '6Lf5nmQgAAAAAGBE82rwfwIllPqz90bkIuXEjzei';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(VALIDATION.PASSWORD_MIN_LENGTH)]],
  });

  hide = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: HotToastService
  ) { }

  onSubmit(): void {
    const { email, senha } = this.loginForm.value;

    if (!email || !senha) {
      return;
    }

    this.authService
      .loginEmail(email, senha)
      .pipe(
        this.toast.observe(TOAST_MESSAGES.LOGIN)
      )
      .subscribe();
  }

  onLoginGoogle(): void {
    this.authService
      .loginGoogle()
      .pipe(
        this.toast.observe(TOAST_MESSAGES.LOGIN_GOOGLE_FACEBOOK)
      )
      .subscribe();
  }

  onLoginFacebook(): void {
    this.authService
      .loginFacebook()
      .pipe(
        this.toast.observe(TOAST_MESSAGES.LOGIN_GOOGLE_FACEBOOK)
      )
      .subscribe();
  }

  ngOnInit(): void { }
}
