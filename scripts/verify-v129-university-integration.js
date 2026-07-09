const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = {
  package: fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
  app: fs.readFileSync(path.join(root, 'app.js'), 'utf8'),
  server: fs.readFileSync(path.join(root, 'server.js'), 'utf8'),
  readme: fs.existsSync(path.join(root, 'README.md')) ? fs.readFileSync(path.join(root, 'README.md'), 'utf8') : '',
  release: fs.existsSync(path.join(root, 'RELEASE_NOTES.md')) ? fs.readFileSync(path.join(root, 'RELEASE_NOTES.md'), 'utf8') : ''
};

const checks = [
  ['package version is 1.29.0 or later compatible build', /"version"\s*:\s*"1\.(29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54)\.0"/.test(files.package)],
  ['app version label updated', files.app.includes('v1.29.0 University Benchmark Integration + Course Catalog')],
  ['benchmark integration section added', files.app.includes('v129BenchmarkIntegrationSection')],
  ['offer ladder section added', files.app.includes('v129OfferLadderSection')],
  ['course catalog section added', files.app.includes('v129CourseCatalogSection')],
  ['employer ROI math section added', files.app.includes('v129EmployerRoiMathSection')],
  ['teacher marketing scripts section added', files.app.includes('v129TeacherMarketingScriptsSection')],
  ['buyer FAQ section added', files.app.includes('v129BuyerFaqSection')],
  ['SmartTeacher university answer added', files.app.includes('Use universities as credibility benchmarks')],
  ['v129 server endpoint preserved', files.server.includes('/api/v129/university-benchmark-integration')],
  ['v129 API endpoint exists', files.server.includes('/api/v129/university-benchmark-integration')],
  ['course catalog includes AI Translator Safety Lab', files.app.includes('AI Translator Safety Lab') && files.server.includes('AI Translator Safety Lab')],
  ['Columbia treated as benchmark without unsupported standalone Legal English price', files.app.includes('avoid quoting a precise Legal English price') || files.server.includes('do not quote unverified standalone Legal English price')],
  ['release notes preserve v1.29.0 history or later release note', files.release.includes('v1.29.0') || files.release.includes('v1.30.0')],
  ['readme preserves v1.29.0 history or later readme', files.readme.includes('v1.29.0') || files.readme.includes('v1.30.0')]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  console.error('v1.29 verification failed:');
  failed.forEach(([name]) => console.error(`- ${name}`));
  process.exit(1);
}
console.log('v1.29 university benchmark integration verification passed.');
