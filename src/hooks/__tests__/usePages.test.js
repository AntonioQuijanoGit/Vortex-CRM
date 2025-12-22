import { renderHook, act } from '@testing-library/react';
import { usePages } from '../usePages';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('usePages', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  test('should initialize with default home page', () => {
    const { result } = renderHook(() => usePages());
    
    expect(result.current.pages).toHaveLength(1);
    expect(result.current.pages[0].id).toBe('home');
    expect(result.current.pages[0].title).toBe('Home');
    expect(result.current.activePage).toBe('home');
  });

  test('should add a new page', () => {
    const { result } = renderHook(() => usePages());
    
    act(() => {
      const pageId = result.current.addPage('Test Page', null, 'page');
      expect(pageId).toBeDefined();
    });

    expect(result.current.pages).toHaveLength(2);
    expect(result.current.pages[1].title).toBe('Test Page');
  });

  test('should update page title', () => {
    const { result } = renderHook(() => usePages());
    
    act(() => {
      const pageId = result.current.addPage('Original Title');
      result.current.updatePage(pageId, { title: 'Updated Title' });
    });

    const updatedPage = result.current.pages.find(p => p.title === 'Updated Title');
    expect(updatedPage).toBeDefined();
    expect(updatedPage.title).toBe('Updated Title');
  });

  test('should delete a page', () => {
    const { result } = renderHook(() => usePages());
    
    let pageId;
    act(() => {
      pageId = result.current.addPage('To Delete');
    });

    expect(result.current.pages).toHaveLength(2);

    act(() => {
      result.current.deletePage(pageId, true);
    });

    expect(result.current.pages).toHaveLength(1);
    expect(result.current.pages.find(p => p.id === pageId)).toBeUndefined();
  });

  test('should validate title when adding page', () => {
    const { result } = renderHook(() => usePages());
    
    act(() => {
      expect(() => {
        result.current.addPage('a'.repeat(201)); // Exceeds max length
      }).toThrow();
    });
  });

  test('should get root pages', () => {
    const { result } = renderHook(() => usePages());
    
    act(() => {
      result.current.addPage('Root Page 1');
      result.current.addPage('Root Page 2');
    });

    const rootPages = result.current.getRootPages();
    expect(rootPages.length).toBeGreaterThan(0);
    rootPages.forEach(page => {
      expect(page.parentId).toBeNull();
    });
  });

  test('should handle page with children', () => {
    const { result } = renderHook(() => usePages());
    
    let parentId;
    act(() => {
      parentId = result.current.addPage('Parent');
      result.current.addPage('Child', parentId);
    });

    const children = result.current.getChildren(parentId);
    expect(children).toHaveLength(1);
    expect(children[0].title).toBe('Child');
    expect(children[0].parentId).toBe(parentId);
  });
});

