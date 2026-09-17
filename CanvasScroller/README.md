# limestone/CanvasScroller (prototype)

A spike for the ticket *"Investigate the performance benefits of rendering a large, static content
block within a Canvas or WebGL context inside a Scroller component."*

**This is not a canvas-based rewrite of `Scroller`.** `limestone/Scroller` — and the `ui/useScroll`
engine under it — is untouched and still owns scrolling, Spotlight, scrollbars, overscroll, RTL and
hover-to-scroll. What changes is only how one large, static block of *content* is rasterized: a
single `<canvas>` instead of thousands of DOM nodes.

## Shape

```
<Scroller>                       ← unchanged limestone Scroller
  └ <div height={contentHeight}> ← reserves the real scroll range
      ├ <canvas position:sticky> ← viewport-sized, repainted with the visible slice
      └ <div class=textMirror>   ← one hidden node with the text, for assistive tech
```

The wrapper reserves the full content height, so the scroller's bounds, scrollbar proportions and
5-way paging arithmetic are identical to the DOM case. The canvas never leaves the scrollport; on
each scroll it is repainted with just the lines currently on screen, so paint cost is O(visible
lines) rather than O(content).

## Usage

```jsx
import CanvasScroller from '@enact/limestone/CanvasScroller';

<CanvasScroller
	blocks={[
		{type: 'heading', text: 'Terms of Service'},
		{type: 'paragraph', text: 'Lorem ipsum dolor sit amet…'}
	]}
/>
```

`blocks` is measured and broken into lines once, at mount. Keep the array reference stable —
changing it re-runs that pass, which is the most expensive thing this component does.

## What it is for

Genuinely static, non-interactive prose that is long enough for the DOM cost to matter: EULAs,
terms and conditions, privacy policies, open-source notices, release notes, long help articles.

## What it must not be used for

These are hard limits of the approach, not gaps in the prototype:

- **Anything focusable.** Canvas pixels are not DOM nodes, so nothing inside can be spotted. A
  block containing buttons, items or links loses 5-way navigation entirely.
- **Marquee.** `limestone/Marquee` needs a real element to measure and animate.
- **Content that changes after mount.** Every edit re-runs the measure/wrap pass.
- **Selectable or searchable text**, beyond what the hidden mirror provides.
- **Per-character i18n shaping beyond what `measureText` handles.** Line breaking here is
  whitespace-based; it is wrong for Thai, Khmer and Lao, which do not break on spaces, and it does
  not do BiDi reordering.

## Accessibility

`limestone/Scroller` already makes the scroll body itself spottable when `focusableScrollbar` is
set (`useThemeScroller.js` → `focusableBodyProps`), and labels it with `aria-labelledby={contentId}`
pointing at the scroll content node. So a scroller with zero spottable children is still operable by
remote: the body takes focus, 5-way scrolls it, Enter moves focus to the scroll thumb.

That is why the text mirror lives *inside* the scroll content: it keeps the existing
`aria-labelledby` contract working. It is one element and one text node, not one per paragraph, so
it does not reintroduce the DOM cost the canvas was meant to avoid.

Voice control and pointer-based text interaction are still lost — webOS voice control targets DOM
elements, and there are none.

## Files

| File | Role |
| --- | --- |
| `CanvasScroller.js` | Composition: `limestone/Scroller` + the canvas content block |
| `CanvasContentBlock.js` | The painter — sticky canvas, scroll pump, resize handling, a11y mirror, type probes |
| `textLayout.js` | Measure and line-break the content model once; binary search by `y` |

## Type comes from the theme, not from props

A canvas has no cascade, so the painter has to be told what the text looks like. It does **not**
carry its own type scale. Two hidden probe elements are rendered inside the block, styled by
`CanvasScroller.module.less` with limestone's own `.lime-body-text()` mixin and heading variables;
their resolved `font`, `color`, `line-height` and margins are read back with `getComputedStyle` and
handed to the layout pass in CSS pixels.

This is the only approach that stays correct. Restating the scale as numbers means duplicating
`@lime-body-font-size` and friends, and then silently missing `ri` resolution scaling, skin changes,
and the tall-glyph and non-Latin locale overrides — the first version of this prototype did exactly
that and rendered text at roughly a quarter of the right size. The probes are re-read once
`document.fonts.ready` settles, because glyph metrics change when the themed webfont finishes
loading and the wrap points would otherwise be measured against the fallback face.

## Status

Prototype. Not exported from the package index, no tests, no sampler entry. It uses an **eager**
layout pass: all text is measured at mount. See the accompanying investigation report for why that
is the deciding cost and what chunked layout does to it.

A runnable side-by-side demo lives in `limestone/samples/qa-canvasscroller`.
