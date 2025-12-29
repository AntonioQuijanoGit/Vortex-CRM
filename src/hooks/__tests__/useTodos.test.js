import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../useTodos';

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

describe('useTodos', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  test('should initialize with empty todos', () => {
    const { result } = renderHook(() => useTodos());
    
    expect(result.current.todos).toEqual([]);
  });

  test('should add a task', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Test Task', 'task');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Test Task');
    expect(result.current.todos[0].type).toBe('task');
    expect(result.current.todos[0].completed).toBe(false);
  });

  test('should add a habit', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Daily Habit', 'habit');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].type).toBe('habit');
    expect(result.current.todos[0].streak).toBe(0);
    expect(result.current.todos[0].completedDates).toEqual([]);
  });

  test('should toggle task completion', () => {
    const { result } = renderHook(() => useTodos());
    
    let todoId;
    act(() => {
      todoId = result.current.addTodo('Test Task', 'task');
    });

    expect(result.current.todos[0].completed).toBe(false);

    act(() => {
      result.current.toggleComplete(todoId);
    });

    expect(result.current.todos[0].completed).toBe(true);
  });

  test('should update todo title', () => {
    const { result } = renderHook(() => useTodos());
    
    let todoId;
    act(() => {
      todoId = result.current.addTodo('Original Title', 'task');
      result.current.updateTodo(todoId, 'Updated Title');
    });

    expect(result.current.todos[0].title).toBe('Updated Title');
  });

  test('should delete a todo', () => {
    const { result } = renderHook(() => useTodos());
    
    let todoId;
    act(() => {
      todoId = result.current.addTodo('To Delete', 'task');
    });

    expect(result.current.todos).toHaveLength(1);

    act(() => {
      result.current.deleteTodo(todoId);
    });

    expect(result.current.todos).toHaveLength(0);
  });

  test('should validate title when adding todo', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      expect(() => {
        result.current.addTodo(''); // Empty title
      }).toThrow();
    });
  });

  test('should update todo properties', () => {
    const { result } = renderHook(() => useTodos());
    
    let todoId;
    act(() => {
      todoId = result.current.addTodo('Test Task', 'task');
      result.current.updateTodoProperties(todoId, {
        priority: 'high',
        status: 'in-progress'
      });
    });

    expect(result.current.todos[0].priority).toBe('high');
    expect(result.current.todos[0].status).toBe('in-progress');
  });
});


