// import React from 'react';

// interface MathSymbolsProps {
//     setSelectedInput: (value: string | ((prev: string) => string)) => void;
//     handleCalculatorInput: (value: string) => void;
//     insertElement: (html: string) => void;
// }

// const mathSymbols = [
//   ['≥', '≤', '⋅', '÷', 'x⁰', '(□)', '|□|', '(f∘g)', 'f(x)', 'ln', 'e⁽□⁾'],
//   ["(□)'", '∂/∂x', '∫□□', 'lim', 'Σ', 'sin', 'cos', 'tan', 'cot', 'csc', 'sec']
// ];

// const MathSymbolsGrid: React.FC<MathSymbolsProps> = ({setSelectedInput,handleCalculatorInput,insertElement}) => {

//   const handleClick = (value: string) => {
//     // setSelectedInput((prev) => prev + value);
//     // handleCalculatorInput(value);
//     insertElement(`<span>${value}</span>`);
//   };
//   return (
//     <div className="bg-white shadow-md rounded-md p-4 w-full mx-auto">
//       <div className="grid grid-cols-11 gap-2">
//         {mathSymbols.flat().map((symbol, index) => (
//           <div key={index} className="p-2 border rounded-md text-lg text-center" onClick={()=>handleClick(symbol)}>
//             {symbol}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MathSymbolsGrid;

import React from 'react';

interface MathSymbolsProps {
    setSelectedInput: (value: string | ((prev: string) => string)) => void;
    handleCalculatorInput: (value: string) => void;
    insertElement: (html: string) => void;
    restoreSelection:()=>void;
}

const mathSymbols = [
  ['≥', '≤', '⋅', '÷', 'x⁰', '(□)', '|□|', '(f∘g)', 'f(x)', 'ln', 'e⁽□⁾'],
  ["(□)'", '∂/∂x', '∫□□', 'lim', 'Σ', 'sin', 'cos', 'tan', 'cot', 'csc', 'sec']
];

const MathSymbolsGrid: React.FC<MathSymbolsProps> = ({ setSelectedInput, handleCalculatorInput, insertElement,restoreSelection }) => {
  const handleClick = (value: string, event: React.MouseEvent) => {
    restoreSelection()
    event.stopPropagation(); // Prevents bubbling issues
    insertElement(`<span>${value}</span>`);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 w-full mx-auto">
      <div className="grid grid-cols-11 gap-2">
        {mathSymbols.flat().map((symbol, index) => (
          <div
            key={index}
            className="p-2 border rounded-md text-lg text-center cursor-pointer"
            onClick={(event) => handleClick(symbol, event)}
          >
            {symbol}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MathSymbolsGrid;
