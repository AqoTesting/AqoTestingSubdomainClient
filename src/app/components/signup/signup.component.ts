import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Room, RoomField } from 'src/app/entities/room.entities';
import { RoomService } from 'src/app/services/room.service';
import { Background } from 'src/app/utils/background.utility';
import RepeatValidator from '../../validators/repeat.validator';

@Component({
  selector: 'app-registration',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignUpComponent implements OnInit {
  memberSignUp: FormGroup = this.fb.group({
    login: [
      '',
      [Validators.required, Validators.minLength(1), Validators.maxLength(32)],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.minLength(6),
        Validators.maxLength(320),
      ],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(30)],
    ],

    repeatPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        //RepeatValidator(this.member.value),
      ],
    ],

    fields: this.fb.array([]),
  });

  room: Room;

  get room$(): Observable<Room> {
    return this.roomService.room$;
  }

  constructor(private roomService: RoomService, private fb: FormBuilder) {
    Background.setColor('#9c27b0');
  }

  ngOnInit(): void {
    this.room$.subscribe((room: Room) => {
      this.room = room;
      console.log(room);

      this.initForm();
      console.log(this.memberSignUp.value);
      console.log(this.fields.controls[0]);
    });

    setInterval(() => {
      console.log(this.memberSignUp.invalid);
    }, 2000);
  }

  initForm() {
    this.room.fields.forEach((field) => {
      this.addField([field.name], ['', Validators.required]);
    });
  }

  hide = true;

  get fields(): FormArray {
    return this.memberSignUp.get('fields') as FormArray;
  }

  getFieldOptions(field: FormGroup): FormArray {
    return field.get('options') as FormArray;
  }

  addField(name: any, value: any) {
    const field = this.fb.group({ name, value });
    this.fields.push(field);
    return field;
  }

  /*getErrorMessageName() {
    if (this.name.hasError('required')) return 'Введите имя';

    if (this.name.hasError('minlength')) return 'Имя слишком короткое';

    if (this.name.hasError('maxlength')) return 'Имя слишком длинное';

    return this.email.hasError('email') ? 'Неверный e-mail' : '';
  }

  getErrorMessageEmail() {
    if (this.email.hasError('required')) return 'Введите email';

    return this.email.hasError('email') ? 'Неверный e-mail' : '';
  }

  getErrorMessagePasswd() {
    if (this.passwd.hasError('required')) return 'Введите пароль';

    if (this.passwd.hasError('minlength')) return 'Пароль слишком короткий';

    if (this.passwd.hasError('maxlength')) return 'Пароль слишком длинный';

    return '';
  }

  getErrorMessageRepeatPasswd() {
    if (this.repeatPasswd.hasError('required')) return 'Введите пароль';

    if (this.repeatPasswd.hasError('minlength'))
      return 'Пароль слишком короткий';

    if (this.repeatPasswd.hasError('maxlength'))
      return 'Пароль слишком длинный';

    if (this.repeatPasswd.hasError('repeat')) {
      return 'Пароли не совпадают';
    }

    return '';
  }*/
}
