module.exports = {
  extends: 'lighthouse:default',
  settings: {
    // Mobile test
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      downloadThroughputKbps: 1638.4,
      uploadThroughputKbps: 819.2,
      cpuSlowdownMultiplier: 4
    }
  },
  passes: [
    {
      passName: 'defaultPass',
      gatherers: ['accessibility', 'best-practices', 'seo', 'performance']
    }
  ],
  audits: [
    'accessibility',
    'best-practices',
    'first-contentful-paint',
    'largest-contentful-paint',
    'cumulative-layout-shift',
    'first-input-delay',
    'interactive'
  ]
};
