import { Component, signal, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './quiz-form.component.html',
  styleUrl: './quiz-form.component.css'
})
export class QuizFormComponent {
  category = signal('');

  isComputerScienceVisible = signal(true);
  isMathematicsVisible = signal(true);
  isGeneralKnowledgeVisible = signal(true);

  @Output() close = new EventEmitter();

  onCloseForm() {
    this.close.emit();
  }
}
