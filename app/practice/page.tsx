"use client";
import React, { useEffect, useState } from "react";
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
  const [state, setState] = useState(practiceMachine.initialState);
  const [service, setService] = useState<any>(null);

  // Start the service when the component mounts
  useEffect(() => {
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
  };

  const handleLeavePractice = () => {
    service.send({ type: "PRACTICE_LEFT" });
  };

  const handleFinishPractice = () => {
    service.send({ type: "PRACTICE_FINISHED" });
  };

  const handleNewPractice = () => {
    service.send({ type: "NEW_PRACTICE_REQUESTED" });
  };

  return (
    <div className="mx-5">
      {state.matches("idle") && (
        <button onClick={handleStartPractice}>Start Practice</button>
      )}
      {(state.matches("practiceSession.questionDisplayed") ||
        state.matches("practiceSession.submissionEvaluationDisplayed")) && (
        <>
          <div className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-11 w-full bg-gray-200 rounded-full h-2.5 ">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    ((state.context.currentQuestionIndex + 1) /
                      questions.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-purple-700 text-sm">
              <span className="font-semibold text-lg">
                {state.context.currentQuestionIndex + 1}
              </span>
              /{questions ? questions.length : "?"} soal
            </p>
          </div>
          <Question
            data={questions}
            index={state.context.currentQuestionIndex}
            onSubmit={handleAnswerSubmit}
            onFinish={handleFinishPractice}
            onNextQuestion={handleNextQuestion}
          />
        </>
      )}
      {state.matches("practiceSession.submissionEvaluationDisplayed") && (
        <>
          <Evaluation
            answerSubmitted={state.context.answer ?? ""}
            correctAnswer={
              questions[state.context.currentQuestionIndex].correctAnswer
            }
          />
          <button onClick={handleLeavePractice}>Leave</button>
        </>
      )}
      {state.matches("practiceResultDisplayed") && (
        <Result score={state.context.score} onNewPractice={handleNewPractice} />
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
