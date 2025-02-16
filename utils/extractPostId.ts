export function extractPostId(slug: string): number | null {
	// 例: "1-this-is-a-test" → [ "1", "this", "is", "a", "test" ]
	const parts = slug.split('-');
	const id = Number(parts[0]);
	return isNaN(id) ? null : id;
}
