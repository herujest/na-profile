// Mock GSAP for server-side rendering
// GSAP is client-side only and should not be used in SSR

const noop = () => {};
const noopReturn = () => ({ kill: noop, pause: noop, resume: noop, restart: noop });

const mockGSAP = {
  to: noopReturn,
  from: noopReturn,
  fromTo: noopReturn,
  set: noop,
  timeline: () => ({
    to: noopReturn,
    from: noopReturn,
    fromTo: noopReturn,
    set: noop,
    kill: noop,
    pause: noop,
    resume: noop,
    restart: noop,
  }),
  Power3: { 
    easeOut: 'power3.out', 
    easeIn: 'power3.in', 
    easeInOut: 'power3.inOut' 
  },
  ScrollTrigger: {
    create: noopReturn,
    refresh: noop,
    getAll: () => [],
    clearScrollMemory: noop,
    killAll: noop,
  },
};

// Export as default
module.exports = mockGSAP;
module.exports.default = mockGSAP;

// Also export ScrollTrigger as named export for gsap/ScrollTrigger imports
module.exports.ScrollTrigger = mockGSAP.ScrollTrigger;

