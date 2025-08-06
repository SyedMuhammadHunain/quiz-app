import { Injectable } from "@angular/core";

import { TransformedQuiz } from "./api-response.model";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  saveQuestion(questions: TransformedQuiz[]) {
    localStorage.setItem('quizQuestion', JSON.stringify(questions));
  }

  getQuestions() { }
}