import { validateTitle, validateDescription, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from '../validation';

describe('validation utilities', () => {
  describe('validateTitle', () => {
    test('should accept valid title', () => {
      const result = validateTitle('Valid Title');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject empty title', () => {
      const result = validateTitle('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Title cannot be empty');
    });

    test('should reject whitespace-only title', () => {
      const result = validateTitle('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Title cannot be empty');
    });

    test('should reject title exceeding max length', () => {
      const longTitle = 'a'.repeat(MAX_TITLE_LENGTH + 1);
      const result = validateTitle(longTitle);
      expect(result.valid).toBe(false);
      expect(result.error).toContain(`${MAX_TITLE_LENGTH} characters`);
    });

    test('should accept title at max length', () => {
      const maxTitle = 'a'.repeat(MAX_TITLE_LENGTH);
      const result = validateTitle(maxTitle);
      expect(result.valid).toBe(true);
    });

    test('should reject non-string input', () => {
      const result = validateTitle(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Title is required');
    });
  });

  describe('validateDescription', () => {
    test('should accept valid description', () => {
      const result = validateDescription('Valid description');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should accept empty description (optional)', () => {
      const result = validateDescription('');
      expect(result.valid).toBe(true);
    });

    test('should reject description exceeding max length', () => {
      const longDesc = 'a'.repeat(MAX_DESCRIPTION_LENGTH + 1);
      const result = validateDescription(longDesc);
      expect(result.valid).toBe(false);
      expect(result.error).toContain(`${MAX_DESCRIPTION_LENGTH} characters`);
    });
  });
});


