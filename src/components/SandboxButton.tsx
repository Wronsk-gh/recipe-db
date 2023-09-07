import { useState } from 'react';
import { ProppedSandboxButton } from './ProppedSandboxButton';
import { EffectSandboxButton } from './EffectSandboxButton';

export function SandboxButton({}) {
  const [count, setCount] = useState(0);
  function onButtonClick() {
    setCount(count + 1);
  }
  return (
    <div>
      <button onClick={onButtonClick}>increase top level</button>
      Here is the top level count : {count}
      <ProppedSandboxButton initialCount={count} />
      <EffectSandboxButton initialCount={count} />
    </div>
  );
}
