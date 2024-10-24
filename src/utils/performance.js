export class PerformanceMonitor {
  static measurements = new Map();
  
  static startMeasurement(name) {
    if (!window.performance) return;
    performance.mark(`${name}-start`);
  }
  
  static endMeasurement(name) {
    if (!window.performance) return;
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measurements = performance.getEntriesByName(name);
    this.measurements.set(name, measurements[measurements.length - 1].duration);
    
    return this.measurements.get(name);
  }
  
  static getMetrics() {
    return Object.fromEntries(this.measurements);
  }
}

// Performance Test
export const measureDepartmentOperations = async () => {
  PerformanceMonitor.startMeasurement('department-analysis');
  const result = await DepartmentAnalyzer.analyzeUserData({
    username: 'test',
    bio: 'Test bio',
    content: [{ type: 'article' }]
  });
  const duration = PerformanceMonitor.endMeasurement('department-analysis');
  
  return {
    duration,
    result
  };
};