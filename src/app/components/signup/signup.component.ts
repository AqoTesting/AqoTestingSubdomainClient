import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class SignUpComponent implements OnInit, OnDestroy {
  signUpForm: FormGroup = this.fb.group({
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
      [Validators.required, Validators.minLength(5), Validators.maxLength(30)],
    ],

    fields: this.fb.group([]),
  });

  room: Room;

  get room$(): Observable<Room> {
    return this.roomService.room$;
  }

  constructor(private roomService: RoomService, private fb: FormBuilder) {
    Background.setColor('#9c27b0');
    this.signUpForm.controls.repeatPassword.setValidators(
      RepeatValidator(this.signUpForm.controls.password)
    );
  }

  ngOnInit(): void {
    this.room$.subscribe((room: Room) => {
      this.room = room;
      this.initForm();
    });
  }

  initForm() {
    this.room.fields.forEach((field) => {
      let validators: Validators[] = [];
      if (field.isRequired) validators.push(Validators.required);
      if (field.mask) validators.push(Validators.pattern(field.mask));

      this.addField(field.name, '', validators);
    });
    console.log(this.fields);
  }

  hide = true;

  get fields(): FormGroup {
    return this.signUpForm.get('fields') as FormGroup;
  }

  getFieldOptions(field: FormGroup): FormArray {
    return field.get('options') as FormArray;
  }

  addField(name: string, value: string = '', validators: Validators[]): void {
    this.fields.addControl(name, this.fb.control(value, ...validators));
  }

  getErrorMessage(control: FormControl) {
    if (control.hasError('required')) return 'Введите значение';
    else if (control.hasError('minlength')) return 'Значение слишком короткое';
    else if (control.hasError('maxlength')) return 'Значение слишком длинное';
    else if (control.hasError('repeat')) return 'Значения не совпадают';

    return '';
  }

  onSubmit() {
    delete this.signUpForm.value.repeatPassword;
    console.log(this.signUpForm.value);
  }

  ngOnDestroy() {}
}
