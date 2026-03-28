/**
 * Calculates the total repayment amount.
 * * SENIOR FIX: 
 * 1. Added Math.round to prevent floating-point decimals.
 * 2. Added a safety check for negative inputs.
 */
export const calculateRepayment = (amount: number): number => {
  if (!amount || amount <= 0) return 0;

  // We use Math.round because RWF doesn't typically use cents/decimals in MIS records
  const interest = Math.round(amount * 0.10);
  return amount + interest;
};

/**
 * Validates if a member is eligible for a specific loan amount.
 * Rule: 3x current savings.
 * * SENIOR FIX:
 * 1. Added explicit check for zero savings to prevent silent errors.
 * 2. Standardized return as a strict boolean.
 */
export const canBorrowAmount = (requested: number, savings: number): boolean => {
  if (!savings || savings <= 0) return false;
  if (!requested || requested <= 0) return false;

  const maxLimit = savings * 3;
  return requested <= maxLimit;
};

/**
 * Helper to get the maximum allowed loan for a member.
 * Useful for showing "Your Limit" in the UI.
 */
export const getMaxLoanLimit = (savings: number): number => {
  return (savings || 0) * 3;
};