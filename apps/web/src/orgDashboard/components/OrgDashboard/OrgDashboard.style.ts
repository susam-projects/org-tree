import styled from 'styled-components';

export const SPLIT_VIEW_MIN_WIDTH = '1280px';

export const Layout = styled.div`
  display: flex;
  width: 100%;
  max-width: 720px;
  flex-direction: column;
  gap: 16px;
  text-align: left;

  @media (min-width: ${SPLIT_VIEW_MIN_WIDTH}) {
    max-width: 1360px;
    flex-direction: row;
    align-items: flex-start;
    gap: 32px;
  }
`;

export const ViewSwitch = styled.div`
  display: flex;
  align-self: center;
  gap: 4px;
  padding: 2px;
  border: 1px solid #d1d5db;
  border-radius: 6px;

  @media (min-width: ${SPLIT_VIEW_MIN_WIDTH}) {
    display: none;
  }
`;

export const ViewButton = styled.button<{ $active: boolean }>`
  font: inherit;
  padding: 4px 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#fff' : '#374151')};
  background: ${({ $active }) => ($active ? '#2563eb' : 'transparent')};

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 1px;
  }
`;

export const Panel = styled.section<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  min-width: 0;
  width: 100%;

  @media (min-width: ${SPLIT_VIEW_MIN_WIDTH}) {
    display: block;
  }
`;

export const TreePanel = styled(Panel)`
  @media (min-width: ${SPLIT_VIEW_MIN_WIDTH}) {
    flex: 0 0 360px;
  }
`;

export const TablePanel = styled(Panel)`
  @media (min-width: ${SPLIT_VIEW_MIN_WIDTH}) {
    flex: 1;
  }
`;

export const PanelTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
`;

export const StatusMessage = styled.p`
  margin: 0;
  color: #6b7280;
  text-align: center;
`;
