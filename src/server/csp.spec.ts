import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { hashInlineCode } from './csp';

const hash = (s: string) => `'sha256-${createHash('sha256').update(s).digest('base64')}'`;

describe('hashInlineCode', () => {
  it('hache les scripts inline exécutables et les gestionnaires inline uniquement', () => {
    const html = `
      <script>var a = 1;</script>
      <script src="/main.js"></script>
      <script type="application/json" id="ng-state">{}</script>
      <script type="application/ld+json">{"@type":"Person"}</script>
      <link rel="stylesheet" href="s.css" media="print" onload="this.media='all'">`;
    expect(hashInlineCode(html)).toEqual({ scripts: [hash('var a = 1;')], handlers: [hash("this.media='all'")] });
  });
});
