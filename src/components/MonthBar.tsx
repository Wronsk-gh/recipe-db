import React from 'react';
import { Month } from '../models/Month';
import { IdItemCollection } from '../models/IdItemCollection';

export function MonthBar({
  selectedMonths,
  allMonths,
}: {
  selectedMonths: IdItemCollection<Month>;
  allMonths: IdItemCollection<Month>;
}) {
  const tableData = allMonths.asArray().map((month) => {
    const cellStyle: React.CSSProperties = {
      border: '1px solid black',
      overflow: 'scroll',
      height: '26px',
      textAlign: 'center',
    };
    if (selectedMonths.isItemIn(month)) {
      cellStyle['background'] = 'green';
    }
    return (
      <td key={month.id} style={cellStyle} className="month-bar">
        {month.name[0]}
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
