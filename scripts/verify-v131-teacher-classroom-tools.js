const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
function read(file){ return fs.readFileSync(path.join(root, file), 'utf8'); }
function assertIncludes(file, text){
  const body = read(file);
  if(!body.includes(text)){
    console.error(`Missing "${text}" in ${file}`);
    process.exit(1);
  }
}

const pkg = JSON.parse(read('package.json'));
if(!/^1\.(3[1-9]|[4-9][0-9])\./.test(pkg.version)){
  console.error(`Expected package version 1.31.0 or later preserving v1.31 tools, found ${pkg.version}`);
  process.exit(1);
}

assertIncludes('server.js', '/api/v131/teacher-classroom-tools');
assertIncludes('server.js', 'Agenda Builder');
assertIncludes('server.js', 'Privacy Visibility Switch');
assertIncludes('app.js', 'v131TeacherClassroomToolsSection');
assertIncludes('app.js', 'Live Correction Pad');
assertIncludes('app.js', 'AI Translation Risk Lens');
assertIncludes('app.js', 'SmartTeacher AI as teaching assistant');
assertIncludes('index.html', 'Built-in teacher classroom tools');
assertIncludes('README.md', 'v1.31.0');
assertIncludes('RELEASE_NOTES.md', 'v1.31.0');

console.log('v1.31 teacher classroom tools verification passed.');
