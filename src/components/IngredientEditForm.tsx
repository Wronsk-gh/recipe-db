import { useState } from 'react';
import _ from 'lodash';
import { TagBox } from './TagBox';
import { MonthsDb, Ingredient, Tag } from '../db-types';

export function IngredientEditForm({
  months,
  displayedObject,
  onDisplayedObjectChange,
}: {
  months: MonthsDb;
  displayedObject: Ingredient;
  onDisplayedObjectChange: (ingredient: Ingredient) => void;
}) {
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const options = Object.entries(months).map(([monthId, month]) => (
    <option value={monthId} key={monthId}>
      {month.name}
    </option>
  ));

  const monthsTags = Object.keys(
    displayedObject.months !== undefined ? displayedObject.months : {}
  ).map((monthId: string) => {
    if (monthId in months) {
      return (
        <TagBox
          tag={{ id: monthId, name: months[monthId].name }}
          onClose={(tag: Tag) => {
            const { [tag.id]: removed, ...newMonths } = {
              ...displayedObject.months,
            };
            const newDisplayedObject = {
              ...displayedObject,
              months: newMonths,
            };
            onDisplayedObjectChange(newDisplayedObject);
          }}
        />
      );
    } else {
      return null;
    }
  });

  return (
    <div>
      <form>
        <input
          value={displayedObject.name}
          onChange={(newValue) =>
            onDisplayedObjectChange({
              ...displayedObject,
              name: newValue.target.value,
            })
          }
        />
        <br />
        <label htmlFor="months">Choose a month:</label>
        <select
          name="months"
          onChange={(newValue) => setSelectedMonth(newValue.target.value)}
        >
          <option value={''} key={''}>
            {'-'}
          </option>
          {options}
        </select>
      </form>
      {monthsTags}
      <button
        onClick={() => {
          if (selectedMonth !== '') {
            if (displayedObject.months === undefined) {
              displayedObject.months = {};
            }
            if (displayedObject.months[selectedMonth] === undefined) {
              const newDisplayedObject: Ingredient = {
                ...displayedObject,
                months: {
                  [selectedMonth]: months[selectedMonth].name,
                  ...displayedObject.months,
                },
              };
              onDisplayedObjectChange(newDisplayedObject);
            }
          }
        }}
      >
        Add
      </button>
    </div>
  );
}
