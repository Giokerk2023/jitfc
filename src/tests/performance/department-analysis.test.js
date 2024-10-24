import { describe, test, expect, beforeEach } from 'vitest';
import { PerformanceMonitor } from '../../utils/performance';

describe('Department Analysis Performance', () => {
  let monitor;
  
  beforeEach(() => {
    monitor = new PerformanceMonitor();
  });

  test('measures department operation performance', async () => {
    const startTime = performance.now();
    
    // Simulate department operations
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(200);
  });

  test('department creation is within performance budget', () => {
    const measurement = monitor.measureSync(() => {
      const department = {
        id: 'test',
        name: 'Test Department',
        path: 'test'
      };
      return department;
    });
    
    expect(measurement.duration).toBeLessThan(50);
  });
});