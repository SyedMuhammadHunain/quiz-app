import { Injectable, inject, signal } from '@angular/core';

import { QuizApiResponse, TransformedQuiz } from '../api-response.model';

import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private computerScienceUrl = 'https://opentdb.com/api.php?amount=2&category=18&difficulty=easy&type=multiple'
  private mathematicsUrl = 'https://opentdb.com/api.php?amount=2&category=19&difficulty=easy&type=multiple';
  private generalKnowledgeUrl = 'https://opentdb.com/api.php?amount=2&category=19&difficulty=easy&type=multiple';

  listOfQuestions = signal<TransformedQuiz[]>([]);

  private httpClient = inject(HttpClient);

  getQuestions(quiz: { testName: string; category: string[] }) {
    const requests = quiz.category.map((cat) => {
      let url = '';

      if (cat === 'Computer Science') {
        url = this.computerScienceUrl;
      } else if (cat === 'Mathematics') {
        url = this.mathematicsUrl;
      } else if (cat === 'General Knowledge') {
        url = this.generalKnowledgeUrl;
      }

      return this.httpClient.get<QuizApiResponse>(url)
        .pipe(
          map(response => {
            return response.results.map((q) => ({
              category: q.category,
              question: q.question,
              correct_answer: q.correct_answer,
              incorrect_answers: q.incorrect_answers,
            }))
          }),
          catchError(() =>
            throwError(() => new Error('Failed to Get Question (service)'))
          )
        );
    });

    return forkJoin(requests)
      .pipe(
        map((responses: TransformedQuiz[][]) => {
          const allQuestions = responses.flat();
          this.listOfQuestions.set(allQuestions);
          console.log('listOfQuestions', this.listOfQuestions());
          return allQuestions;
        })
      );
  }
}
