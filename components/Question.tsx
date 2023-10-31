// components/Question.tsx
import React from "react";
import { QuestionType } from "@/data";

interface QuestionProps {
  data: QuestionType;
  onSubmit: (selectedOption: string | null) => void;
}

export const Question: React.FC<QuestionProps> = ({ data, onSubmit }) => {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );

  return (
    <div>
      <h2>{data.question}</h2>
      {data.options.map((option) => (
        <div key={option}>
          <input
            type="radio"
            value={option}
            name={`question_${data.id}`}
            onChange={() => setSelectedOption(option)}
          />
          {option}
        </div>
      ))}
      <button onClick={() => onSubmit(selectedOption)}>Submit</button>
    </div>
  );
};
