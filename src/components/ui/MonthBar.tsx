import React from 'react';
import { IdsList } from '../../models/db-types';
import { useGetAllMonths } from '../../hooks/month/useGetAllMonths';

export function MonthBar({ selectedMonths }: { selectedMonths: IdsList }) {
  const allMonths = useGetAllMonths();

  return (
    <div className="month-bar">
      {allMonths.map((month) => {
        return (
          <span
            key={month.id}
            className={`month-bar-item ${
              selectedMonths.includes(month.id) && 'month-bar-item-active'
            }`}
          >
            {month.name[0]}
          </span>
        );
      })}
    </div>
  );
}
