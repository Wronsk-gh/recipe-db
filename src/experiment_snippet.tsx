import { useState } from 'react';

function ExperimentContainer({}: {}) {
  const [objWithObj, setObjWithObj] = useState({ obj: { count: 0 } });
  // const objWithObj = { obj: { count: counter } };

  return (
    <div>
      <button
        onClick={() => {
          const newObj = { ...objWithObj };
          newObj.obj.count += 1;
          setObjWithObj(newObj);
        }}
      >
        increase Cnt
      </button>
      <ProppedWithObjComponenent proppedObj={objWithObj} />
    </div>
  );
}

interface ObjCnt {
  obj: {
    count: number;
  };
}

import _ from 'lodash';
function ProppedWithObjComponenent({ proppedObj }: { proppedObj: ObjCnt }) {
  const [initObj, setInitObj] = useState(proppedObj);
  const [clonedObj, setClonedObj] = useState(_.cloneDeep(proppedObj));
  console.log('this is proppedObj count : ' + proppedObj.obj.count);
  console.log('this is initObj count : ' + initObj.obj.count);
  console.log('this is clonedObj count : ' + clonedObj.obj.count);
  console.log('proppedObj equal initObj ? : ' + (proppedObj === initObj));
  console.log(
    'proppedObj.obj equal initObj.obj ? : ' + (proppedObj.obj === initObj.obj)
  );
  return <></>;
}
