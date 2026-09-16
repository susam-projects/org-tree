import { describe, expect, it } from 'vitest';
import { nextSort } from '@/orgTable/utils/nextSort';

describe('nextSort', () => {
  it('первый клик по столбцу сортирует по возрастанию', () => {
    expect(nextSort(null, 'budget')).toEqual({ column: 'budget', direction: 'asc' });
  });

  it('второй клик по тому же столбцу разворачивает порядок', () => {
    expect(nextSort({ column: 'budget', direction: 'asc' }, 'budget')).toEqual({
      column: 'budget',
      direction: 'desc',
    });
  });

  it('третий клик по тому же столбцу сбрасывает сортировку', () => {
    expect(nextSort({ column: 'budget', direction: 'desc' }, 'budget')).toBeNull();
  });

  it('проходит полный цикл и возвращается в исходное состояние', () => {
    const first = nextSort(null, 'budget');
    const second = nextSort(first, 'budget');
    const third = nextSort(second, 'budget');

    expect(first).toEqual({ column: 'budget', direction: 'asc' });
    expect(second).toEqual({ column: 'budget', direction: 'desc' });
    expect(third).toBeNull();
    expect(nextSort(third, 'budget')).toEqual(first);
  });

  it('клик по другому столбцу начинает цикл заново, а не продолжает прежний', () => {
    expect(nextSort({ column: 'budget', direction: 'asc' }, 'name')).toEqual({
      column: 'name',
      direction: 'asc',
    });
    expect(nextSort({ column: 'budget', direction: 'desc' }, 'name')).toEqual({
      column: 'name',
      direction: 'asc',
    });
  });
});
