import styled, { css, keyframes } from 'styled-components';

const fadeRing = keyframes`
  from {
    box-shadow: 0 0 0 4px #fef08a;
  }
  to {
    box-shadow: 0 0 0 0 transparent;
  }
`;

const fadeHighlight = keyframes`
  from {
    background-color: #fef08a;
  }
  to {
    background-color: transparent;
  }
`;

export const NodeItem = styled.li`
  margin: 0;
  padding: 0;
`;

export const NodeRow = styled.div<{ $depth: number; $clickable: boolean; $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 8px 6px ${({ $depth }) => 8 + $depth * 20}px;
  border: none;
  background: ${({ $selected }) => ($selected ? '#dbeafe' : 'transparent')};
  box-shadow: ${({ $selected }) => ($selected ? 'inset 2px 0 0 #2563eb' : 'none')};
  font: inherit;
  font-weight: ${({ $selected }) => ($selected ? 600 : 'inherit')};
  text-align: left;
  color: inherit;
  border-radius: 4px;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:hover {
    background: ${({ $clickable, $selected }) =>
      $selected ? '#dbeafe' : $clickable ? '#f3f4f6' : 'transparent'};
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

export const PerformanceDot = styled.span<{ $color: string; $highlighted?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $color }) => $color};
  animation: ${({ $highlighted }) => ($highlighted ? css`${fadeRing} 1.5s ease-out` : 'none')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const NodeName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Headcount = styled.span<{ $highlighted?: boolean }>`
  flex-shrink: 0;
  color: #6b7280;
  font-size: 13px;
  border-radius: 3px;
  animation: ${({ $highlighted }) => ($highlighted ? css`${fadeHighlight} 1.5s ease-out` : 'none')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const ChildrenWrapper = styled.div<{ $expanded: boolean }>`
  display: grid;
  grid-template-rows: ${({ $expanded }) => ($expanded ? '1fr' : '0fr')};
  transition: grid-template-rows 200ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const ChildrenInner = styled.div`
  overflow: hidden;
  min-height: 0;
`;

export const ChildrenList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;
