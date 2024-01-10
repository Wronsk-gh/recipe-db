import React from 'react';
import { MonthsDb } from '../db-types';

export function MonthBarOld({
  months,
  recipeMonthsId,
}: {
  months: MonthsDb;
  recipeMonthsId: {
    [monthId: string]: boolean | string;
  };
}) {
  const tableData = Object.keys(months).map((monthKey) => {
    const cellStyle: React.CSSProperties = {
      border: '1px solid black',
      overflow: 'scroll',
      height: '26px',
      textAlign: 'center',
    };
    if (Boolean(recipeMonthsId[monthKey]) === true) {
      cellStyle['background'] = 'green';
    }
    return (
      <td key={monthKey} style={cellStyle} className="month-bar">
        {months[monthKey].name[0]}
      </td>
    );
  });

  return (
    <table style={{ width: '312px' }}>
      <tbody>
        <tr key={0}>{tableData}</tr>
      </tbody>
    </table>
  );
}