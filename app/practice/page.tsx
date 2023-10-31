"use client";
import React, { useState } from "react";
import { interpret, State } from "xstate";
import { practiceMachine } from "./machine";
import { Question, Result, LeaveConfirmation } from "@/components";
import { QuestionType, questions } from "@/data";
import { Evaluation } from "@/components/Evaluation";

interface PracticeContext {
  questions: QuestionType[];
  currentQuestionIndex: number;
  selectedAnswers: string[];
  score: number;
}

const PracticePage: React.FC = () => {

  const [state, setState] = React.useState(practiceMachine.initialState);
  const [service, setService] = React.useState<any>(null);


  // Start the service when the component mounts
  React.useEffect(() => {
    const practiceService = interpret(practiceMachine)
      .onTransition(setState)
      .start();

    setService(practiceService);

    return () => {
      practiceService.stop();
    };
  }, []);

  const handleStartPractice = () => service.send({ type: "PRACTICE_STARTED" });
  
  const handleAnswerSubmit = (answer: string | null) => {
    service.send({ type: "ANSWER_SUBMITTED", answer });
  };

  const handleNextQuestion = () => {
    service.send({ type: "NEW_QUESTION_REQUESTED" });
    console.log(state.context.currentQuestionIndex+ " ini ")
  };

  const handleLeavePractice = () => {service.send({ type: "PRACTICE_LEFT" });}
  
  const handleFinishPractice = () => {
    service.send({ type: "PRACTICE_FINISHED" });
  }

  const handleNewPractice = () => {
    service.send({ type: "NEW_PRACTICE_REQUESTED" });
  };

  return (
    <div>
      {state.matches("idle") && (
        <button onClick={handleStartPractice}>Start Practice</button>
      )}
      {state.matches("practiceSession.questionDisplayed") && (
        <>
          <Question
            data={questions[state.context.currentQuestionIndex]}
            onSubmit={handleAnswerSubmit}
          />
          {state.context.currentQuestionIndex < state.context.questions.length - 1 && <button onClick={handleNextQuestion}>Next</button>}
          <button onClick={handleLeavePractice}>Leave</button>
          <button onClick={handleFinishPractice}>Selesai</button>
        </>
      )}
      {state.matches("practiceSession.submissionEvaluationDisplayed") && (
        <>
          <Evaluation
            answerSubmitted={state.context.answer ?? ""}
            correctAnswer={questions[state.context.currentQuestionIndex].correctAnswer}
          />
          {state.context.currentQuestionIndex < state.context.questions.length - 1 && <button onClick={handleNextQuestion}>Next</button>}
          <button onClick={handleLeavePractice}>Leave</button>
          <button onClick={handleFinishPractice}>Selesai</button>
        </>
      )}
      {state.matches("practiceResultDisplayed") && (
        <Result
          score={state.context.score}
          onNewPractice={handleNewPractice}
        />
      )}
      {state.matches("practiceSession.leaveConfirmationDisplayed") && (
        <>
            <LeaveConfirmation
              onConfirm={() => service.send({ type: "LEAVE_CONFIRMED" })}
              onCancel={() => service.send({ type: "LEAVE_CANCELLED" })}
            />
        </>
      )}
    </div>
  );
};

export default PracticePage;
