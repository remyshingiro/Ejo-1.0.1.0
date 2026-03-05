/**
 * Calculates the total amount a member needs to pay back.
 * Based on Ejo Hacu's 10% monthly interest rule.
 */
export const calculateRepayment = (amount: number): number => {
  const interest = amount * 0.10;
  return amount + interest;
};

/**
 * Checks if a member is allowed to borrow.
 * Innovation: Members can borrow up to 3x their current savings.
 */
export const canBorrowAmount = (requested: number, savings: number): boolean => {
  return requested <= (savings * 3);
};