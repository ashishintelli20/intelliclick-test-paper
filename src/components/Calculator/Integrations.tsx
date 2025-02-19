import React, { useState } from "react";
import Modal from "./Modal";
import { MathJax } from "better-react-mathjax";


interface Props {
  handleCalculatorInput: (item: { type: "math"; value: string }) => void;
}

const operations = [
  { label: "∫ ", value: "indefiniteIntegral", vars: ["dx"] },
  { label: "∬ ", value: "doubleIndefiniteIntegral", vars: ["dx", "dy"] },
  { label: "∭", value: "tripleIndefiniteIntegral", vars: ["dx", "dy", "dz"] },
  { label: "∫□", value: "integral", limits: 2, vars: ["dx"] },
  { label: "∬□□", value: "doubleIntegral", limits: 4, vars: ["dx", "dy"] },
  {
    label: "∭□□□",
    value: "tripleIntegral",
    limits: 6,
    vars: ["dx", "dy", "dz"],
  },
  { label: "Σ", value: "sum" },
  { label: "∏", value: "product" },
  { label: "lim", value: "limit", limits: 2 },
  { label: "lim→∞", value: "limitToInfinity" },
  { label: "lim x→0-", value: "limit(x, 0, -)" },
  { label: "lim x→0+", value: "limit(x, 0, +)" },
  { label: "d/dx", value: "derivative" },
  { label: "d²/dx²", value: "secondDerivative" },
  { label: "□'", value: "(□)'" },
  { label: "□''", value: "(□)''" },
  { label: "∂/∂x", value: "partialDerivative" },
];

const IntegrationAndDerivatives: React.FC<Props> = ({
  handleCalculatorInput,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOp, setSelectedOp] = useState<{
    label: string;
    value: string;
    limits?: number;
    vars?: string[];
  } | null>(null);
  const [limits, setLimits] = useState<string[]>([]);
  const [functionInput, setFunctionInput] = useState("");

  const openModal = (operation: {
    label: string;
    value: string;
    limits?: number;
    vars?: string[];
  }) => {
    setSelectedOp(operation);
    setLimits(Array(operation.limits || 0).fill(""));
    setShowModal(true);
  };

  const CreateQuestion = ({ question }: { question: { type: string; value: string } }) => (
    <div className="p-2 border rounded">
      {question.type === "math" ? (
        <MathJax>{`$$ ${question.value} $$`}</MathJax>
      ) : (
        <p>{question.value}</p>
      )}
       </div>
);

  const closeModalHandler = () => setShowModal(false);

  const handleLimitChange = (index: number, value: string) => {
    const newLimits = [...limits];
    newLimits[index] = value;
    setLimits(newLimits);
  };

  const handleSubmit = () => {
    if (limits.some((limit) => limit === "") || functionInput === "") {
      alert("Please fill in all fields.");
      return;
    }
  
    // Start with integral notation
    let integralExpression = ``;
  
    for (let i = 0; i < limits.length; i += 2) {
      integralExpression += `\\int_{${limits[i]}}^{${limits[i + 1]}} `;
    }
  
    integralExpression += `${functionInput} \\,${selectedOp?.vars?.join(" ")} `;
  
    // Send formatted LaTeX expression
    handleCalculatorInput({ type: "math", value: ` ${integralExpression} ` });
  
    closeModalHandler();
  };
  
  
  

  return (
    <div className="bg-white shadow-md rounded-md w-full mx-auto p-4">
      <div className="grid grid-cols-8 gap-2">
        {operations.map((op) => (
          <button
            key={op.value}
            onClick={() => openModal(op)}
            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-md text-sm"
          >
            {op.label}
          </button>
        ))}
      </div>

      {showModal && selectedOp && (
        <Modal onClose={closeModalHandler}>
          <h2 className="text-lg font-semibold mb-4">
            Enter {selectedOp.label} Details
          </h2>

          <div className="grid gap-2 mb-4">
            {Array.from({ length: limits.length / 2 }, (_, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={limits[i * 2]}
                  onChange={(e) => handleLimitChange(i * 2, e.target.value)}
                  placeholder={`Limit ${i * 2 + 1}`}
                  className="p-2 border rounded text-center"
                />
                <input
                  type="text"
                  value={limits[i * 2 + 1]}
                  onChange={(e) => handleLimitChange(i * 2 + 1, e.target.value)}
                  placeholder={`Limit ${i * 2 + 2}`}
                  className="p-2 border rounded text-center"
                />
              </div>
            ))}
          </div>

          <input
            type="text"
            value={functionInput}
            onChange={(e) => setFunctionInput(e.target.value)}
            placeholder="Function f(x)"
            className="p-2 border rounded w-full mb-4"
          />
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 w-full"
          >
            Submit
          </button>
        </Modal>
      )}
    </div>
  );
};

export default IntegrationAndDerivatives;
