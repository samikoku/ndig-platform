import NdigSeal from "@/components/brand/NdigSeal";
import NdigShieldMark from "@/components/brand/NdigShieldMark";
import { DOSSIER } from "@/config/siteCopy";

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

function StatusIcon({ status }: { status: DossierStatus }) {
  const common = { viewBox: "0 0 24 24", "aria-hidden": true, focusable: false, className: "ndig-dossier__status-icon" } as const;
  switch (status) {
    case "CONFIRMED":
      return <svg {...common}><path d="M3.5 12.5l5.5 5.5L20.5 6" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case "FLAGGED":
      return <svg {...common}><path d="M12 3l10 17.5H2z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /><path d="M12 9.5v5M12 17.6v.1" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg>;
    case "REJECTED":
      return <svg {...common}><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M12 7v5.2l3.4 2.3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>;
  }
}

/** "14 OCTOBER 2026", Lagos time. */
export function formatDossierDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d.length === 10 ? `${d}T12:00:00Z` : d) : d;
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" }).toUpperCase();
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
  const statusText = DOSSIER.statusText[status];
  return (
    <article
      className={`ndig-dossier ${className}`}
      data-variant={variant}
      data-status={status}
      aria-label={`${DOSSIER.ariaPrefix} ${reference}: ${statusText}`}
    >
      <div className="ndig-dossier__frame">
        <header className="ndig-dossier__band">
          <NdigShieldMark className="ndig-dossier__mark" field={variant === "dark" ? "#054d28" : "#0b6b3a"} />
          <div>
            <p className="ndig-dossier__title">{DOSSIER.title}</p>
            <p className="ndig-dossier__subtitle">{DOSSIER.subtitle}</p>
          </div>
        </header>

        <p className="ndig-dossier__status">
          <StatusIcon status={status} />
          <span>
            {DOSSIER.statusPrefix} <span className="ndig-dossier__status-word">{statusText}</span>
          </span>
        </p>

        <dl className="ndig-dossier__grid">
          <div className="ndig-dossier__cell">
            <dt>{DOSSIER.labels.reference}</dt>
            <dd>{reference}</dd>
          </div>
          <div className="ndig-dossier__cell ndig-dossier__cell--date">
            <dt>{DOSSIER.labels.date}</dt>
            <dd>{formatDossierDate(date)}</dd>
          </div>
          <div className="ndig-dossier__cell ndig-dossier__cell--wide">
            <dt>{DOSSIER.labels.subject}</dt>
            <dd>{subject}</dd>
          </div>
          <div className="ndig-dossier__cell ndig-dossier__cell--wide">
            <dt>{DOSSIER.labels.checkedAgainst}</dt>
            <dd>{checkedAgainst}</dd>
          </div>
        </dl>

        <footer className="ndig-dossier__footer">
          {illustrative ? <p className="ndig-dossier__illustrative">{DOSSIER.illustrative}</p> : <span />}
        </footer>
        <NdigSeal variant="master" className="ndig-dossier__seal" title={DOSSIER.sealLabel} />
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
