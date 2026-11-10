const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const files=fs.readdirSync('.').filter(f=>f.endsWith('.html'));
assert.equal(files.length,12);
let links=0;
for(const file of files){const html=fs.readFileSync(file,'utf8');assert.ok(html.includes('<html lang="vi">'));assert.ok(html.includes('name="viewport"'));assert.equal((html.match(/<h1>/g)||[]).length,1);for(const m of html.matchAll(/href="([^"]+)"/g)){if(m[1].startsWith('#'))continue;assert.ok(fs.existsSync(decodeURIComponent(m[1])),`${file}: missing ${m[1]}`);links++;}}
const sources=fs.readdirSync('Reflections').filter(f=>f.endsWith('.md')).sort();
const pages=['bao-tran','tra-my','quynh-nhu','bao-chau','diem-quynh'];
for(const [i,file] of sources.entries()){
 const source=fs.readFileSync(path.join('Reflections',file),'utf8');
 assert.equal(source,fs.readFileSync(path.join('Business-plan.md','Thành Viên',file),'utf8'),'Duplicate source differs');
 const html=fs.readFileSync(pages[i]+'.html','utf8');
 assert.ok(html.includes(encodeURIComponent(file)));
 const name=source.match(/Họ và tên:\s*(.+)/)[1];assert.ok(html.includes(name));
 for(const other of sources.filter(f=>f!==file)){const n=fs.readFileSync(path.join('Reflections',other),'utf8').match(/Họ và tên:\s*(.+)/)[1];assert.ok(!html.includes(n),'Mixed authors');}
 const strip=s=>s.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/\s+/g,'');
 const body=html.match(/<article class="card prose">([\s\S]*?)<\/article>/)[1];
 const normalized=source.replace(/^# \d+\s*\r?\n/m,'').replace(/^#+ /gm,'').replace(/^- /gm,'').replace(/\*/g,'').replace(/\s+/g,'');
 assert.equal(strip(body),normalized,'Reflection text changed');
}
assert.equal((fs.readFileSync('five-forces.html','utf8').match(/class="force-number"/g)||[]).length,5);
console.log(`PASS: ${files.length} pages, ${links} local links, 5 complete unmixed reflections, 5 Porter cards; duplicate Markdown sources match.`);
