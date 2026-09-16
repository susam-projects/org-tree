import { describe, expect, it } from 'vitest';
import { sortRows } from '@/orgTable/utils/sortRows';
import type { OrgTableRow } from '@/orgTable/types/types';

function row(name: string, fields: Partial<OrgTableRow> = {}): OrgTableRow {
  return { id: name, name, depth: 0, headcount: 0, budget: 0, performance: 0, ...fields };
}

describe('sortRows', () => {
  it('без сортировки возвращает тот же массив по ссылке', () => {
    const rows = [row('б'), row('а')];
    expect(sortRows(rows, null)).toBe(rows);
  });

  it('сортирует названия по русскому алфавиту, а не по кодам символов', () => {
    const rows = [row('Ёлка'), row('Апрель'), row('Январь'), row('Ежевика')];
    const sorted = sortRows(rows, { column: 'name', direction: 'asc' }).map((r) => r.name);

    expect(sorted).toEqual(['Апрель', 'Ежевика', 'Ёлка', 'Январь']);
  });

  it('разворачивает порядок при направлении desc', () => {
    const rows = [row('в'), row('а'), row('б')];

    expect(sortRows(rows, { column: 'name', direction: 'asc' }).map((r) => r.name)).toEqual([
      'а',
      'б',
      'в',
    ]);
    expect(sortRows(rows, { column: 'name', direction: 'desc' }).map((r) => r.name)).toEqual([
      'в',
      'б',
      'а',
    ]);
  });

  it('сортирует числовые столбцы как числа', () => {
    const rows = [
      row('a', { headcount: 9 }),
      row('b', { headcount: 100 }),
      row('c', { headcount: 20 }),
    ];
    const sorted = sortRows(rows, { column: 'headcount', direction: 'asc' }).map(
      (r) => r.headcount,
    );

    expect(sorted).toEqual([9, 20, 100]);
  });

  it('сортирует уровень по глубине, а не по подписи', () => {
    const rows = [
      row('команда', { depth: 2 }),
      row('дивизион', { depth: 0 }),
      row('отдел', { depth: 1 }),
    ];
    const sorted = sortRows(rows, { column: 'depth', direction: 'asc' }).map((r) => r.depth);

    expect(sorted).toEqual([0, 1, 2]);
  });

  it('устойчива: при равных значениях сохраняет исходный порядок', () => {
    const rows = [
      row('первый', { depth: 1 }),
      row('второй', { depth: 1 }),
      row('третий', { depth: 1 }),
    ];
    const sorted = sortRows(rows, { column: 'depth', direction: 'asc' }).map((r) => r.name);

    expect(sorted).toEqual(['первый', 'второй', 'третий']);
  });

  it('не меняет исходный массив', () => {
    const rows = [row('в'), row('а'), row('б')];
    const before = rows.map((r) => r.name);

    sortRows(rows, { column: 'name', direction: 'asc' });

    expect(rows.map((r) => r.name)).toEqual(before);
  });
});
