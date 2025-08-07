import { Injectable, signal, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { catchError, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private httpClient = inject(HttpClient);

  finalResults = signal<{
    id: string;
    testName: string;
    score: number;
    status: string;
  }[]>([]);

  calculateScore(
    selectedAnswers: string[],
    correctAnswers: string[],
    testName: string
  ) {
    let score = 0;

    for (let i = 0; i < selectedAnswers.length; i++) {
      if (selectedAnswers[i] === correctAnswers[i]) {
        score++;
      }
    }

    const status = score >= correctAnswers.length / 2 ? 'Pass' : 'Fail';

    const newResult: {
      id: string;
      testName: string;
      score: number;
      status: string;
    } = {
      id: Date.now().toString(),
      testName,
      score,
      status,
    };

    this.finalResults.update(results => [...results, newResult]);
  }

  sendResultToBackend() {
    return this.httpClient.post<{
      id: string;
      testName: string;
      score: number;
      status: string;
    }>('http://localhost:3000/results', this.finalResults())
      .pipe(
        tap(response => console.log('Results sent to backend: ', response)),
        catchError(error => {
          return throwError(() => new Error('Failed to send results to backend'));
        })
      );
  }

  getResultsFromBackend() {
    return this.httpClient.get<{
      id: string;
      testName: string;
      score: number;
      status: string;
    }[]>('http://localhost:3000/results')
    .pipe(
      tap(results => {
        this.finalResults.set(results);
        console.log('Results fetched from backend: ', results);
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to fetch results from backend'));
      })
    );
  }
}
