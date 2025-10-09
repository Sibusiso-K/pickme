import { NextResponse } from 'next/server';
import { sbAdmin } from '@/lib/supabaseServer';
import { Resend } from 'resend';

export async function POST(req: Request) {
  const payload = await req.json();

  // Basic required checks
  const required = [
    'full_name',
    'email',
    'phone',
    'role',
    'vin',
    'number_plate',
    'has_insurance',
    'consent_popia',
  ];
  for (const k of required) {
    if (payload[k] === undefined || payload[k] === null) {
      return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
    }
  }
  if (payload.consent_popia !== true) {
    return NextResponse.json({ error: 'Consent required' }, { status: 400 });
  }

  const sb = sbAdmin();

  // Insert driver
  const { data: driver, error: dErr } = await sb
    .from('drivers')
    .insert({
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      vin: payload.vin,
      number_plate: payload.number_plate,
      has_insurance: payload.has_insurance,
      insurer: payload.insurer ?? null,
      monthly_premium: payload.monthly_premium ?? null,
      join_invest_program: payload.join_invest_program ?? false,
      investment_tier: payload.investment_tier ?? 'none',
      consent_popia: true,
    })
    .select('id')
    .single();

  if (dErr) return NextResponse.json({ error: dErr.message }, { status: 400 });

  // Insert doc paths
  if (Array.isArray(payload.docs) && payload.docs.length) {
    const rows = payload.docs.map((d: any) => ({
      driver_id: driver.id,
      type: d.type,
      file_path: d.file_path,
    }));
    const { error: docErr } = await sb.from('driver_docs').insert(rows);
    if (docErr)
      return NextResponse.json({ error: docErr.message }, { status: 400 });
  }

  // Send confirmation email
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Pickme <noreply@pikme.co.za>',
      to: payload.email,
      subject: 'Pick Me onboarding received',
      text: `Hi ${payload.full_name},

We received your onboarding submission. We will review your documents and contact you by email/WhatsApp within 3-5 business days.

Reference: ${driver.id}

Pick Me`,
    });
  } catch {
    // Non-blocking. Continue even if email fails.
  }

  return NextResponse.json({ ok: true, id: driver.id });
}
