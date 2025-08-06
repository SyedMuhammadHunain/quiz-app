import { Component, inject, input } from '@angular/core';

import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-quiz',
  imports: [],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {
  isSubmittedForm = input.required<boolean>();

  private loadingService = inject(LoadingService);

  isLoading = this.loadingService.loading;
}
