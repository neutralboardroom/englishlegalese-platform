const http = require('http');

const PORT = process.env.PORT || 3000;
const host = process.env.VERIFY_HOST || '127.0.0.1';

function request(path, method='GET', body=null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({ host, port: PORT, path, method, headers: data ? {'content-type':'application/json','content-length':Buffer.byteLength(data)} : {} }, res => {
      let chunks = '';
      res.on('data', c => chunks += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, json: JSON.parse(chunks) }); }
        catch (error) { resolve({ status: res.statusCode, text: chunks }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main(){
  const health = await request('/health');
  if (!health.json || health.json.ok !== true) throw new Error('Health endpoint failed');
  const strategy = await request('/api/v124/ai-era-strategy');
  if (!strategy.json || strategy.json.ok !== true) throw new Error('AI-era strategy endpoint failed');
  const moduleCreate = await request('/api/v124/curriculum-modules', 'POST', {
    track: 'AI Translator Safety for Legal and Business English',
    module_title: 'Spot the risky AI translation',
    audience: 'students_teachers_employers'
  });
  if (moduleCreate.status !== 201 || !moduleCreate.json?.ok) throw new Error('Curriculum module create failed');
  const exerciseCreate = await request('/api/v124/ai-translator-safety-exercises', 'POST', {
    exercise_type: 'confidentiality_check',
    title: 'Should this text be uploaded to AI?',
    prompt_text: 'Decide whether the sample is safe, should be anonymized, or needs professional/employer permission.'
  });
  if (exerciseCreate.status !== 201 || !exerciseCreate.json?.ok) throw new Error('AI translator safety exercise create failed');
  const signalCreate = await request('/api/v124/dashboard-signals', 'POST', {
    role: 'employer',
    signal_name: 'AI translation safety progress',
    signal_value: 'visible as employer-safe summary only',
    next_action: 'Schedule group class on AI translator safety.'
  });
  if (signalCreate.status !== 201 || !signalCreate.json?.ok) throw new Error('Dashboard signal create failed');
  const assetCreate = await request('/api/v124/ai-era-marketing-assets', 'POST', {
    asset_type: 'teacher_linkedin_post',
    audience: 'professional_network',
    title: 'AI can translate words, but professionals still need Legal English confidence',
    approved_copy: 'AI can translate words. EnglishLegalese helps professionals build judgment, tone, context, and confidence.'
  });
  if (assetCreate.status !== 201 || !assetCreate.json?.ok) throw new Error('Marketing asset create failed');
  console.log('v1.24 AI-era operations verification passed');
}

main().catch(error => { console.error(error.message); process.exit(1); });
