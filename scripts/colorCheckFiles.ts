export const TOKENS_FILE = 'src/styles/tokens.css';

const SOURCE_FILE_PATTERN = /^src\/.+\.(css|ts|tsx)$/;

export function selectColorCheckFiles(paths: readonly string[]): string[] {
  return paths
    .filter(
      (path) =>
        path === 'index.html' ||
        (SOURCE_FILE_PATTERN.test(path) && path !== TOKENS_FILE)
    )
    .sort();
}
