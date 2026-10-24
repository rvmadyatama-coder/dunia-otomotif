const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const errors = [], warnings = [];
const htmlFiles=[];
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','.git'].includes(ent.name))continue;const p=path.join(dir,ent.name);if(ent.isDirectory())walk(p);else if(/\.html$/i.test(ent.name))htmlFiles.push(p)}}
walk(root);
for(const file of htmlFiles){const s=fs.readFileSync(file,'utf8');const rel=path.relative(root,file).replace(/\\/g,'/');
 if(!/<html\b[^>]*lang="id"/i.test(s))errors.push(`${rel}: atribut bahasa id tidak ada`);
 if(!/<meta\b[^>]*charset=["\']utf-8["\'][^>]*>/i.test(s))errors.push(`${rel}: charset UTF-8 tidak ada`);
 if(!/<title>[^<]+<\/title>/i.test(s))errors.push(`${rel}: title tidak ada/kosong`);
 const canonicalMatches=[...s.matchAll(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi)]; const canonicalHref=canonicalMatches.length===1?(canonicalMatches[0][0].match(/\bhref=["']([^"']+)["']/i)||[])[1]:null; const expectedCanonical="https://otomotif.rivodaexhaust.id/"+(rel==="index.html"?"":rel); if(canonicalMatches.length!==1||canonicalHref!==expectedCanonical)errors.push(`${rel}: canonical harus tepat satu dan cocok dengan ${expectedCanonical}`);
 if(!/<meta\b(?=[^>]*\bname=["\']description["\'])(?=[^>]*\bcontent=["\'][^"\']+)[^>]*>/i.test(s))errors.push(`${rel}: meta description tidak ada`);
 if(!/<h1\b/i.test(s))errors.push(`${rel}: H1 tidak ditemukan`);
 if(/â€™|â€œ|â€|Ã¢|Â©/.test(s))errors.push(`${rel}: pola mojibake terdeteksi`);
 for(const m of s.matchAll(/(?:href|src)="([^"]+)"/g)){const target=m[1];if(/^(https?:|mailto:|tel:|#|data:|\/\/)/i.test(target))continue;const clean=decodeURIComponent(target.split(/[?#]/)[0]);if(!clean)continue;const resolved=path.resolve(path.dirname(file),clean);if(!resolved.startsWith(root+path.sep)&&resolved!==root){errors.push(`${rel}: path keluar dari root ${target}`);continue}if(!fs.existsSync(resolved))errors.push(`${rel}: target lokal hilang ${target}`)}
 if(/<img\b/i.test(s)&&/<img\b(?![^>]*\balt=)[^>]*>/i.test(s))errors.push(`${rel}: gambar tanpa alt`);
}
const articleFiles=fs.readdirSync(path.join(root,'artikel')).filter(x=>x.endsWith('.html'));
for(const name of articleFiles){const a=fs.readFileSync(path.join(root,'artikel',name),'utf8');if(!/Rujukan untuk verifikasi/i.test(a))warnings.push(`artikel/${name}: bagian rujukan belum tersedia`)}
if(articleFiles.length<5)errors.push('Artikel statis kurang dari 5');
// Pastikan sitemap dan robots.txt mengarah ke domain HTTPS yang sama.
const sitemapPath=path.join(root,'sitemap.xml');
const robotsPath=path.join(root,'robots.txt');
if(!fs.existsSync(sitemapPath))errors.push('sitemap.xml tidak ditemukan');
if(!fs.existsSync(robotsPath))errors.push('robots.txt tidak ditemukan');
if(fs.existsSync(sitemapPath)&&fs.existsSync(robotsPath)){
 const sitemap=fs.readFileSync(sitemapPath,'utf8');
 const robots=fs.readFileSync(robotsPath,'utf8');
 const locs=[...sitemap.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)].map(m=>m[1]);
 const domains=[...new Set(locs.map(u=>{try{return new URL(u).origin}catch{return 'INVALID_URL'}}))];
 if(!sitemap.includes('<urlset')||!sitemap.includes('</urlset>'))errors.push('sitemap.xml tidak memiliki struktur urlset XML');
 if(!locs.length)errors.push('sitemap.xml tidak memiliki URL HTTPS');
 if(locs.some(u=>!/^https:\/\//i.test(u)))errors.push('Sitemap memuat URL non-HTTPS');
 if(domains.length>1)errors.push('Sitemap memuat lebih dari satu domain');
 const sm=robots.match(/^Sitemap:\s*(\S+)\s*$/im);
 if(!sm)errors.push('robots.txt tidak menunjuk sitemap');
 else if(sm[1]!==new URL(sitemapPath.startsWith(root)?(locs[0]||'https://invalid.local/'): 'https://invalid.local/').origin+'/sitemap.xml' && locs.length){
   const expected=new URL(locs[0]).origin+'/sitemap.xml';
   if(sm[1]!==expected)errors.push(`robots.txt sitemap tidak cocok: ${sm[1]} (seharusnya ${expected})`);
 }
}
const contact=fs.readFileSync(path.join(root,'kontak.html'),'utf8');
if(/alamat email yang belum diverifikasi|Kanal kontak publik akan dicantumkan/i.test(contact))console.log('INFO: alamat email tidak direka; kanal kontak resmi dapat ditambahkan setelah diverifikasi.');
const forbidden=['server.js','admin.html','data/articles.json'];for(const f of forbidden){if(fs.existsSync(path.join(root,f)))warnings.push(`${f} masih ada; situs statis tidak memerlukannya`)}
console.log(`HTML diperiksa: ${htmlFiles.length}`);console.log(`Artikel statis: ${articleFiles.length}`);console.log(`ERROR: ${errors.length}`);console.log(`WARNING: ${warnings.length}`);for(const e of errors)console.error('ERROR '+e);for(const w of warnings)console.warn('WARNING '+w);if(errors.length)process.exit(1);console.log('PASS: pemeriksaan struktur, metadata, encoding, dan target lokal.');
