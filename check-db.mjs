import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://jilvjnqnihseykwzvpzp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppbHZqbnFuaWhzZXlrd3p2cHpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODgzNDgsImV4cCI6MjA4MTA2NDM0OH0.0opKDN7FHfA--ROX0Bw9NRkls_JwbLXJKMIs37S4uyE'
);

// Get total counts by table
const tables = ['coaches', 'coaches_v2', 'hs_portal_one', 'schools'];

for (const table of tables) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (!error) {
    console.log(`${table}: ${count} rows`);
  }
}

// Get breakdown by division from main coaches table
const { data, error } = await supabase
  .from('hs_portal_one')
  .select('current_division')
  .limit(10000);

if (data) {
  const divisions = {};
  data.forEach(r => {
    const div = r.current_division || 'Unknown';
    divisions[div] = (divisions[div] || 0) + 1;
  });
  console.log('\nBy Division:');
  Object.entries(divisions).sort((a,b) => b[1] - a[1]).forEach(([div, count]) => {
    console.log(`  ${div}: ${count}`);
  });
}

// Sample columns
const { data: sample } = await supabase.from('hs_portal_one').select('*').limit(3);
if (sample && sample.length > 0) {
  console.log('\nColumns:', Object.keys(sample[0]).join(', '));
}

// Check email/twitter fill rates
const { data: allData } = await supabase.from('hs_portal_one').select('email, twitter, phone').limit(10000);
if (allData) {
  const hasEmail = allData.filter(r => r.email).length;
  const hasTwitter = allData.filter(r => r.twitter).length;
  const hasPhone = allData.filter(r => r.phone).length;
  console.log(`\nFill Rates (of ${allData.length}):`);
  console.log(`  Email: ${hasEmail} (${Math.round(hasEmail/allData.length*100)}%)`);
  console.log(`  Twitter: ${hasTwitter} (${Math.round(hasTwitter/allData.length*100)}%)`);
  console.log(`  Phone: ${hasPhone} (${Math.round(hasPhone/allData.length*100)}%)`);
}
