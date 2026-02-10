import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jilvjnqnihseykwzvpzp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read and parse CSV
const csvData = readFileSync('./coaches_enriched_with_paid.csv', 'utf-8');
const records = parse(csvData, { columns: true, skip_empty_lines: true });

console.log(`Loaded ${records.length} records from CSV`);

// Filter to only records with enriched data
const enrichedRecords = records.filter(r =>
  r.paid_Conference || r.paid_twitter || r.paid_email || r.paid_phone
);

console.log(`${enrichedRecords.length} records have enriched data`);

// Process in batches of 100
const BATCH_SIZE = 100;
let updated = 0;
let errors = 0;

for (let i = 0; i < enrichedRecords.length; i += BATCH_SIZE) {
  const batch = enrichedRecords.slice(i, i + BATCH_SIZE);

  for (const record of batch) {
    const updates = {};

    // Only update twitter if current is empty and paid has value
    if (record.paid_twitter && record.paid_twitter !== '-' && !record.twitter) {
      updates.twitter = record.paid_twitter;
    }

    // Only update email if current is empty and paid has value
    if (record.paid_email && !record.email) {
      updates.email = record.paid_email;
    }

    // Only update phone if current is empty and paid has value
    if (record.paid_phone && !record.office_phone) {
      updates.office_phone = record.paid_phone;
    }

    // Add school-level enrichment data (new columns)
    if (record.paid_City) updates.city = record.paid_City;
    if (record.paid_Region) updates.region = record.paid_Region;
    if (record.paid_Average_GPA) updates.school_gpa = record.paid_Average_GPA;
    if (record.paid_ACT_composite) updates.school_act = record.paid_ACT_composite;
    if (record.paid_Acceptance_rate) updates.acceptance_rate = record.paid_Acceptance_rate;
    if (record.paid_Yearly_cost) updates.yearly_cost = record.paid_Yearly_cost;
    if (record.paid_Questionnaire) updates.questionnaire_link = record.paid_Questionnaire;
    if (record.paid_Twitter_team) updates.team_twitter = record.paid_Twitter_team;
    if (record.paid_Instagram_team) updates.team_instagram = record.paid_Instagram_team;
    if (record.paid_Private_Public) updates.school_type = record.paid_Private_Public;
    if (record.paid_Undergrads) updates.undergrads = parseFloat(record.paid_Undergrads) || null;

    // Skip if nothing to update
    if (Object.keys(updates).length === 0) continue;

    updates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', record.id);

    if (error) {
      console.error(`Error updating ${record.id}: ${error.message}`);
      errors++;
    } else {
      updated++;
    }
  }

  console.log(`Processed ${Math.min(i + BATCH_SIZE, enrichedRecords.length)}/${enrichedRecords.length}`);
}

console.log(`\nComplete! Updated: ${updated}, Errors: ${errors}`);
