import * as S from '@/orgDashboard/components/ConnectionIndicator/ConnectionIndicator.style';
import type { ConnectionStatus } from '@/cache';

const labels: Record<ConnectionStatus, string> = {
  connecting: 'Подключение…',
  open: 'Обновления в реальном времени',
  reconnecting: 'Переподключение…',
  closed: 'Нет соединения',
};

interface ConnectionIndicatorProps {
  status: ConnectionStatus;
}

export function ConnectionIndicator({ status }: ConnectionIndicatorProps) {
  return (
    <S.Indicator role="status">
      <S.Dot $status={status} />
      {labels[status]}
    </S.Indicator>
  );
}
