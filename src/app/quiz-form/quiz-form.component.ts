import { Component, signal, Output, EventEmitter, inject } from '@angular/core';

import { QuizApiResponse, TransformedQuiz } from '../api-response.model';
import { LocalStorageService } from '../local-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService } from './quiz.service';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-quiz-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './quiz-form.component.html',
  styleUrl: './quiz-form.component.css'
})
export class QuizFormComponent {
  label = signal('');
  isComputerScienceVisible = signal(true);
  isMathematicsVisible = signal(true);
  isGeneralKnowledgeVisible = signal(true);
  quizInfo = signal<{ testName: string; category: string[] }>({
    testName: '',
    category: [],
  });
  isLoading = signal(false);

  private quizService = inject(QuizService);
  private localStorageService = inject(LocalStorageService)
  private loadingService = inject(LoadingService);

  @Output() close = new EventEmitter();
  @Output() submit = new EventEmitter();

  onCloseForm() {
    this.close.emit();
  }

  onSubmit() {
    this.submit.emit(true);
  }

  onSelectCategory(categoryName: string) {
    this.quizInfo.update(p => ({
      ...p,
      category: [...p.category, categoryName],
    }));
  }

  onFormSubmit(testname: string) {
    if (!testname || this.quizInfo().category.length === 0) {
      alert('Something is missing!');
      return;
    }

    this.quizInfo.update(p => ({
      ...p,
      testName: testname,
    }));

    this.onSubmit();

    this.loadingService.setLoading(true);
    this.quizService.getQuestions(this.quizInfo()).subscribe({
      next: (questions: TransformedQuiz[]) => {
        console.log('Received Questions: ', questions)

        this.localStorageService.saveQuestion(questions);

        this.loadingService.setLoading(false);
      },
      complete: () => {
        this.loadingService.setLoading(false);
      },
      error: (err) => {
        console.log('Failed to receive Questions (component).')
      }
    });
  }
}
