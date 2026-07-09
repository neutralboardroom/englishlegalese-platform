const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const requiredApp = [
  'v1.28.0 University Benchmark Pricing Pass',
  'v128UniversityBenchmarkSection',
  'v128PricingRecommendationSection',
  'v128CurriculumBenchmarkSection',
  'v128EmployerValueSection',
  'Major U.S. law-school and LL.M. programs can cost tens of thousands',
  'Legal English Foundations Cohort',
  'LL.M. / U.S. Law Readiness Sprint',
  'AI Translator Safety Lab'
];

const requiredServer = [
  '/api/v128/benchmark-pricing',
  'v128BenchmarkPricingSeed',
  '$29–$49/month',
  '$995–$1,995'
];

const missing = [];
for (const token of requiredApp) if (!app.includes(token)) missing.push(`app.js missing ${token}`);
for (const token of requiredServer) if (!server.includes(token)) missing.push(`server.js missing ${token}`);
if (!/^1\.(28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54)\.0$/.test(pkg.version)) missing.push(`package version expected 1.28.0 or later compatible build, got ${pkg.version}`);
if (/sk_live_|pk_live_|whsec_live_/i.test(app + server)) missing.push('possible live secret pattern found');
if (/DROP TABLE|TRUNCATE TABLE|DELETE FROM/i.test(fs.readFileSync(path.join(root, 'db/migrations/008_ai_era_operating_flow.sql'), 'utf8'))) missing.push('unexpected destructive SQL keyword found in existing v1.25 migration');

if (missing.length) {
  console.error('v1.28 benchmark pricing verification failed:');
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log('v1.28 benchmark pricing verification passed.');
