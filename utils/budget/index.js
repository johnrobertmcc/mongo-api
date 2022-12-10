/**
 * Function used to calculate the sum of all provided items.
 * @author John Robert McCann
 * @since 12/09/2022
 * @param   {Array} items The items to calculate
 * @returns {number}      Returns the total of all expenses.
 */
export function calculateExpenseTotal(items) {
  let total = 0;

  for (let i = 0; i < items.length; i++) {
    const { amount } = items[i];
    total += typeof amount === 'number' ? amount : parseInt(amount.toString());
  }

  return total;
}
