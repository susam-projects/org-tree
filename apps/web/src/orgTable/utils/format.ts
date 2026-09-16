const budgetFormat = new Intl.NumberFormat('ru-RU');
const performanceFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });
const headcountFormat = new Intl.NumberFormat('ru-RU');

const levelLabels = ['Дивизион', 'Отдел', 'Команда'];

export function formatBudget(budget: number): string {
  return `${budgetFormat.format(budget)} руб.`;
}

export function formatPerformance(performance: number): string {
  return `${performanceFormat.format(performance)}%`;
}

export function formatHeadcount(headcount: number): string {
  return headcountFormat.format(headcount);
}

export function getLevelLabel(depth: number): string {
  return levelLabels[depth] ?? `Уровень ${depth + 1}`;
}
