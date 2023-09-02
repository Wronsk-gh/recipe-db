import { useState } from "react";

export function ProppedSandboxButton({initialCount}: {initialCount: number}) {
    const [count, setCount] = useState(initialCount)
    function onButtonClick() {
        setCount(count + 1)
    }
  return (
    <div>
        <button onClick={onButtonClick}>
        increase propped level
        </button>
        Here is the propped level count : {count}
    </div>
  );
}
