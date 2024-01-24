import React from 'react';
import { IdsList } from '../db-types';
import { useGetAllMonths } from '../hooks/useGetAllMonths';

export function MonthBar({ selectedMonths }: { selectedMonths: IdsList }) {
  const allMonths = useGetAllMonths();
  const tableData = allMonths.map((month) => {
    const cellStyle: React.CSSProperties = {
      border: '1px solid black',
      overflow: 'scroll',
      height: '26px',
      textAlign: 'center',
    };
    if (selectedMonths.includes(month.id)) {
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
