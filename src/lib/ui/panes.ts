// Solid: pane state with persistence + auto-collapse + resize
import { createSignal, onCleanup, onMount } from 'solid-js';

type PaneSide = 'left' | 'right';

interface PaneOpts {
  side: PaneSide;                 // 'left' | 'right'
  storageKey: string;             // e.g., 'af:left:open'
  widthKey?: string;              // e.g., 'af:left:width'
  defaultOpen?: boolean;          // default true
  defaultWidth?: number;          // px, default 320
  min?: number;                   // px, default 240
  max?: number;                   // px, default 520
  autoCollapseUnder?: number;     // px, default 1100 (container width)
  container?: () => HTMLElement | null; // scroll/container element to observe width
}

export function createPaneState(opts: PaneOpts) {
  const {
    side,
    storageKey,
    widthKey = `${storageKey}:w`,
    defaultOpen = true,
    defaultWidth = 320,
    min = 240,
    max = 520,
    autoCollapseUnder = 1100,
    container,
  } = opts;

  const lsBool = (k: string, d: boolean) => {
    const v = localStorage.getItem(k);
    return v === null ? d : v === '1';
  };
  const lsNum = (k: string, d: number) => {
    const v = localStorage.getItem(k);
    const n = v === null ? NaN : Number(v);
    return Number.isFinite(n) ? n : d;
  };

  const [open, setOpen] = createSignal(lsBool(storageKey, defaultOpen));
  const [width, setWidth] = createSignal(Math.min(max, Math.max(min, lsNum(widthKey, defaultWidth))));
  const [dragging, setDragging] = createSignal(false);

  const saveOpen = (v: boolean) => localStorage.setItem(storageKey, v ? '1' : '0');
  const saveWidth = (w: number) => localStorage.setItem(widthKey, String(w));

  const toggle = () => {
    const next = !open();
    setOpen(next);
    saveOpen(next);
  };

  // Auto-collapse when container shrinks
  let ro: ResizeObserver | undefined;
  onMount(() => {
    const target = container?.() ?? document.documentElement;
    ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      const w = (entry.contentBoxSize?.[0]?.inlineSize) || (entry.contentRect?.width) || window.innerWidth;
      if (w < autoCollapseUnder && open()) {
        setOpen(false);
        saveOpen(false);
      }
    });
    ro.observe(target);
  });
  onCleanup(() => ro?.disconnect());

  // Drag to resize
  const onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startW = width();
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      // Left rail grows with +dx, right rail grows with -dx
      const next = side === 'left' ? startW + dx : startW - dx;
      const clamped = Math.min(max, Math.max(min, next));
      setWidth(clamped);
    };
    const onUp = (ev: PointerEvent) => {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      setDragging(false);
      saveWidth(width());
      window.removeEventListener('pointermove', onMove as any);
      window.removeEventListener('pointerup', onUp as any);
    };

    window.addEventListener('pointermove', onMove as any);
    window.addEventListener('pointerup', onUp as any);
  };

  // helpers for class toggles
  const railClass = () =>
    `${side === 'left' ? 'surface-left-2' : 'surface-right-2'} ${
      open() ? 'translate-x-0 opacity-100' :
      side === 'left' ? '-translate-x-full opacity-90' : 'translate-x-full opacity-90'
    } ${dragging() ? 'select-none' : ''}`;

  const style = () =>
    `width:${width()}px;` + (open() ? '' : 'pointer-events:none;');

  return { open, setOpen, toggle, width, setWidth, onPointerDown, railClass, style, dragging };
}
