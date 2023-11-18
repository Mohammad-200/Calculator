import './App.css'
import DigitButton from './DigitButton'
import OperationButton from './OpirationButton';
import React from 'react'


export const ACTIONS = {
  ADD_DIGIT: "  add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
};

/* Second Version 2 */
function reducer(state, {type, payload}) {
    switch(type) {
      case ACTIONS.ADD_DIGIT:
         if (state.overWrite) {
           return {
             ...state,
             currentOperand: payload.digit,
             overWrite: false,
           };
         }

         if (state.currentOperand == null && payload.digit === ".") return state
        if (payload.digit === '0' && state.currentOperand === '0') return state
          if (payload.digit === "." && state.currentOperand.includes("."))
            return state;
        return {
          ...state,
          currentOperand: `${state.currentOperand || ""}${payload.digit}`,
        };
        case ACTIONS.CLEAR:
          if (state.currentOperand === '') return state
          return {}
        case ACTIONS.CHOOSE_OPERATION:
          if (state.currentOperand == null && state.previousOperand == null) {
            return state;
          }


          if (state.currentOperand == null) {
            return {
              ...state,
              operation: payload.operation
            }
          }

          if (state.previousOperand == null) {
             return {
               ...state,
               operation: payload.operation,
               previousOperand: state.currentOperand,
               currentOperand: null,
             };
          }
          return {
            ...state,
            previousOperand: evaluate(state),
            operation: payload.operation,
            currentOperand: null,
          }

        case ACTIONS.EVALUATE:
          if (state.operation == null ||
              state.currentOperand == null ||
              state.previousOperand == null) {
            return state
          }
          return {
            ...state,
            overWrite: true,
            operation: null,
            previousOperand: null,
            currentOperand: evaluate(state)
          }

          case ACTIONS.DELETE_DIGIT:
            if (state.currentOperand == null) return state

            if (state.overWrite) {
              return {
                ...state,
                currentOperand: null,
                overWrite: false
              }
            }
            return {
              ...state,
              currentOperand: state.currentOperand.slice(0, -1)
            }
         
    }

}


function evaluate(state) {
  const prev = parseFloat(state.previousOperand)
  const curr = parseFloat(state.currentOperand)
  let computation = ''
  switch (state.operation) {
    case "*":
      computation = prev * curr;
      break;
    case "÷":
      computation = prev / curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "+":
      computation = prev + curr;
      break;
  }

  return computation.toString();
}

 
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
 
export default function App() { 
    const [{currentOperand, previousOperand, operation}, dispatch] = React.useReducer(reducer, {})


  return (
    <div className="calculator-grid">
      <div className="calcolator-input">
        <div className="previous-input">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-input">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}





