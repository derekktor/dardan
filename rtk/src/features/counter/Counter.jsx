import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, reset, incrementByAmount } from "./counterSlice";
import { useState, useReducer } from "react";

const Counter = () => {
  const counter = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(0);
  const addValue = Number(amount) || 0;

  const resetAll = () => {
    setAmount(0);
    dispatch(reset());
  }

  return (
    <div>
      <h1>{counter.count}</h1>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(reset())}>reset</button>
      <button onClick={() => dispatch(incrementByAmount(addValue))}>increment by</button>
      <input
        type="number"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
      />
      <br />
      <button onClick={resetAll}>Reset All</button>
    </div>
  );
};

export default Counter;
