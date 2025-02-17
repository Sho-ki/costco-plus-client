import { DateTime } from 'luxon';

export function timeAgo(dateString: string): string {
	const dt = DateTime.fromISO(dateString);
	const now = DateTime.local();

	const diffInSeconds = now.diff(dt, 'seconds').seconds;
	const diffInMinutes = now.diff(dt, 'minutes').minutes;
	const diffInHours = now.diff(dt, 'hours').hours;
	const diffInDays = now.diff(dt, 'days').days;

	if (diffInSeconds < 60) {
		return 'たった今';
	}

	if (diffInMinutes < 60) {
		const minutes = Math.floor(diffInMinutes);
		return `${minutes}分前`;
	}

	if (diffInHours < 24) {
		const hours = Math.floor(diffInHours);
		return `${hours}時間前`;
	}

	if (diffInDays < 30) {
		const days = Math.floor(diffInDays);
		return `${days}日前`;
	}

	if (diffInDays < 75) {
		return '1ヶ月前';
	}
	if (diffInDays < 365) {
		const months = Math.floor(diffInDays / 30);
		return `${months}ヶ月前`;
	}
	if (diffInDays < 365 * 2) {
		return '1年前';
	}
	return '1年以上前';
}
