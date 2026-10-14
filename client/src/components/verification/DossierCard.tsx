import NdigSeal from "@/components/brand/NdigSeal";

export type DossierStatus = "CONFIRMED" | "FLAGGED" | "REJECTED" | "PENDING";

export interface DossierCardProps {
  reference: string;
  /** ISO date string or Date */
  date: string | Date;
  subject: string;
  checkedAgainst: string;
  status: DossierStatus;
  variant?: "light" | "dark";
  /** Sample data: renders the "Illustrative example" footer. Real dossiers omit it. */
  illustrative?: boolean;
  className?: string;
}

const STATUS_TEXT: Record<DossierStatus, string> = {
  CONFIRMED: "Confirmed",
  FLAGGED: "Flagged",
  REJECTED: "Rejected",
  PENDING: "Under review",
};

function StatusIcon({ status }: { status: DossierStatus }) {
  const common = { width: 14, height: 14, viewBox: "0 0 16 16", "aria-hidden": true, focusable: false } as const;
  switch (status) {
    case "CONFIRMED":
      return (
        <svg {...common}><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      );
    case "FLAGGED":
      return (
        <svg {...common}><path d="M8 2l6.5 11.5h-13z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M8 6.5v3.2M8 11.6v.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      );
    case "REJECTED":
      return (
        <svg {...common}><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      );
    default:
      return (
        <svg {...common}><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M8 4.8V8l2.2 1.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      );
  }
}

function formatDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Africa/Lagos" });
}

export default function DossierCard({
  reference,
  date,
  subject,
  checkedAgainst,
  status,
  variant = "light",
  illustrative = false,
  className = "",
}: DossierCardProps) {
  const rows: Array<[string, string]> = [
    ["Reference", reference],
    ["Date", formatDate(date)],
    ["Subject", subject],
    ["Checked against", checkedAgainst],
  ];

  return (
    <article
      className={`ndig-dossier ${className}`}
      data-variant={variant}
      data-status={status}
      aria-label={`NDIG verification dossier ${reference}: ${STATUS_TEXT[status]}`}
    >
      <header className="ndig-dossier__band">
        <p className="ndig-dossier__eyebrow">Nigeria Diaspora Investment Gateway</p>
        <h3 className="ndig-dossier__title">Verification Dossier</h3>
      </header>

      <div className="ndig-dossier__body">
        <dl className="ndig-dossier__rows">
          {rows.map(([label, value]) => (
            <div key={label} className="ndig-dossier__row">
              <dt className="ndig-dossier__label">{label}</dt>
              <dd className="ndig-dossier__value">{value}</dd>
            </div>
          ))}
          <div className="ndig-dossier__row">
            <dt className="ndig-dossier__label">Status</dt>
            <dd>
              <span className="ndig-dossier__status">
                <StatusIcon status={status} />
                {status === "PENDING" ? "UNDER REVIEW" : status}
              </span>
            </dd>
          </div>
        </dl>

        <footer className="ndig-dossier__footer">
          {illustrative ? <p className="ndig-dossier__illustrative">Illustrative example</p> : <span />}
          <NdigSeal variant="small" className="ndig-dossier__seal" title="Verified by NDIG seal" />
        </footer>
      </div>
    </article>
  );
}

/** Map the API's lowercase status to the card's status variant. */
export function toDossierStatus(status: string): DossierStatus {
  switch (status) {
    case "confirmed":
      return "CONFIRMED";
    case "flagged":
      return "FLAGGED";
    case "rejected":
      return "REJECTED";
    default:
      return "PENDING";
  }
}
