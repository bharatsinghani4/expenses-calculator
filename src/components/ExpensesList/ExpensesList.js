import './ExpensesList.css';
import ExpenseItem from '../ExpenseItem/ExpenseItem';

const ExpensesList = (props) => {
  let expensesContent = (
    <h2 className="expenses-list__fallback">
      Looks like you saved alot in {props.selectedYear}! &#128540;
    </h2>
  );

  if (props.filteredExpenses.length > 0) {
    expensesContent = props.filteredExpenses.map((expense) => {
      return (
        <ExpenseItem
          key={expense.id}
          title={expense.title}
          amount={expense.amount}
          date={expense.date}
        />
      );
    });
  }

  return <ul className="expenses-list">{expensesContent}</ul>;
};

export default ExpensesList;
