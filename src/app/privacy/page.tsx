// app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold">Privacy Notice — Pikme (Pty) Ltd</h1>
        <p className="text-sm">
          This notice explains how Pikme (Pty) Ltd collects and processes personal information for driver onboarding,
          verification, and compliance.
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Collection and use</h2>
          <p className="text-sm">
            We collect contact details, vehicle information, and supporting documents to validate eligibility and manage
            participation in our platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Your rights</h2>
          <p className="text-sm">
            You may access, correct, or delete your data where applicable. Contact our support channel to submit a
            request.
          </p>
        </section>

        <section className="rounded-lg border p-4">
          <h3 className="text-base font-semibold">Company banking details</h3>
          <dl className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Bank</dt>
              <dd className="text-sm">FNB/RMB</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Account holder</dt>
              <dd className="text-sm">Pikme (Pty) Ltd</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Account type</dt>
              <dd className="text-sm">Gold Business Account</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Account number</dt>
              <dd className="text-sm">63177960226</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Branch code</dt>
              <dd className="text-sm">250655</dd>
            </div>
          </dl>
        </section>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Pikme (Pty) Ltd
        </p>
      </div>
    </main>
  );
}
