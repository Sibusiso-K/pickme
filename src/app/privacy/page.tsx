// app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-white">Privacy Notice – Pikme (Pty) Ltd</h1>
        
        <div className="prose prose-sm max-w-none">
          <p className="text-white">
            This notice explains how Pikme (Pty) Ltd collects and processes personal information for driver onboarding,
            verification, and compliance with the Protection of Personal Information Act (POPIA).
          </p>

          <section className="mt-6 space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
            <p className="text-white">
              We collect the following personal information from drivers:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-white">
              <li>Full name, email address, and phone number</li>
              <li>Driver's licence details (front and back)</li>
              <li>Professional Driving Permit (PrDP)</li>
              <li>Vehicle information (VIN and number plate)</li>
              <li>Vehicle photographs (front, sides, and back)</li>
              <li>Insurance details (if applicable)</li>
              <li>Investment program preferences</li>
            </ul>
          </section>

          <section className="mt-6 space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Purpose of Processing</h2>
            <p className="text-white">
              We process your personal information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-white">
              <li>Verifying your eligibility to drive</li>
              <li>Managing your participation with Pikme under the National Land and Transportation Act (NLTA)</li>
              <li>Communicating with you about your onboarding status</li>
              <li>Complying with legal and regulatory requirements</li>
              <li>Processing investment program applications (if applicable)</li>
            </ul>
          </section>

          <section className="mt-6 space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Legal Basis</h2>
            <p className="text-white">
              We process your information based on your consent and for the performance of our contractual obligations
              as an e-hailing service provider.
            </p>
          </section>

          <section className="mt-6 space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Data Storage and Security</h2>
            <p className="text-white">
              Your personal information is stored securely on encrypted servers. We implement appropriate technical
              and organizational measures to protect your data from unauthorized access, disclosure, or destruction.
            </p>
          </section>

          <section className="mt-6 space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Your Rights</h2>
            <p className="text-white">
              Under POPIA, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-white">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
              <li>Object to processing of your information</li>
              <li>Withdraw your consent at any time</li>
            </ul>
          </section>

          <section className="mt-6 space-y-3">
            <h2 className="text-xl font-semibold text-white">6. Data Sharing</h2>
            <p className="text-white">
              We do not sell your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-white">
              <li>Service providers who assist with our operations</li>
              <li>Regulatory authorities when required by law</li>
              <li>Insurance providers (only with your consent)</li>
            </ul>
          </section>

          <section className="mt-6 space-y-3">
            <h2 className="text-xl font-semibold text-white">7. Retention Period</h2>
            <p className="text-white">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this notice,
              or as required by law. Typically, driver information is retained for the duration of your engagement with
              Pikme and for 5 years thereafter.
            </p>
          </section>

          <section className="mt-6 space-y-3">
            <h2 className="text-xl font-semibold text-white">8. Contact Us</h2>
            <p className="text-white">
              If you have any questions about this privacy notice or wish to exercise your rights, please contact us:
            </p>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 my-4">
              <dl className="space-y-2">
                <div>
                  <dt className="font-semibold text-white">WhatsApp:</dt>
                  <dd className="text-gray-300">
                    <a href="https://wa.me/27697574778" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                      069 757 4778
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Email:</dt>
                  <dd className="text-gray-300">
                    <a href="mailto:support@pikme.co.za" className="underline hover:text-white">
                      support@pikme.co.za
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="mt-8 rounded-lg border border-gray-700 p-6 bg-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4">Company Banking Details</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="font-medium text-gray-300">Bank</dt>
                <dd className="text-white">FNB/RMB</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-300">Account holder</dt>
                <dd className="text-white">Pikme (Pty) Ltd</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-300">Account type</dt>
                <dd className="text-white">Gold Business Account</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-300">Account number</dt>
                <dd className="text-white font-mono">63177960226</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-300">Branch code</dt>
                <dd className="text-white font-mono">250655</dd>
              </div>
            </dl>
          </section>
        </div>

        <footer className="mt-10 text-center text-xs text-gray-400 border-t border-gray-700 pt-6">
          <p>Last updated: {new Date().toLocaleDateString('en-ZA')}</p>
          <p className="mt-2">© {new Date().getFullYear()} Pikme (Pty) Ltd. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}