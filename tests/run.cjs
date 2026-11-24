'use strict';
const assert=require('node:assert/strict');
const {once}=require('node:events');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const {createServer}=require('../bin/server.cjs');
async function run(file, url) {
  const child=spawn(process.execPath,[path.join(__dirname,file)],{
    stdio:'inherit', env:{...process.env,TEXTEDIT_TEST_URL:url}
  });
  const [code,signal]=await once(child,'exit');
  assert.equal(signal,null);
  assert.equal(code,0,file+' failed');
}
async function main() {
  const [engine,gui,mode]=process.argv.slice(2);
  if (!engine || !gui || (mode && mode!=='--http-only')) throw Error('expected engine and GUI asset directories');
  const server=createServer(engine,gui);
  server.listen(0,'127.0.0.1');
  await once(server,'listening');
  const url='http://127.0.0.1:'+server.address().port+'/';
  try {
    for(const [route,dir,file] of [['',gui,'editor.html'],['assets/textedit.js',engine,'textedit.js'],['assets/textedit-gui.js',gui,'textedit-gui.js'],['assets/start.js',gui,'start.js']]) {
      const response=await fetch(url+route);
      assert.equal(response.status,200);
      assert.equal(response.headers.get('cache-control'),'no-store');
      assert.deepEqual(Buffer.from(await response.arrayBuffer()),fs.readFileSync(path.join(dir,file)));
    }
    const head=await fetch(url+'assets/textedit.js',{method:'HEAD'});
    assert.equal(head.status,200); assert.equal(await head.text(),'');
    assert.equal((await fetch(url+'not-present')).status,404);
    assert.equal((await fetch(url+'%2e%2e%2fmodules-js.json')).status,404);
    assert.equal((await fetch(url,{method:'POST',body:'no'})).status,405);
    console.log('PASS: exact assets, no caching, no filesystem routing');
    if(mode!=='--http-only') for(const f of ["canonical-gui-browser.mjs","canonical-interaction-browser.mjs","canonical-advanced-browser.mjs","canonical-protected-browser.mjs","canonical-viewport-browser.mjs"]) await run(f,url);
  } finally { server.closeAllConnections(); await new Promise(resolve=>server.close(resolve)); }
}
main().catch(e=>{console.error(e);process.exitCode=1});
