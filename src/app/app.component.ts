import { Component, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { DashboardBoxComponent } from './dashboard-box/dashboard-box.component';
import { QuizFormComponent } from './quiz-form/quiz-form.component';
import { QuizComponent } from './quiz/quiz.component';

@Component({
  selector: 'app-root',
  imports: [DashboardBoxComponent, QuizFormComponent, CommonModule, QuizComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isFormVisible = signal(false);
  isQuizVisible = signal(false);

  onOpenForm() {
    this.isFormVisible.set(true);
  }

  onCloseForm() {
    this.isFormVisible.set(false);
  }

  onSubmitForm(val: boolean) {
    this.isFormVisible.set(false);
    this.isQuizVisible.set(val);
  }
}
