import { useState } from "react";

export default function useVisualMode(value) {
  const [mode, setMode] = useState(value);
  const [history, setHistory] = useState([value]);

  function transition(newMode, replace = false) {
    if(!replace) {
      setHistory(prev => ([...prev, newMode]));
    }
    setMode(newMode);
  }

  function back() {
    if(history.length > 1) {
      history.pop();
      setMode(history[history.length - 1]);
    }
  }

  return { mode:mode, transition:transition, back:back };
}
