import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Response } from 'src/app/entities/response.entities';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SnackService } from 'src/app/services/snack.service';
import { Background } from 'src/app/utils/background.utility';
import { Room } from 'src/app/entities/room.entities';
import { Observable } from 'rxjs';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup = new FormGroup({
    login: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(320),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(128),
    ]),
  });

  room: Room;

  get room$(): Observable<Room> {
    return this.roomService.room$;
  }

  hide = true;

  constructor(
    private roomService: RoomService,
    private snackService: SnackService,
    private router: Router,
    private authService: AuthService
  ) {
    Background.setColor('#9c27b0');
  }

  ngOnInit(): void {
    this.room$.subscribe((room: Room) => {
      this.room = room;
    });
  }

  getErrorMessageLogin() {
    let login = this.signInForm.controls['login'];
    if (login.hasError('required')) {
      return 'Введите логин или email';
    } else if (login.hasError('minlength')) {
      return 'Логин или email слишком короткий';
    } else if (login.hasError('maxlength')) {
      return 'Логин или email слишком длинный';
    }

    return '';
  }

  getErrorMessagePassword() {
    let password = this.signInForm.controls['password'];

    if (password.hasError('required')) {
      return 'Введите пароль';
    } else if (password.hasError('minlength')) {
      return 'Пароль слишком короткий';
    } else if (password.hasError('maxlength')) {
      return 'Пароль слишком длинный';
    }

    return '';
  }

  onSubmit() {
    this.signInForm.disable();
    this.signInForm.value.roomId = this.room.id;
    this.authService.getMemberTokenSignIn(this.signInForm.value).subscribe(
      () => {
        window.location.reload();
        /*this.snackService.success('Вы успешно авторизовались');
        if (this.room.isApproveManually) {
          this.router.navigate(['/await-approval']);
        } else {
          this.router.navigate(['/']);
        }*/
      },
      (error) => {
        if (error instanceof Response)
          this.snackService.error(error.errorMessageCode);
        this.signInForm.enable();
      }
    );
  }
}
