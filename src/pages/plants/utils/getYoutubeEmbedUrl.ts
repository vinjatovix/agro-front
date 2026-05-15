export function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtube.com')) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get('v')}`;
    }

    if (parsed.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }

    return null;
  } catch {
    return null;
  }
}
