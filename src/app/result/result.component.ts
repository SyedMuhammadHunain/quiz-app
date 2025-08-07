import { Component, signal, inject, OnInit } from '@angular/core';

import { BackendService } from '../backend.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result',
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent implements OnInit {
  private backendService = inject(BackendService);

  finalResult = this.backendService.finalResults;

  ngOnInit() {
    this.backendService.getResultsFromBackend().subscribe({
      complete: () => {
        console.log('Results fetched from backend successfully');
      },
      error: (error) => {
        console.error('Error fetching results from backend: ', error);
      }
    });
  }
}
