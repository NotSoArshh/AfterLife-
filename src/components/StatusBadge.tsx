import { STATUS } from "../data/types";
import type { StatusKind } from "../data/types";

const StatusBadge = ({
  status,
  short = false,
  className = "",
}: {
  status: StatusKind;
  short?: boolean;
  className?: string;
}) => {
  const def = STATUS[status];
  return (
    <span className={`status status--${status} ${className}`.trim()}>
      <span className="status__dot" aria-hidden="true" />
      {short ? def.short : def.label}
    </span>
  );
};

export default StatusBadge;
