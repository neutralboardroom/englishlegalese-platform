const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
function read(file){ return fs.readFileSync(path.join(root, file), 'utf8'); }
function assert(condition, message){ if(!condition){ throw new Error(message); } }
const pkg = require(path.join(root, 'package.json'));
const app = read('app.js');
const index = read('index.html');
const server = read('server.js');
const release = read('RELEASE_NOTES.md');
const handoff = read('CUSTOM_DOMAIN_HANDOFF.md');
assert(pkg.version === '1.54.2', 'package version must be 1.54.2');
assert(app.includes('legacyAnchorMap'), 'app.js must include legacyAnchorMap');
['v154-public-launch-readiness','v153-role-clarity-continuity','v150-language-learning-bridge','v146-live-skills-feedback','v143-course-placement','v131-teacher-classroom-tools','trust-center','student-intake','firm-intake','teacher-apply'].forEach(anchor => {
  assert(app.includes(`'${anchor}'`), `legacy anchor not mapped: ${anchor}`);
});
['id="home"','id="start"','id="language-bridge"','id="skills"','id="courses"','id="smartteacher"','id="teachers"','id="launch"','id="trust"'].forEach(id => {
  assert(app.includes(id), `canonical public section missing in app.js: ${id}`);
});
['#launch','#start','#language-bridge','#skills','#courses','#smartteacher','#teachers','#employers','#trust','#dashboards'].forEach(hash => {
  assert(index.includes(`href="${hash}"`), `canonical navigation target missing: ${hash}`);
});
['/api/v154/public-launch-readiness','/api/v153/role-clarity-continuity-pass','/api/v152/three-layer-language-strategy','/api/v151/page-language-selector','/api/v150/language-learning-bridge','/api/v146/live-skills-feedback-loop','/api/v145/integrated-skills-studio','/api/v144/four-skills-academy','/api/v143/course-placement-system','/api/v134/calendar/session.ics','/api/v132/chatgpt-only-smartteacher','/api/v131/teacher-classroom-tools'].forEach(route => {
  assert(server.includes(route), `preserved route marker missing: ${route}`);
});
assert(server.includes('v1.54.2 hardens public launch navigation'), 'health feature must mention v1.54.2');
assert(release.includes('No migrations were added'), 'release notes must confirm no migrations');
assert(release.includes('No live credentials or secrets were added'), 'release notes must confirm no secrets');
assert(handoff.includes('do not remove Hover forwarding until Render'), 'domain handoff must preserve Hover forwarding warning');
assert(handoff.includes('englishlegalese.com') && handoff.includes('www.englishlegalese.com'), 'domain handoff must include both custom domains');
console.log('v1.54.2 navigation/domain hardening verifier passed.');
