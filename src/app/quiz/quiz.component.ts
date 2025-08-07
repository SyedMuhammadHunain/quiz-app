import { Component, inject, input, signal, computed, effect, Output, EventEmitter } from '@angular/core';

import { TransformedQuiz } from '../api-response.model';
import { QuizService } from '../quiz-form/quiz.service';
import { LoadingService } from '../loading.service';
import { BackendService } from '../backend.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-quiz',
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {
  @Output() submitQuiz = new EventEmitter<void>();

  isSubmittedForm = input.required<boolean>();
  testName = input.required<string>();

  currentIndex = signal(0);
  result = signal<{
    user_selected_answers: string[];
    correct_answers: string[];
  }>({
    user_selected_answers: [],
    correct_answers: [],
  });
  userSelectedAnswer = signal('');

  private quizService = inject(QuizService);
  private loadingService = inject(LoadingService);
  private backendService = inject(BackendService);

  isLoading = this.loadingService.loading;
  listOfQuestions = this.quizService.listOfQuestions;

  constructor() {
    effect(() => {
      const questions = this.listOfQuestions();
      if (questions.length > 0) {
        this.currentIndex.set(0);
      }
    });
  }

  currentQuestion = computed(() => {
    return this.listOfQuestions()[this.currentIndex()]!;
  });

  shuffleOptions(question: TransformedQuiz): string[] {
    const options = [...question.incorrect_answers, question.correct_answer];

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }

  onNextQuestion() {
    const currentQ = this.currentQuestion();

    // Push the selected and correct answers to the result
    this.result.update(r => ({
      user_selected_answers: [...r.user_selected_answers, this.userSelectedAnswer()],
      correct_answers: [...r.correct_answers, currentQ.correct_answer],
    }));

    if (this.currentIndex() < this.listOfQuestions().length - 1) {
      this.currentIndex.update(i => i + 1);
      this.userSelectedAnswer.set('');
    } else {
      alert("You've reached the end of the quiz.");
    }
  }

  showAnswer(currentIndex: number) {
    const correctAnswer = this.listOfQuestions()[currentIndex].correct_answer;
    alert(`The correct answer is: ${correctAnswer}`);
  }

  saveAnswer() {
    const selected = this.userSelectedAnswer();
    const correct = this.currentQuestion().correct_answer;

    this.result.update(r => ({
      user_selected_answers: [...r.user_selected_answers, selected],
      correct_answers: [...r.correct_answers, correct]
    }));

    this.userSelectedAnswer.set('');
  }

  onSubmitQuiz() {
    this.saveAnswer();

    const resultData = this.result();

    this.backendService.calculateScore(
      resultData.user_selected_answers,
      resultData.correct_answers,
      this.testName()
    );

    this.backendService.sendResultToBackend().subscribe({
      next: () => {
        console.log('Results sent successfully (quiz component)');
      },
      error: () => {
        console.log('Failed to send results (quiz component)');
      }
    });

    this.submitQuiz.emit();
  }
}
