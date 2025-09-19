const postPublishedAt = '2025-09-19T07:32:01.159Z';
const now = new Date();
const publishedDate = new Date(postPublishedAt);

console.log('Current time:', now.toISOString());
console.log('Post publishedAt:', postPublishedAt);
console.log('Published date object:', publishedDate.toISOString());
console.log('Is published date <= now?', publishedDate <= now);
console.log('Time difference (ms):', now.getTime() - publishedDate.getTime());
