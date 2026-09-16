import styled, { css, keyframes } from 'styled-components';
import type { ConnectionStatus } from '@/cache';

const pulse = keyframes`
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
`;

const dotColors: Record<ConnectionStatus, string> = {
  connecting: '#f59e0b',
  open: '#16a34a',
  reconnecting: '#f59e0b',
  closed: '#dc2626',
};

export const Indicator = styled.div`
  display: inline-flex;
  align-self: center;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
`;

export const Dot = styled.span<{ $status: ConnectionStatus }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $status }) => dotColors[$status]};
  animation: ${({ $status }) =>
    $status === 'connecting' || $status === 'reconnecting'
      ? css`
          ${pulse} 1.5s ease-in-out infinite
        `
      : 'none'};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
