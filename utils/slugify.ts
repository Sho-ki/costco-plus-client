// app/utils/slugify.ts
export function slugify(text: string): string {
	const slug = text.toLowerCase().trim().replace(/ +/g, '_').replace(/_+/g, '-');

	return slug.slice(0, 30); // 最大30文字まで
}
