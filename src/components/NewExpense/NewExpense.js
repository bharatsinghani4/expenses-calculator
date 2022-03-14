import { useState } from 'react';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import './NewExpense.css';

const NewExpense = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSaveExpenseDataHandler = (expenseData) => {
    const expenseDataObject = {
      ...expenseData,
      id: Math.random().toString(),
    };

    props.onAddExpense(expenseDataObject);
  };

  const onToggleAddExpenseFormHandler = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <div className="new-expense">
      {!isOpen && (
        <button type="button" onClick={onToggleAddExpenseFormHandler}>
          Add New Expense
        </button>
      )}
      {isOpen && (
        <ExpenseForm
          onSaveExpenseData={onSaveExpenseDataHandler}
          onToggleAddExpenseForm={onToggleAddExpenseFormHandler}
        />
      )}
    </div>
  );
};

export default NewExpense;
