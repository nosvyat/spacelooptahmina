export function formatDateRu(date = new Date()) {
  const weekday = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long'
  }).format(date);

  const fullDate = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);

  return `Сегодня ${weekday}, ${fullDate}`;
}

export function isBirthday(date = new Date()) {
  const day = date.getDate();
  const month = date.getMonth();
  return day === 1 && month === 3;
}
