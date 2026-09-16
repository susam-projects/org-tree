import { describe, expect, it } from 'vitest';
import { filterRows } from '@/orgTable/utils/filterRows';
import type { OrgTableRow } from '@/orgTable/types/types';

function row(name: string, fields: Partial<OrgTableRow> = {}): OrgTableRow {
  return { id: name, name, depth: 0, headcount: 0, budget: 0, performance: 0, ...fields };
}

const rows = [row('Технологии'), row('Разработка'), row('Розничные продажи'), row('QA')];

describe('filterRows', () => {
  it('без запроса возвращает тот же массив по ссылке', () => {
    expect(filterRows(rows, '')).toBe(rows);
    expect(filterRows(rows, '   ')).toBe(rows);
  });

  it('находит по подстроке, а не только по началу названия', () => {
    expect(filterRows(rows, 'продажи').map((r) => r.name)).toEqual(['Розничные продажи']);
  });

  it('не зависит от регистра, включая кириллицу', () => {
    expect(filterRows(rows, 'РАЗРАБОТКА').map((r) => r.name)).toEqual(['Разработка']);
    expect(filterRows(rows, 'qa').map((r) => r.name)).toEqual(['QA']);
  });

  it('игнорирует пробелы по краям запроса', () => {
    expect(filterRows(rows, '  Технологии  ').map((r) => r.name)).toEqual(['Технологии']);
  });

  it('возвращает пустой список, когда совпадений нет', () => {
    expect(filterRows(rows, 'бухгалтерия')).toEqual([]);
  });

  it('не меняет исходный массив', () => {
    const before = [...rows];
    filterRows(rows, 'продажи');
    expect(rows).toEqual(before);
  });
});
