import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
@Injectable()
export class AppService {
  saveResults(resultData: {
    id: string;
    testName: string;
    score: number;
    status: string;
  }[]) {
    try {
      let results: {
        id: string;
        testName: string;
        score: number;
        status: string;
      }[] = [];

      try {
        const fileContent = fs.readFileSync('result-database.json', 'utf-8');
        results = JSON.parse(fileContent);
      } catch {
        results = [];
      }

      for (const result of resultData) {
        results.push(result);
      }

      const stringifiedResult = JSON.stringify(results);
      fs.writeFileSync('result-database.json', stringifiedResult, 'utf-8');
    } catch (error) {
      console.error('Error saving results:', error);
    }
  }

  handleResults(resultData: {
    id: string;
    testName: string;
    score: number;
    status: string;
  }[]) {
    this.saveResults(resultData);
  }

  getResults(): {
    id: string;
    testName: string;
    score: number;
    status: string;
  }[] {
    try {
      const fileContent = fs.readFileSync('result-database.json', 'utf-8');
      if (!fileContent) {
        return [];
      }

      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Error Getting results:', error);
      return [];
    }
  }
}
