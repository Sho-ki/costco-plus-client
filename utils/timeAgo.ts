import { DateTime } from 'luxon';

export function timeAgo(dateString: string): string {
	// ISO 形式の文字列をパース
	const dt = DateTime.fromISO(dateString);
	const now = DateTime.local();

	// 24時間以内の処理
	const diffHours = now.diff(dt, 'hours').hours;
	if (diffHours < 24) {
		if (diffHours < 1) {
			return '1時間以内';
		} else {
			return `${Math.floor(diffHours)}時間前`;
		}
	}

	// 24時間以上の場合は日数で計算
	const diffDays = now.diff(dt, 'days').days;
	if (diffDays < 30) {
		return `${Math.floor(diffDays)}日前`;
	}
	if (diffDays < 75) {
		return '1ヶ月前';
	}
	if (diffDays < 365) {
		return `${Math.floor(diffDays / 30)}ヶ月前`;
	}
	if (diffDays < 365 * 2) {
		return '1年前';
	}
	return '1年以上前';
}
