import { Link } from "react-router-dom";
import type { Mission } from "../data/types";
import StatusBadge from "./StatusBadge";

interface MissionRowProps {
  mission: Mission;
  onPreview?: (mission: Mission | null, x: number, y: number) => void;
}

const MissionRow = ({ mission, onPreview }: MissionRowProps) => (
  <Link
    to={`/missions/${mission.id}`}
    className="row"
    onPointerEnter={(e) => onPreview?.(mission, e.clientX, e.clientY)}
    onPointerMove={(e) => onPreview?.(mission, e.clientX, e.clientY)}
    onPointerLeave={() => onPreview?.(null, 0, 0)}
    onFocus={() => onPreview?.(null, 0, 0)}
  >
    <span className="row__num">{mission.number}</span>
    <span className="row__main">
      <span className="row__title">{mission.title}</span>
      <span className="row__sub">{mission.subtitle}</span>
    </span>
    <span className="row__meta row__meta--dest">{mission.destinationLabel}</span>
    <span className="row__meta row__meta--date">{mission.launched}</span>
    <span className="row__status">
      <StatusBadge status={mission.status} short />
    </span>
    <span className="row__arrow" aria-hidden="true">
      →
    </span>
  </Link>
);

export default MissionRow;
