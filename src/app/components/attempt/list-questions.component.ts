import { AfterContentInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Section } from 'src/app/entities/attempt.entities';

export class ListQuestions {
  sectionId: number;
  questionId: number;
  sections: Section[];
}

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styleUrls: ['./list-questions.component.scss'],
})
export class ListQuestionsComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ListQuestionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListQuestions
  ) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }
}
