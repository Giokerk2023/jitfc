import { DepartmentAnalyzer, DepartmentValidator } from '../departmentUtils';

describe('DepartmentAnalyzer', () => {
  const mockUserData = {
    username: 'testuser',
    bio: 'Professional content creator',
    website: 'https://example.com',
    social: {
      twitter: 'testuser',
      instagram: 'testuser'
    },
    content: [
      { type: 'article', topic: 'marketing' },
      { type: 'video', topic: 'tutorial' }
    ]
  };

  it('extracts features from user data', () => {
    const result = DepartmentAnalyzer.analyzeUserData(mockUserData);
    expect(result).toHaveProperty('features');
    expect(result).toHaveProperty('similarities');
    expect(result).toHaveProperty('recommendedDepartment');

    const { features } = result;
    expect(features).toHaveProperty('contentType');
    expect(features).toHaveProperty('topics');
    expect(features).toHaveProperty('socialPresence');
    expect(features).toHaveProperty('hasWebsite');
  });

  // Add the shouldCreateNewDepartment method to DepartmentAnalyzer
  it('determines if new department is needed', () => {
    const existingDepartments = [
      { id: 'blogger', name: 'Blogger' }
    ];

    const uniqueUserData = {
      ...mockUserData,
      content: [
        { type: 'research', topic: 'ai' }
      ]
    };

    const similarityThreshold = 0.7;
    const similarities = DepartmentAnalyzer._calculateSimilarities(uniqueUserData);
    const needsNewDepartment = !Object.values(similarities)
      .some(score => score > similarityThreshold);

    expect(needsNewDepartment).toBe(true);
  });
});