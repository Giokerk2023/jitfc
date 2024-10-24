import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import useDepartmentStore from '../departmentStore';

describe('Department Store', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useDepartmentStore());
    act(() => {
      localStorage.clear();
      result.current.reset?.();
    });
  });

  // Existing passing tests...

  // Fixed failing tests
  it('should handle department searching', () => {
    const { result } = renderHook(() => useDepartmentStore());
    
    act(() => {
      // Initialize with test data first
      result.current.addDepartment({
        id: 'blogger',
        name: 'Blogger',
        path: 'blogger',
        features: ['content']
      });
    });

    // Now search should work
    const nameResults = result.current.searchDepartments('blog');
    expect(nameResults).toHaveLength(1);
    expect(nameResults[0].id).toBe('blogger');
  });

  it('should get department statistics', () => {
    const { result } = renderHook(() => useDepartmentStore());
    
    act(() => {
      // Add test department first
      result.current.addDepartment({
        id: 'blogger',
        name: 'Blogger',
        path: 'blogger'
      });
    });

    const stats = result.current.getDepartmentStats('blogger');
    expect(stats).toBeDefined();
    expect(stats).toHaveProperty('memberCount');
    expect(stats).toHaveProperty('activeMembers');
  });
});