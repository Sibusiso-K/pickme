// app/api/submit/route.ts
import { NextResponse } from "next/server";
import { sbAdmin } from "@/lib/supabaseServer";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Basic required checks
    const required = [
      "full_name",
      "email",
      "phone",
      "regional_work_location",
      "role",
      "vin",
      "number_plate",
      "has_insurance",
      "join_invest_program",
      "consent_popia",
    ];

    for (const k of required) {
      if (payload[k] === undefined || payload[k] === null) {
        return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
      }
    }

    if (payload.consent_popia !== true) {
      return NextResponse.json({ error: "Consent required" }, { status: 400 });
    }

    const sb = sbAdmin();

    // Convert join_invest_program from "yes"/"no" to boolean
    const joinInvestBoolean = payload.join_invest_program === "yes";

    // Insert driver
    const { data: driver, error: dErr } = await sb
      .from("drivers")
      .insert({
        full_name: payload.full_name,
        email: payload.email,
        phone: payload.phone,
        regional_work_location: payload.regional_work_location,
        role: payload.role,
        vin: payload.vin,
        number_plate: payload.number_plate,
        has_insurance: payload.has_insurance,
        insurer: payload.insurer ?? null,
        monthly_premium: payload.monthly_premium ?? null,
        join_invest_program: joinInvestBoolean,
        investment_tier:
          payload.investment_tier && payload.investment_tier !== "none"
            ? payload.investment_tier
            : null,
        consent_popia: true,
      })
      .select("id")
      .single();

    if (dErr) {
      console.error("Database insert error:", dErr);
      return NextResponse.json({ error: dErr.message }, { status: 400 });
    }

    // Insert doc paths
    if (Array.isArray(payload.docs) && payload.docs.length) {
      const rows = payload.docs.map((d: any) => ({
        driver_id: driver.id,
        type: d.type,
        file_path: d.file_path,
      }));
      const { error: docErr } = await sb.from("driver_docs").insert(rows);
      if (docErr) {
        console.error("Document insert error:", docErr);
        return NextResponse.json({ error: docErr.message }, { status: 400 });
      }
    }

    // Send confirmation email
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Pikme <noreply@pikme.co.za>",
        to: payload.email,
        subject: "Pikme Onboarding - Application Received",
        text: `Hi ${payload.full_name},

Thank you for submitting your driver onboarding application to Pikme!

We have received your documents and information. Our team will review your submission and contact you via email and WhatsApp within 3-5 business days.

Application Reference: ${driver.id}
Regional Work Location: ${payload.regional_work_location}

If you opted to join our investment program, please send your proof of payment to our WhatsApp support line or email.

Banking Details:
Bank: FNB/RMB
Account Holder: Pikme (Pty) Ltd
Account Type: Gold Business Account
Account Number: 63177960226
Branch Code: 250655

Thank you for choosing Pikme!

Best regards,
The Pikme Team`,
      });
    } catch (emailError) {
      console.error("Email send error:", emailError);
      // Non-blocking. Continue even if email fails.
    }

    return NextResponse.json({ ok: true, id: driver.id });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
