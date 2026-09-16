import styled, { css, keyframes } from 'styled-components';

const fadeHighlight = keyframes`
  from {
    background-color: #fef08a;
  }
  to {
    background-color: transparent;
  }
`;

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
  padding: 0;
  border-bottom: 1px solid #d1d5db;
  font-weight: 600;
  text-align: ${({ $numeric }) => ($numeric ? 'right' : 'left')};
  vertical-align: bottom;
`;

export const SortButton = styled.button<{ $numeric?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $numeric }) => ($numeric ? 'flex-end' : 'flex-start')};
  gap: 4px;
  width: 100%;
  padding: 8px;
  border: none;
  background: transparent;
  font: inherit;
  font-weight: inherit;
  color: inherit;
  text-align: inherit;
  cursor: pointer;
  white-space: inherit;

  &:hover {
    background: #f3f4f6;
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: -2px;
  }
`;

export const SortMarker = styled.span`
  display: inline-block;
  width: 10px;
  flex-shrink: 0;
  font-size: 9px;
  color: #6b7280;
`;

export const EmptyMessage = styled.p`
  margin: 12px 0 0;
  color: #6b7280;
`;

export const BodyRow = styled.tr<{ $selected: boolean }>`
  cursor: pointer;
  background: ${({ $selected }) => ($selected ? '#dbeafe' : 'transparent')};
  font-weight: ${({ $selected }) => ($selected ? 600 : 'inherit')};

  &:hover {
    background: ${({ $selected }) => ($selected ? '#dbeafe' : '#f9fafb')};
  }
`;

export const Cell = styled.td<{ $numeric?: boolean; $highlighted?: boolean }>`
  padding: 6px 8px;
  border-bottom: 1px solid #f3f4f6;
  text-align: ${({ $numeric }) => ($numeric ? 'right' : 'left')};
  font-variant-numeric: ${({ $numeric }) => ($numeric ? 'tabular-nums' : 'normal')};
  animation: ${({ $highlighted }) => ($highlighted ? css`${fadeHighlight} 1.5s ease-out` : 'none')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const NameCell = styled(Cell)<{ $depth: number }>`
  padding-left: ${({ $depth }) => 8 + $depth * 16}px;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
