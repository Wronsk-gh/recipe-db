import { useState, useEffect } from "react";

export function EffectSandboxButton({
  initialCount,
}: {
  initialCount: number;
}) {
  const [count, setCount] = useState(0);
  const [lastInitialCount, setLastInitialCount] = useState(0);
  useEffect(() => {
    //setLastInitialCount(initialCount)
    setCount(initialCount);
  }, [initialCount]);
  useEffect(() => {
    console.log("rendering effect button...");
  });
  function onButtonClick() {
    setCount(count + 1);
  }
  return (
    <div>
      <button onClick={onButtonClick}>increase effect level</button>
      Here is the effect level count : {count}
    </div>
  );
}
