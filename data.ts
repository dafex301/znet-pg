// data.ts
export interface QuestionType {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
  }
  
  export const questions: QuestionType[] = [
    {
      id: 1,
      question: "What's the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris",
    },
    {
      id: 2,
      question: "Which gas do plants absorb?",
      options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"],
      correctAnswer: "Carbon dioxide",
    },
  ];