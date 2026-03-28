/**
 * Calculates days remaining until the next cooperative contribution deadline.
 * Deadlines are the 15th and the Last Day of every month.
 */
export const getDaysUntilNextDeadline = (): { days: number, label: string } => {
  // 1. Normalize "today" to the start of the day (Midnight) to avoid hourly math errors
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  let deadline: Date;
  let label: string;

  // 2. Determine the target deadline
  // Logic: If today is BEFORE the 15th, target is the 15th.
  // If today IS the 15th or later, target is the last day of the month.
  if (day < 15) {
    deadline = new Date(year, month, 15);
    label = "15th Contribution";
  } else {
    // New Date(year, month + 1, 0) correctly gets the last day of the current month
    deadline = new Date(year, month + 1, 0);
    label = "End of Month";
  }

  // 3. Precise Day Calculation
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffInMs = deadline.getTime() - today.getTime();
  
  // Math.round is safer here because we normalized 'today' to midnight
  const daysRemaining = Math.round(diffInMs / msPerDay);

  return { 
    days: daysRemaining, 
    label 
  };
};