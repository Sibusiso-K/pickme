// app/page.tsx
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sb } from "@/lib/supabase";

const MAX_MB = 5;
const MAX_FILE_SIZE = MAX_MB * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"] as const;

const FormSchema = z.object({
  full_name: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.enum(["owner", "driver", "both"]),
  vin: z.string().min(5, "VIN must be at least 5 characters"),
  number_plate: z.string().min(2, "Required"),
  insurer: z.string().optional(),
  monthly_premium: z.number().nonnegative().optional(),
  join_invest_program: z.enum(["yes", "no"]),
  investment_tier: z.enum(["tier1", "tier2", "tier3", "none"]).optional(),
  consent_popia: z.boolean().refine((v) => v === true, { message: "You must accept the privacy policy" }),
}).refine((data) => {
  if (data.join_invest_program === "no" && data.investment_tier && data.investment_tier !== "none") {
    return false;
  }
  return true;
}, {
  message: "Cannot select a tier if not joining the program",
  path: ["investment_tier"],
});

type FormValues = z.infer<typeof FormSchema>;

type DocType =
  | "license_front"
  | "license_back"
  | "prdp"
  | "car_front"
  | "car_left"
  | "car_right"
  | "car_back";

const DOC_LABELS: Record<DocType, string> = {
  license_front: "Driver's licence (front)",
  license_back: "Driver's licence (back)",
  prdp: "PRDP",
  car_front: "Car photo: front",
  car_left: "Car photo: left",
  car_right: "Car photo: right",
  car_back: "Car photo: back",
};

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i) : "";
}

async function getSignedUploadToken(path: string) {
  try {
    const r = await fetch("/api/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    
    if (!r.ok) {
      const errorData = await r.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || `HTTP ${r.status}: ${r.statusText}`);
    }
    
    const { token } = await r.json();
    if (!token) {
      throw new Error("No token returned from server");
    }
    return token as string;
  } catch (error) {
    console.error("Upload token error:", error);
    throw new Error(`Failed to get upload token: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

async function uploadFile(docType: DocType, file: File, folderId: string) {
  if (!ALLOWED.includes(file.type as typeof ALLOWED[number])) {
    throw new Error(`${DOC_LABELS[docType]} must be JPEG/PNG/WebP`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`${DOC_LABELS[docType]} exceeds ${MAX_MB}MB`);
  }
  const path = `${folderId}/${docType}${extOf(file.name)}`;
  const token = await getSignedUploadToken(path);
  const { error } = await sb.storage
    .from("driver-docs")
    .uploadToSignedUrl(path, token, file);
  if (error) throw new Error(error.message);
  return path;
}

export default function Page() {
  const [status, setStatus] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: "driver",
      join_invest_program: "no",
      investment_tier: "none",
      consent_popia: false,
    },
  });

  const joinInvest = watch("join_invest_program");
  const chosenTier = watch("investment_tier");

  const setTier = (tier: "tier1" | "tier2" | "tier3") => {
    if (joinInvest === "no") return;
    setValue("investment_tier", chosenTier === tier ? "none" : tier, {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      setStatus("Uploading files…");
      const folderId = crypto.randomUUID();
      const docTypes: DocType[] = [
        "license_front",
        "license_back",
        "prdp",
        "car_front",
        "car_left",
        "car_right",
        "car_back",
      ];

      // Collect and validate file inputs
      const files: Record<DocType, File> = {} as Record<DocType, File>;
      for (const t of docTypes) {
        const el = document.getElementById(t) as HTMLInputElement | null;
        const f = el?.files?.[0];
        if (!f) throw new Error(`Missing file: ${DOC_LABELS[t]}`);
        files[t] = f;
      }

      // Upload files
      const uploaded: Array<{ type: DocType; file_path: string }> = [];
      for (const t of docTypes) {
        const file_path = await uploadFile(t, files[t], folderId);
        uploaded.push({ type: t, file_path });
      }

      setStatus("Saving submission…");
      
      // Prepare payload
      const payload = {
        ...values,
        has_insurance: !!(values.insurer && values.insurer.trim() !== ""),
        investment_tier: values.investment_tier || "none",
        docs: uploaded,
      };

      const resp = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Submit failed");

      setSuccess(true);
      setStatus(
        `Thank you! Reference: ${data.id}. You will receive email and WhatsApp confirmation within 3–5 business days.`
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`Error: ${msg}`);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Thank You!</h2>
          <p className="text-gray-600">{status}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Submit Another
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero with background */}
      <header className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-10" />
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1600&auto=format&fit=crop)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              Driver Onboarding
            </h1>
            <p className="text-white/90 mt-2 drop-shadow">Join the Pikme driver community</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <section className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full name *
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  {...register("full_name")}
                  placeholder="John Doe"
                />
                {errors.full_name && (
                  <p className="text-sm text-red-600 mt-1">{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  type="email"
                  {...register("email")}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  inputMode="tel"
                  placeholder="0812345678"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-black focus:ring-1 focus:ring-black"
                  {...register("role")}
                >
                  <option value="owner">Owner</option>
                  <option value="driver">Driver</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>
          </section>

          {/* Vehicle Information */}
          <section className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Vehicle Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VIN *</label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="Vehicle Identification Number"
                  {...register("vin")}
                />
                {errors.vin && (
                  <p className="text-sm text-red-600 mt-1">{errors.vin.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number plate *
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="ABC 123 GP"
                  {...register("number_plate")}
                />
                {errors.number_plate && (
                  <p className="text-sm text-red-600 mt-1">{errors.number_plate.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Documents */}
          <section className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Required Documents</h2>
            <p className="text-sm text-gray-600">
              All documents must be clear images (JPEG/PNG/WebP, max {MAX_MB}MB each)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driver's licence (front) *
                </label>
                <input
                  id="license_front"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driver's licence (back) *
                </label>
                <input
                  id="license_back"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PRDP *</label>
                <input
                  id="prdp"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car photo: front *
                </label>
                <input
                  id="car_front"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car photo: left side *
                </label>
                <input
                  id="car_left"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car photo: right side *
                </label>
                <input
                  id="car_right"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car photo: back *
                </label>
                <input
                  id="car_back"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
                />
              </div>
            </div>
          </section>

          {/* Insurance */}
          <section className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Insurance Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurer (optional)
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="e.g. Outsurance, King Price"
                  {...register("insurer")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly premium (ZAR, optional)
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  type="number"
                  step="0.01"
                  placeholder="1200.00"
                  {...register("monthly_premium", { valueAsNumber: true })}
                />
                {errors.monthly_premium && (
                  <p className="text-sm text-red-600 mt-1">{errors.monthly_premium.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Investment Program */}
          <section className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Pikme Driver Transition Investment Program
            </h2>
            <p className="text-sm text-gray-600">
              Would you like to participate in our optional investment program?
            </p>

            <div className="flex gap-6">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="yes"
                  className="w-4 h-4 text-black"
                  {...register("join_invest_program")}
                />
                <span className="text-sm font-medium">Yes</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="no"
                  className="w-4 h-4 text-black"
                  {...register("join_invest_program")}
                />
                <span className="text-sm font-medium">No</span>
              </label>
            </div>

            {joinInvest === "yes" && (
              <div className="space-y-3 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700">Select investment tier:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                      chosenTier === "tier1"
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={chosenTier === "tier1"}
                      onChange={() => setTier("tier1")}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium">Tier 1</div>
                      <div className="text-sm text-gray-600">R100 = 40% discount</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                      chosenTier === "tier2"
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={chosenTier === "tier2"}
                      onChange={() => setTier("tier2")}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium">Tier 2</div>
                      <div className="text-sm text-gray-600">R200 = 55% discount</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                      chosenTier === "tier3"
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={chosenTier === "tier3"}
                      onChange={() => setTier("tier3")}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium">Tier 3</div>
                      <div className="text-sm text-gray-600">R300 = 80% discount</div>
                    </div>
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-3">
                  <div>
                    <p className="font-medium text-blue-900 mb-2">Payment Instructions:</p>
                    <p className="text-blue-800 mb-2">
                      Please send proof of payment to our WhatsApp support or email after submitting
                      this form. Banking details are provided below.
                    </p>
                    <div className="space-y-1 text-blue-900">
                      <p><strong>WhatsApp:</strong> 069 757 4778</p>
                      <p><strong>Email:</strong> support@pikme.co.za</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-800">
                      <strong>Important:</strong> Subscription discounts are valid for 3 months upon launch. 
                      Once proof of payment is received, Pikme will send you a documented receipt of transaction.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Banking Details */}
          <section className="bg-gray-50 rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Banking Details</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="font-medium text-gray-700">Bank</dt>
                <dd className="text-gray-900">FNB/RMB</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Account holder</dt>
                <dd className="text-gray-900">Pikme (Pty) Ltd</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Account type</dt>
                <dd className="text-gray-900">Gold Business Account</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Account number</dt>
                <dd className="text-gray-900 font-mono">63177960226</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Branch code</dt>
                <dd className="text-gray-900 font-mono">250655</dd>
              </div>
            </dl>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Contact & Support</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="font-medium text-gray-700">WhatsApp</dt>
                  <dd className="text-gray-900">
                    <a href="https://wa.me/27697574778" target="_blank" rel="noopener noreferrer" className="underline hover:text-black">
                      069 757 4778
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Email</dt>
                  <dd className="text-gray-900">
                    <a href="mailto:support@pikme.co.za" className="underline hover:text-black">
                      support@pikme.co.za
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Consent */}
          <section className="bg-white rounded-lg shadow-sm border p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4" {...register("consent_popia")} />
              <span className="text-sm text-gray-700">
                I have read and agree to the{" "}
                <a href="/privacy" className="underline text-black font-medium" target="_blank">
                  Privacy Notice
                </a>{" "}
                and consent to the processing of my personal information in accordance with POPIA. *
              </span>
            </label>
            {errors.consent_popia && (
              <p className="text-sm text-red-600 mt-2 ml-7">{errors.consent_popia.message}</p>
            )}
          </section>

          {/* Submit Button */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-lg bg-black text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? "Submitting…" : "Submit Application"}
            </button>

            {status && !success && (
              <div
                className={`p-4 rounded-lg ${
                  status.startsWith("Error")
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-blue-50 text-blue-800 border border-blue-200"
                }`}
              >
                {status}
              </div>
            )}
          </div>

          <p className="text-xs text-center text-gray-600">
            By submitting this form, you agree to receive email and WhatsApp updates about your
            onboarding status. For support, contact us on WhatsApp: 069 757 4778 or email: support@pikme.co.za.
            See our{" "}
            <a href="/paia.pdf" target="_blank" className="underline">
              PAIA manual
            </a>
            .
          </p>
        </form>

        <footer className="mt-12 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Pikme (Pty) Ltd. All rights reserved.
        </footer>
      </div>
    </main>
  );
}