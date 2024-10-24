import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DepartmentManager } from '../../components/DepartmentManager';
import useDepartmentStore from '../../stores/departmentStore';

describe('Department Management Flow', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    useDepartmentStore.getState().reset();
  });

  test('complete user registration and department assignment flow', async () => {
    // Setup
    render(
      <MemoryRouter>
        <DepartmentManager />
      </MemoryRouter>
    );

    // Fill registration form
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/bio/i), 'Technical content creator');
    await user.type(screen.getByLabelText(/website/i), 'https://example.com');

    // Submit form
    await user.click(screen.getByRole('button', { name: /register/i }));

    // Verify department assignment
    await waitFor(() => {
      expect(screen.getByText(/Department Assignment/)).toBeInTheDocument();
    });

    // Verify profile creation
    const profile = useDepartmentStore.getState().getDepartmentProfile('testuser');
    expect(profile).toMatchObject({
      username: 'testuser',
      department: expect.any(String),
      email: expect.stringMatching(/@datamatchhub.com$/),
    });
  });

  test('department switching and data persistence', async () => {
    render(
      <MemoryRouter>
        <DepartmentManager />
      </MemoryRouter>
    );

    // Create initial department
    await act(async () => {
      useDepartmentStore.getState().addDepartment({
        id: 'technical',
        name: 'Technical',
        path: 'technical',
      });
    });

    // Switch departments
    await user.click(screen.getByText(/switch department/i));
    await user.click(screen.getByText(/blogger/i));

    // Verify data persistence
    const store = useDepartmentStore.getState();
    expect(store.departments).toHaveLength(2);
    expect(store.departments[1].id).toBe('technical');
  });

  test('error handling in department flow', async () => {
    render(
      <MemoryRouter>
        <DepartmentManager />
      </MemoryRouter>
    );

    // Trigger error state
    await act(async () => {
      useDepartmentStore.getState().addDepartment({
        id: 'invalid',
      });
    });

    // Verify error handling
    expect(screen.getByText(/invalid department configuration/i)).toBeInTheDocument();
  });
});