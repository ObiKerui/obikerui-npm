import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'd3-plot-lib',
      root: './packages/d3-plot-lib',
      environment: 'jsdom',
      setupFiles: ['./test/setupTests.ts'],
    },
  },
  {
    test: {
      name: 'd3-solar-lib',
      root: './packages/d3-solar-lib',
      environment: 'jsdom',
      setupFiles: ['./test/setupTests.ts'],
    },
  },
]);
