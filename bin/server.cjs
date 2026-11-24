'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

function loadAssets(engineRoot, guiRoot) {
  const read = (root, name) => fs.readFileSync(path.join(root, name));
  return new Map([
    ['/', ['text/html; charset=utf-8', read(guiRoot, 'editor.html')]],
    ['/assets/textedit.js', ['text/javascript; charset=utf-8', read(engineRoot, 'textedit.js')]],
    ['/assets/textedit-gui.js', ['text/javascript; charset=utf-8', read(guiRoot, 'textedit-gui.js')]],
    ['/assets/start.js', ['text/javascript; charset=utf-8', read(guiRoot, 'start.js')]]
  ]);
}
function createServer(engineRoot, guiRoot) {
  const assets = loadAssets(engineRoot, guiRoot);
  return http.createServer((req, res) => {
    const headers = {
      'Cache-Control':'no-store',
      'X-Content-Type-Options':'nosniff',
      'Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'"
    };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, {...headers, Allow:'GET, HEAD'}); res.end(); return;
    }
    // Exact, fixed routes only: never interpret URL text as a filesystem path.
    const asset = assets.get(req.url);
    if (!asset) { res.writeHead(404, headers); res.end(); return; }
    res.writeHead(200, {...headers, 'Content-Type':asset[0], 'Content-Length':asset[1].length});
    res.end(req.method === 'HEAD' ? undefined : asset[1]);
  });
}
function main(args) {
  if (args.length < 2 || args.length > 3) {
    throw Error('usage: node bin/server.cjs <engine-asset-dir> <gui-asset-dir> [port|--check]');
  }
  if (args[2] === '--check') { loadAssets(args[0], args[1]); return; }
  const port = Number(args[2] ?? process.env.TEXTEDIT_PORT ?? 8765);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw Error('invalid port');
  const server = createServer(args[0], args[1]);
  server.on('error', error => { console.error(error.message); process.exitCode=1; });
  server.listen(port, '127.0.0.1', () => console.log('TextEdit: http://127.0.0.1:'+port+'/'));
}
module.exports = {createServer,loadAssets};
if (require.main === module) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode=1; }
}
