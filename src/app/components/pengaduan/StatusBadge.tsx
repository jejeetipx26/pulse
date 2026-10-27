import { WARNA_STATUS, type Status } from "@/lib/tipe";

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${WARNA_STATUS[status]}`}>
      {status}
    </span>
  );
}
