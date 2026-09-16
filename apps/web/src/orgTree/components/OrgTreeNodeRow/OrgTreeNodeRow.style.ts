import styled from 'styled-components';

export const NodeItem = styled.li`
  margin: 0;
  padding: 0;
`;

export const NodeRow = styled.div<{ $depth: number; $clickable: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 8px 6px ${({ $depth }) => 8 + $depth * 20}px;
  border: none;
  background: transparent;
  font: inherit;
  text-align: left;
  color: inherit;
  border-radius: 4px;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:hover {
    background: ${({ $clickable }) => ($clickable ? '#f3f4f6' : 'transparent')};
  }
`;

export const ToggleIcon = styled.span<{ $expanded: boolean }>`
  display: inline-flex;
  width: 12px;
  flex-shrink: 0;
  transform: rotate(${({ $expanded }) => ($expanded ? 90 : 0)}deg);
  transition: transform 150ms ease;
  font-size: 10px;
  color: #6b7280;
`;

export const ToggleSpacer = styled.span`
  display: inline-flex;
  width: 12px;
  flex-shrink: 0;
`;

export const PerformanceDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $color }) => $color};
`;

export const NodeName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Headcount = styled.span`
  flex-shrink: 0;
  color: #6b7280;
  font-size: 13px;
`;

export const ChildrenList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;
