export interface UiTextRuleBypass {
  readonly line: number;
  readonly match: string;
}

const RULE_NAME = 'no-hardcoded-ui-text';

export function findUiTextRuleBypasses(source: string): UiTextRuleBypass[] {
  return source
    .split('\n')
    .map((text, index) => ({ line: index + 1, match: text.trim() }))
    .filter(({ match }) => match.includes(RULE_NAME));
}
