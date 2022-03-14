import { useState } from 'react';
import Card from '../Card/Card';
import ExpensesChart from '../ExpensesChart/ExpensesChart';
import ExpenseFilter from '../ExpensesFilter/ExpensesFilter';
import ExpensesList from '../ExpensesList/ExpensesList';
import './Expenses.css';

const Expenses = (props) => {
  const [selectedYear, setSelectedYear] = useState('2020');

  const onChangeYearHandler = (year) => {
    setSelectedYear(year);
  };

  const filteredExpenses = props.expenses.filter((expense) => {
    return expense.date.getFullYear().toString() === selectedYear;
  });

  return (
    <Card className="expenses">
      <ExpenseFilter
        selectedYear={selectedYear}
        onChangeYear={onChangeYearHandler}
      />
      <ExpensesChart expenses={filteredExpenses} />
      <ExpensesList
        selectedYear={selectedYear}
        filteredExpenses={filteredExpenses}
      />
    </Card>
  );
};

export default Expenses;
