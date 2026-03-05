export const getDaysUntilNextDeadline = (): { days: number, label: string } => {
  const today = new Date();
  const day = today.getDate();
  const year = today.getFullYear();
  const month = today.getMonth();

  // If today is 1st-15th, next deadline is the 15th
  if (day <= 15) {
    const deadline = new Date(year, month, 15);
    const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return { days: diff, label: "15th Contribution" };
  } 
  
  // If today is 16th-End, next deadline is the last day of the month
  const lastDay = new Date(year, month + 1, 0);
  const diff = Math.ceil((lastDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return { days: diff, label: "End of Month" };
};