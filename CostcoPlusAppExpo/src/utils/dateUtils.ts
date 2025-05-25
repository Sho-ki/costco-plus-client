import {format, formatDistanceToNow, parseISO} from 'date-fns';
import {ja} from 'date-fns/locale';

export function formatRelativeTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, {addSuffix: true, locale: ja});
  } catch (error) {
    console.error('Error formatting date:', error);
    return '不明';
  }
}

export function formatDate(
  dateString: string,
  formatString: string = 'yyyy/MM/dd',
): string {
  try {
    const date = parseISO(dateString);
    return format(date, formatString, {locale: ja});
  } catch (error) {
    console.error('Error formatting date:', error);
    return '不明';
  }
}

export function getDateStatus(
  dateString: string | null,
): 'today' | 'past' | 'none' {
  if (!dateString) return 'none';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) return 'today';
  if (date < today) return 'past';
  return 'none';
}
