export interface QuizApiResponse {
    response_code: number;
    results: {
        category: string;
        correct_answer: string;
        difficulty: 'easy' | 'medium' | 'hard';
        incorrect_answers: string[];
        question: string;
        type: 'multiple';
    }[]
}

export interface TransformedQuiz {
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}
