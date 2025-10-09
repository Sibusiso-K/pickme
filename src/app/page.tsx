// app/page.tsx
"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const Schema = z
  .object({
    full_name: z.string().min(2, "Required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Required"),
    role: z.enum(["owner", "driver", "both"]),
    vin: z.string().min(5, "Required"),
    number_plate: z.string().min(2, "Required"),
    insurer: z.string().optional(),
    monthly_premium: z.coerce.number().positive("Must be a positive number").optional(),
    join_invest_program: z.enum(["yes", "no"]),
    investment_tier: z.enum(["tier1", "tier2", "tier3"]).optional(),
    consent_popia: z.boolean().refine((v) => v === true, { message: "Required" }),
  })
  .superRefine((val, ctx) => {
    if (val.join_invest_program === "no" && val.investment_tier) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tier must be blank if not investing",
        path: ["investment_tier"],
      });
    }
  });

type FormValues = z.infer<typeof Schema>;

export default function Page() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema) as Resolver<FormValues>,
    defaultValues: {
      role: "driver",
      join_invest_program: "no",
      consent_popia: false,
      monthly_premium: undefined,
    },
  });

  const joinInvest = watch("join_invest_program");
  const chosenTier = watch("investment_tier");

  useEffect(() => {
    if (joinInvest === "no" && chosenTier) resetField("investment_tier");
  }, [joinInvest, chosenTier, resetField]);

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    alert("Submitted");
  };

  const setTier = (tier: "tier1" | "tier2" | "tier3") => {
    setValue("investment_tier", chosenTier === tier ? undefined : tier, {
      shouldValidate: true,
    });
  };

  return (
    <main className="min-h-screen">
      {/* Hero with logo only */}
      <header className="relative">
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="h-64 w-full bg-center bg-cover"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1600&auto=format&fit=crop)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/pikme-logo.png"
            alt="Pikme (Pty) Ltd"
            className="h-20 w-auto drop-shadow"
            height={80}
          />
          <span className="sr-only">Pikme (Pty) Ltd — Driver Onboarding</span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Contact and vehicle */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Full name</label>
              <input className="mt-1 w-full rounded-md border p-2" {...register("full_name")} />
              {errors.full_name && <p className="text-sm text-red-600">{errors.full_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input className="mt-1 w-full rounded-md border p-2" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input className="mt-1 w-full rounded-md border p-2" inputMode="tel" {...register("phone")} />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select className="mt-1 w-full rounded-md border p-2" {...register("role")}>
                <option value="owner">Owner</option>
                <option value="driver">Driver</option>
                <option value="both">Both</option>
              </select>
              {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">VIN</label>
              <input className="mt-1 w-full rounded-md border p-2" {...register("vin")} />
              {errors.vin && <p className="text-sm text-red-600">{errors.vin.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Number plate</label>
              <input className="mt-1 w-full rounded-md border p-2" {...register("number_plate")} />
              {errors.number_plate && <p className="text-sm text-red-600">{errors.number_plate.message}</p>}
            </div>
          </section>

          {/* Insurance */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Insurer (optional)</label>
              <input className="mt-1 w-full rounded-md border p-2" placeholder="e.g. Outsurance" {...register("insurer")} />
            </div>
            <div>
              <label className="block text-sm font-medium">
                (Optional) What is the premium you are paying for insurance?
              </label>
              <input
                className="mt-1 w-full rounded-md border p-2"
                type="number"
                step="0.01"
                placeholder="Amount in ZAR"
                {...register("monthly_premium")}
              />
              {errors.monthly_premium && (
                <p className="text-sm text-red-600">{errors.monthly_premium.message as string}</p>
              )}
            </div>
          </section>

          {/* Investment program */}
          <section className="space-y-3">
            <p className="text-sm font-medium">
              Are you going to invest in the Pikme driver transition program? <span className="font-normal">(Yes or no answer)</span>
            </p>
            <div className="flex gap-6">
              <label className="inline-flex items-center gap-2">
                <input type="radio" value="yes" {...register("join_invest_program")} />
                <span>Yes</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" value="no" {...register("join_invest_program")} />
                <span>No</span>
              </label>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Which tier? <span className="font-normal">(Tick box or leave blank if answered “no”)</span>
              </p>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                <label className="inline-flex items-center gap-2 rounded-md border p-2">
                  <input type="checkbox" checked={chosenTier === "tier1"} onChange={() => setTier("tier1")} />
                  <span>Tier 1 = + 10% savings</span>
                </label>
                <label className="inline-flex items-center gap-2 rounded-md border p-2">
                  <input type="checkbox" checked={chosenTier === "tier2"} onChange={() => setTier("tier2")} />
                  <span>Tier 2 = + 20% savings</span>
                </label>
                <label className="inline-flex items-center gap-2 rounded-md border p-2">
                  <input type="checkbox" checked={chosenTier === "tier3"} onChange={() => setTier("tier3")} />
                  <span>Tier 3 = + 30% savings</span>
                </label>
              </div>
            </div>

            <div className="rounded-md border p-3 text-sm">
              <p>For more information, please contact us on WhatsApp or email.</p>
              <p>Additionally, please send proof of payment to WhatsApp or email support.</p>
            </div>
          </section>

          {/* Consent */}
          <section className="space-y-2">
            <label className="inline-flex items-start gap-3">
              <input type="checkbox" {...register("consent_popia")} />
              <span className="text-sm">
                Did you read the privacy notice and agree to the T&apos;s &amp; C&apos;s? See our{" "}
                <a href="/privacy" className="underline">Privacy Notice</a>.
              </span>
            </label>
            {errors.consent_popia && <p className="text-sm text-red-600">{errors.consent_popia.message}</p>}
          </section>

          {/* Banking details */}
          <section className="rounded-lg border p-4">
            <h2 className="text-base font-semibold">Company banking details</h2>
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-70"
              aria-live="polite"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Pikme (Pty) Ltd. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
