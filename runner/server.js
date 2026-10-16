const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const PORT = 3000;
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(__dirname, 'public');
const APP_JAVA_PATH = path.join(ROOT_DIR, 'app.java');

const JRE_BIN = 'C:\\Users\\feras\\.antigravity-ide\\extensions\\redhat.java-1.57.0-win32-arm64\\jre\\25.0.4.1-win32-aarch64\\bin';
const JAVAC = path.join(JRE_BIN, 'javac.exe');
const JAVA = path.join(JRE_BIN, 'java.exe');
const JAR = path.join(JRE_BIN, 'jar.exe');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.class': 'application/java-vm',
  '.jar': 'application/java-archive',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

function compileAndPackage(sourceCode, callback) {
  if (sourceCode) {
    fs.writeFileSync(APP_JAVA_PATH, sourceCode, 'utf8');
  }

  const javacArgs = ['--release', '8', '-d', PUBLIC_DIR, APP_JAVA_PATH];
  execFile(JAVAC, javacArgs, { cwd: ROOT_DIR }, (compileErr, compileStdout, compileStderr) => {
    if (compileErr) {
      return callback({
        success: false,
        error: compileStderr || compileErr.message,
        stdout: compileStdout
      });
    }

    // Package into app.jar for CheerpJ applet support
    const jarArgs = ['cfe', path.join(PUBLIC_DIR, 'app.jar'), 'app', '-C', PUBLIC_DIR, 'app.class'];
    execFile(JAR, jarArgs, { cwd: ROOT_DIR }, () => {
      const startTime = Date.now();
      const javaArgs = ['-cp', PUBLIC_DIR, 'app'];
      execFile(JAVA, javaArgs, { cwd: ROOT_DIR }, (runErr, runStdout, runStderr) => {
        const durationMs = Date.now() - startTime;
        callback({
          success: !runErr,
          stdout: runStdout || '',
          stderr: runStderr || (runErr ? runErr.message : ''),
          durationMs
        });
      });
    });
  });
}

const server = http.createServer((req, res) => {
  // CORS headers for CheerpJ and cross-origin isolation
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = parsedUrl.pathname;

  if (pathname === '/api/source' && req.method === 'GET') {
    try {
      const content = fs.readFileSync(APP_JAVA_PATH, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ source: content }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  if (pathname === '/api/run' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let source = null;
      try {
        if (body) {
          const parsed = JSON.parse(body);
          if (parsed.source) source = parsed.source;
        }
      } catch (e) {}

      compileAndPackage(source, (result) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      });
    });
    return;
  }

  // Serve static files
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, pathname);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Access Denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end(`404 Not Found: ${pathname}`);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Java Browser Runner active on http://localhost:${PORT}/`);
});
