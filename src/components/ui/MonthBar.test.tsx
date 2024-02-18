// FILEPATH: /d:/Projects/recipe-db/src/components/ui/MonthBar.test.tsx
import { render, screen } from '@testing-library/react';
import { MonthBar } from './MonthBar';
import { IdsList } from '../../db-types';

jest.mock('../../hooks/month/useGetAllMonths', () => ({
  useGetAllMonths: () => [
    { id: '1', name: 'January' },
    { id: '2', name: 'February' },
    { id: '3', name: 'March' },
    { id: '4', name: 'April' },
    { id: '5', name: 'May' },
    { id: '6', name: 'June' },
    { id: '7', name: 'July' },
    { id: '8', name: 'August' },
    { id: '9', name: 'September' },
    { id: '10', name: 'October' },
    { id: '11', name: 'November' },
    { id: '12', name: 'December' },
  ],
}));

describe('MonthBar', () => {
  it('renders without crashing', () => {
    render(<MonthBar selectedMonths={[]} />);
  });

  it('renders all months in order', () => {
    render(<MonthBar selectedMonths={[]} />);
    const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    let previousElement: Node | null = null;
    months.forEach((month) => {
      const element = screen.getByText(month);
      expect(element).toBeInTheDocument();
      if (previousElement) {
        expect(
          element.compareDocumentPosition(previousElement) &
            Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy();
      }
      previousElement = element;
    });
  });

  it('adds active class to selected months in order', () => {
    const selectedMonths: IdsList = ['1', '3', '5', '7', '9', '11'];
    render(<MonthBar selectedMonths={selectedMonths} />);
    const activeMonths = ['J', 'M', 'M', 'J', 'S', 'N'];
    let previousElement: Node | null = null;
    activeMonths.forEach((month) => {
      const element = screen.getByText(month);
      expect(element).toHaveClass('month-bar-item-active');
      if (previousElement) {
        expect(
          element.compareDocumentPosition(previousElement) &
            Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy();
      }
      previousElement = element;
    });
  });
});
