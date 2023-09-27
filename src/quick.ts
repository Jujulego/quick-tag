// Tag
export function quick(strings: TemplateStringsArray, ...args: unknown[]): string {
  let text = strings[0] ?? '';

  for (let i = 0; i < args.length; ++i) {
    text += args[i]! + strings[i + 1]!;
  }

  return text;
}
