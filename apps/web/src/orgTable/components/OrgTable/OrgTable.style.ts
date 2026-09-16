import styled from 'styled-components';

export const FilterRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
`;

export const FilterLabel = styled.label`
  font-size: 13px;
  color: #6b7280;
`;

export const FilterInput = styled.input`
  font: inherit;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  color: inherit;

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 1px;
  }
`;

export const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  white-space: nowrap;
`;

export const HeadCell = styled.th<{ $numeric?: boolean }>`
  padding: 8px;
  border-bottom: 1px solid #d1d5db;
  font-weight: 600;
  text-align: ${({ $numeric }) => ($numeric ? 'right' : 'left')};
  vertical-align: bottom;
`;

export const BodyRow = styled.tr`
  &:hover {
    background: #f9fafb;
  }
`;

export const Cell = styled.td<{ $numeric?: boolean }>`
  padding: 6px 8px;
  border-bottom: 1px solid #f3f4f6;
  text-align: ${({ $numeric }) => ($numeric ? 'right' : 'left')};
  font-variant-numeric: ${({ $numeric }) => ($numeric ? 'tabular-nums' : 'normal')};
`;

export const NameCell = styled(Cell)<{ $depth: number }>`
  padding-left: ${({ $depth }) => 8 + $depth * 16}px;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
