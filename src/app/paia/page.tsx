// app/paia/page.tsx
export default function PAIAPage() {
  return (
    <main className="min-h-screen relative">
      {/* Fixed background image */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
        <div
          className="absolute inset-0 bg-center bg-cover bg-fixed"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1600&auto=format&fit=crop)",
          }}
        />
      </div>

      <div className="relative z-10 px-4 py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-3xl font-bold text-white">PAIA Manual – Pikme (Pty) Ltd</h1>
          
          <div className="prose prose-sm max-w-none">
            <p className="text-white/90">
              This manual is published in accordance with Section 51 of the Promotion of Access to Information Act (PAIA), Act 2 of 2000.
            </p>

            <section className="mt-6 space-y-3 bg-black/40 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white">1. Company Information</h2>
              <dl className="space-y-2 text-white/90">
                <div>
                  <dt className="font-semibold text-white">Registered Name:</dt>
                  <dd>Pikme (Pty) Ltd</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Registration Number:</dt>
                  <dd>[To be provided by company]</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Physical Address:</dt>
                  <dd>[To be provided by company]</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Contact Details:</dt>
                  <dd>Email: support@pikme.co.za</dd>
                  <dd>WhatsApp: 069 757 4778</dd>
                </div>
              </dl>
            </section>

            <section className="mt-6 space-y-3 bg-black/40 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white">2. Information Officer</h2>
              <p className="text-white/90">
                The Information Officer is responsible for processing requests for access to information:
              </p>
              <dl className="space-y-2 text-white/90 mt-3">
                <div>
                  <dt className="font-semibold text-white">Name:</dt>
                  <dd>[To be appointed by company]</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Contact:</dt>
                  <dd>Email: support@pikme.co.za</dd>
                  <dd>Phone: 069 757 4778</dd>
                </div>
              </dl>
            </section>

            <section className="mt-6 space-y-3 bg-black/40 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white">3. Purpose of PAIA Manual</h2>
              <p className="text-white/90">
                This manual assists individuals who wish to:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-white/90 mt-2">
                <li>Request access to records held by Pikme (Pty) Ltd</li>
                <li>Understand the process for making access requests</li>
                <li>Know what categories of records are held by the company</li>
                <li>Understand the fees applicable to access requests</li>
              </ul>
            </section>

            <section className="mt-6 space-y-3 bg-black/40 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white">4. Categories of Records</h2>
              <p className="text-white/90">
                Pikme (Pty) Ltd maintains the following categories of records:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-white/90 mt-2">
                <li>Driver personal information and documentation</li>
                <li>Vehicle information and photographs</li>
                <li>Insurance records</li>
                <li>Investment program records</li>
                <li>Financial records and banking information</li>
                <li>Operational and administrative records</li>
                <li>Communication records (email, WhatsApp)</li>
              </ul>
            </section>

            <section className="mt-6 space-y-3 bg-black/40 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white">5. How to Request Access</h2>
              <p className="text-white/90">
                To request access to records:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-white/90 mt-2">
                <li>Submit a written request to the Information Officer</li>
                <li>Provide sufficient detail to identify the record(s) requested</li>
                <li>Specify your preferred form of access (inspection, copy, etc.)</li>
                <li>Provide proof of identity</li>
                <li>Pay the prescribed request fee (if applicable)</li>
              </ol>
              <p className="text-white/90 mt-3">
                Requests can be submitted via:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-white/90">
                <li>Email: support@pikme.co.za</li>
                <li>WhatsApp: 069 757 4778</li>
              </ul>
            </section>

            <section className="mt-6 space-y-3 bg-black/40 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white">6. Processing Timeframes</h2>
              <p className="text-white/90">
                The Information Officer will respond to requests within 30 days of receipt. This period may be extended by an additional 30 days if:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-white/90 mt-2">
                <li>The request is complex or voluminous</li>
                <li>Consultation with third parties is necessary</li>
                <li>Additional time is needed to locate records</li>
              </ul>
            </section>

            <section className="mt-6 space-y-3 bg-black/40 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white">7. Fees</h2>
              <p className="text-white/90">
                Fees for access to records are in accordance with the regulations published under PAIA. A request fee of R50.00 is payable upon submission (except for personal information requests by the data subject).
              </p>
              <p className="text-white/90 mt-2">
                Additional fees may apply for:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-white/90">
                <li>Photocopying and printing</li>
                <li>Preparation time</li>
                <li>Postal or electronic delivery</li>
              </ul>
            </section>

            <section className="mt-6 space-y-3 bg-black/40 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white">8. Grounds for Refusal</h2>
              <p className="text-white/90">
                Access to records may be refused if:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-white/90 mt-2">
                <li>The record contains third-party personal information</li>
                <li>Disclosure would breach confidentiality obligations</li>
                <li>The record relates to legal proceedings</li>
                <li>Disclosure would harm commercial interests</li>
                <li>The request is manifestly frivolous or vexatious</li>
              </ul>
            </section>

            <section className="mt-6 space-y-3 bg-black/40 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white">9. Remedies</h2>
              <p className="text-white/90">
                If your request is refused, you may:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-white/90 mt-2">
                <li>Lodge an internal appeal within 60 days</li>
                <li>Apply to the High Court for judicial review</li>
                <li>Lodge a complaint with the Information Regulator</li>
              </ul>
            </section>

            <section className="mt-8 rounded-lg border border-white/20 p-6 bg-black/60 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-white/70">Information Officer</dt>
                  <dd className="text-white">Email: support@pikme.co.za</dd>
                  <dd className="text-white">WhatsApp: 069 757 4778</dd>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <dt className="font-medium text-white/70">Information Regulator (South Africa)</dt>
                  <dd className="text-white">JD House, 27 Stiemens Street</dd>
                  <dd className="text-white">Braamfontein, Johannesburg, 2001</dd>
                  <dd className="text-white">Email: inforeg@justice.gov.za</dd>
                  <dd className="text-white">Tel: 010 023 5207</dd>
                </div>
              </dl>
            </section>
          </div>

          <footer className="mt-10 text-center text-xs text-white/60 border-t border-white/20 pt-6 bg-black/40 backdrop-blur-sm rounded-lg p-6">
            <p>Last updated: {new Date().toLocaleDateString('en-ZA')}</p>
            <p className="mt-2">© {new Date().getFullYear()} Pikme (Pty) Ltd. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </main>
  );
}