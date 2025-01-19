export function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function getDateStatus(dateString: string | null): 'today' | 'past' | 'none' {
	if (!dateString) return 'none';

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const date = new Date(dateString);
	date.setHours(0, 0, 0, 0);

	if (date.getTime() === today.getTime()) return 'today';
	if (date < today) return 'past';
	return 'none';
}
