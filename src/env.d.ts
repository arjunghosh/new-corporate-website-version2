/// <reference path="../.astro/types.d.ts" />

declare global {
  interface Window {
    __motionMode?: 'calm' | 'flow' | 'fast';
    __ambientMode?: 'on' | 'off';
    dataLayer?: unknown[];
  }
}

export {};
