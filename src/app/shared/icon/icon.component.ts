import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { IconName } from '../../data/profile.model';

type Shape =
  | { t: 'path'; d: string }
  | { t: 'circle'; cx: number; cy: number; r: number }
  | { t: 'rect'; x: number; y: number; w: number; h: number; rx?: number }
  | { t: 'ellipse'; cx: number; cy: number; rx: number; ry: number };

const p = (d: string): Shape => ({ t: 'path', d });

/** Icônes SVG inline (tracés inspirés de Lucide, licence ISC) — remplace Font Awesome. */
const ICONS: Record<IconName, Shape[]> = {
  'arrow-right': [p('M5 12h14'), p('m12 5 7 7-7 7')],
  'arrow-left': [p('m12 19-7-7 7-7'), p('M19 12H5')],
  briefcase: [{ t: 'rect', x: 2, y: 7, w: 20, h: 14, rx: 2 }, p('M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16')],
  check: [p('M20 6 9 17l-5-5')],
  'chevron-down': [p('m6 9 6 6 6-6')],
  close: [p('M18 6 6 18'), p('m6 6 12 12')],
  cloud: [p('M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z')],
  code: [p('m16 18 6-6-6-6'), p('m8 6-6 6 6 6')],
  database: [{ t: 'ellipse', cx: 12, cy: 5, rx: 9, ry: 3 }, p('M3 5v14a9 3 0 0 0 18 0V5'), p('M3 12a9 3 0 0 0 18 0')],
  download: [p('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'), p('m7 10 5 5 5-5'), p('M12 15V3')],
  external: [p('M15 3h6v6'), p('M10 14 21 3'), p('M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6')],
  github: [
    p(
      'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4',
    ),
    p('M9 18c-4.51 2-5-2-7-2'),
  ],
  graduation: [p('M22 10 12 5 2 10l10 5 10-5Z'), p('M22 10v6'), p('M6 12v5c3 3 9 3 12 0v-5')],
  layout: [{ t: 'rect', x: 3, y: 3, w: 18, h: 18, rx: 2 }, p('M3 9h18'), p('M9 21V9')],
  linkedin: [
    p('M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z'),
    { t: 'rect', x: 2, y: 9, w: 4, h: 12 },
    { t: 'circle', cx: 4, cy: 4, r: 2 },
  ],
  mail: [{ t: 'rect', x: 2, y: 4, w: 20, h: 16, rx: 2 }, p('m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7')],
  'map-pin': [p('M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'), { t: 'circle', cx: 12, cy: 10, r: 3 }],
  menu: [p('M4 6h16'), p('M4 12h16'), p('M4 18h16')],
  moon: [p('M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z')],
  phone: [
    p(
      'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z',
    ),
  ],
  printer: [
    p('M6 9V2h12v7'),
    p('M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2'),
    { t: 'rect', x: 6, y: 14, w: 12, h: 8 },
  ],
  server: [
    { t: 'rect', x: 2, y: 2, w: 20, h: 8, rx: 2 },
    { t: 'rect', x: 2, y: 14, w: 20, h: 8, rx: 2 },
    p('M6 6h.01'),
    p('M6 18h.01'),
  ],
  shield: [p('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z'), p('m9 12 2 2 4-4')],
  sun: [
    { t: 'circle', cx: 12, cy: 12, r: 4 },
    p('M12 2v2'),
    p('M12 20v2'),
    p('m4.93 4.93 1.41 1.41'),
    p('m17.66 17.66 1.41 1.41'),
    p('M2 12h2'),
    p('M20 12h2'),
    p('m6.34 17.66-1.41 1.41'),
    p('m19.07 4.93-1.41 1.41'),
  ],
  users: [
    p('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'),
    { t: 'circle', cx: 9, cy: 7, r: 4 },
    p('M22 21v-2a4 4 0 0 0-3-3.87'),
    p('M16 3.13a4 4 0 0 1 0 7.75'),
  ],
  workflow: [
    { t: 'rect', x: 3, y: 3, w: 8, h: 8, rx: 2 },
    p('M7 11v4a2 2 0 0 0 2 2h4'),
    { t: 'rect', x: 13, y: 13, w: 8, h: 8, rx: 2 },
  ],
};

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0 leading-none', 'aria-hidden': 'true' },
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      [attr.width]="size()"
      [attr.height]="size()"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      focusable="false"
    >
      @for (s of shapes(); track $index) {
        @switch (s.t) {
          @case ('path') {
            <svg:path [attr.d]="s.d" />
          }
          @case ('circle') {
            <svg:circle [attr.cx]="s.cx" [attr.cy]="s.cy" [attr.r]="s.r" />
          }
          @case ('rect') {
            <svg:rect [attr.x]="s.x" [attr.y]="s.y" [attr.width]="s.w" [attr.height]="s.h" [attr.rx]="s.rx ?? null" />
          }
          @case ('ellipse') {
            <svg:ellipse [attr.cx]="s.cx" [attr.cy]="s.cy" [attr.rx]="s.rx" [attr.ry]="s.ry" />
          }
        }
      }
    </svg>
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<number>(20);
  protected readonly shapes = computed(() => ICONS[this.name()]);
}
