const BOUNDARY = "NDIG does not guarantee the products or performance of any partner institution.";

const columns = ["Date", "Institution", "Regulator", "Licence number", "Verification date", "Re-check due"];

export default function Assurance() {
  return (
    <div className="flex flex-col w-full">
      <section className="py-16 md:py-24 bg-sidebar text-sidebar-foreground">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white">NDIG Assurance</h1>
            <p className="text-sm text-gray-300">{BOUNDARY}</p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="border-l-4 border-gold bg-muted/50 p-5 rounded-r-lg" role="note">
              <p className="text-base md:text-lg leading-relaxed">
                This page lists institutions that have passed NDIG's verification gate. Listing is not recommendation. NDIG never holds funds, sells products, or gives investment advice. Entries are removed when verification expires or is withdrawn.
              </p>
            </div>

            <p className="text-base md:text-lg font-medium">
              No institution has yet passed the nine-point gate. The first entry will appear here, with its verification date and re-check date, when it does.
            </p>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-2">Register</h2>
              <p className="text-sm text-muted-foreground mb-4">Listed alphabetically by institution.</p>
              <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/60">
                    <tr>
                      {columns.map((c) => (
                        <th key={c} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={columns.length} className="px-4 py-6 text-muted-foreground">
                        No entries.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-2">Withdrawal log</h2>
              <p className="text-base">No withdrawals to date.</p>
            </div>

            <div className="border-2 border-primary/20 rounded-xl p-6 md:p-8" id="how-ndig-is-funded">
              <p className="text-base leading-relaxed mb-3">
                <strong>How NDIG is funded:</strong> institutions pay ₦2,500,000 to undergo verification — the fee buys the process, not the outcome, and is charged whether the institution passes or fails. Members pay $75 / ₦100,000 per year for Assurance membership. NDIG earns nothing from any product sale, takes no commission on any transaction, and accepts no payment that influences a listing.
              </p>
              <p className="text-sm text-muted-foreground">{BOUNDARY}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
