import { BadgeProps } from "@/types";
import { STATUS_STYLES } from "@/styles/tokens";

export default function Badge({ label, variant }: BadgeProps) {
  const styles = STATUS_STYLES[variant] ?? STATUS_STYLES.default;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${styles.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {label}
    </span>
  );
}