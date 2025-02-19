import React, { useState } from "react";
import dynamic from "next/dynamic";
import InputEditor from "../InputEditor/InputEditor";
import CalculatorTabs from "../Calculator/CalculatorTabs";
import { QuestionSubmitServiceInstance } from "@/services/questionSubmit.service";
import { AxiosError } from "axios";
import { handleError } from "@/utils/helpers";
import { IQuestion } from "@/interfaces";

interface MathJaxItem {
  type: "math" | "text";
  value: string;
}

const MathJax = dynamic(
  () => import("better-react-mathjax").then((mod) => mod.MathJax),
  { ssr: false }
);

const QuestionForm: React.FC = () => {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);

  const [question, setQuestion] = useState<MathJaxItem[]>([
    { type: "text", value: "paven" },
    { type: "text", value: "hello" },
    { type: "math", value: "int x^2 dx" },
  ]);

  const [options, setOptions] = useState<MathJaxItem[][]>([
    [{ type: "text", value: "test" }, { type: "math", value: "iint f(x, y) dxdy" }],
    [{ type: "text", value: "sample" }, { type: "math", value: "int_0^1 e^x dx" }],
    [{ type: "text", value: "world" }, { type: "math", value: "iint_0^1 xy dxdy" }],
    [{ type: "text", value: "example" }],
  ]);

  const formatQuestion = (question: MathJaxItem[]): string => {
    return question.map((item) => item.value).join(" ");
  };

  const handleCalculatorInput = (item: MathJaxItem) => {
    console.log("Received Expression:", item);

    if (!activeField || activeField === "question") {
      setQuestion((prev) => [...prev, item]);
      console.log("Added to Question");
      return;
    }

    const index = parseInt(activeField.replace("option", ""));
    if (!isNaN(index)) {
      setOptions((prev) => {
        const newOptions = [...prev];
        newOptions[index] = [...newOptions[index], item];
        return newOptions;
      });
      console.log(`Added to Option ${index + 1}`);
    }
  };

  const handleQuestionChange = (value: MathJaxItem[]) => {
    setQuestion(value);
  };

  const handleOptionChange = (index: number, value: MathJaxItem[]) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      newOptions[index] = value;
      return newOptions;
    });
  };

  const handleSubmit = async () => {
    const questionCreated = formatQuestion(question);
    const formattedOptions = options.map(formatQuestion);

    console.log(questionCreated);
    console.log(formattedOptions);

    const questionDetailsPayload: IQuestion = {
      standard: "65f1a3b2c0de4a001cbf1234",
      standardName: "10th Grade",
      subject: "65f1a3b2c0de4a001cbf5678",
      subjectName: "Mathematics",
      topic: "65f1a3b2c0de4a001cbf9101",
      year: 2024,
      question: questionCreated,
      options: formattedOptions,
      correctOptionIndexes: [1],
      answers: ["3.14"],
      questionType: "MCQ",
      createdBy: "65f1a3b2c0de4a001cbf2222",
      chapter: "65f1a3b2c0de4a001cbf3333",
      isActive: true,
      marks: 2,
    };

    try {
      await QuestionSubmitServiceInstance.submitQuestion(questionDetailsPayload);
    } catch (error) {
      handleError(error as AxiosError, true);
    }
  };

  console.log("active", activeField);
  console.log("ques", question);

  return (
    <div className="p-4 w-full h-screen flex flex-col space-y-4">
      {/* Toggle Calculator Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          {showCalculator ? "Hide Calculator" : "Show Calculator"}
        </button>
      </div>

      {/* Calculator Display */}
      {showCalculator && (
        <div className="mt-4 p-4 border rounded shadow">
          <CalculatorTabs handleCalculatorInput={handleCalculatorInput} />
        </div>
      )}

      <h2 className="text-lg font-semibold">Create Question</h2>

      {/* Question Editor */}
      <div className="w-full flex flex-col">
        <InputEditor
          value={question}
          onChange={handleQuestionChange}
          isActive={activeField === "question"}
          onFocus={() => setActiveField("question")}
          className="w-full flex-grow"
        />
      </div>

      {/* Options Editors */}
      <div className="flex flex-col gap-4 flex-grow">
        {options.map((option, index) => (
          <InputEditor
            key={index}
            value={option}
            onChange={(value) => handleOptionChange(index, value)}
            isActive={activeField === `option${index}`}
            onFocus={() => setActiveField(`option${index}`)}
            className="w-full flex-grow"
          />
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit Question
        </button>
      </div>
    </div>
  );
};

export default QuestionForm;
