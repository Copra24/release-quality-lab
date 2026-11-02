const http = require('node:http');
const { readFile } = require('node:fs/promises');
const { join } = require('node:path');

const port = Number(process.env.PORT || 4173);
let nextId = 3;
let tasks = [
  { id: 1, title: 'Review acceptance criteria', completed: false },
  { id: 2, title: 'Prepare release evidence', completed: true }
];

function sendJson(response, status, payload) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

async function readBody(request) {
  let body = '';
  for await (const chunk of request) body += chunk;
  return body ? JSON.parse(body) : {};
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === 'GET' && url.pathname === '/health') {
    return sendJson(response, 200, { status: 'ok' });
  }

  if (request.method === 'GET' && url.pathname === '/api/tasks') {
    return sendJson(response, 200, { tasks });
  }

  if (request.method === 'POST' && url.pathname === '/api/tasks') {
    const body = await readBody(request);
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return sendJson(response, 400, { error: 'title is required' });
    }
    const task = { id: nextId++, title: body.title.trim(), completed: false };
    tasks.push(task);
    return sendJson(response, 201, { task });
  }

  const match = url.pathname.match(/^\/api\/tasks\/(\d+)$/);
  if (match && request.method === 'PATCH') {
    const task = tasks.find((item) => item.id === Number(match[1]));
    if (!task) return sendJson(response, 404, { error: 'task not found' });
    const body = await readBody(request);
    if (typeof body.completed !== 'boolean') {
      return sendJson(response, 400, { error: 'completed must be boolean' });
    }
    task.completed = body.completed;
    return sendJson(response, 200, { task });
  }

  if (match && request.method === 'DELETE') {
    const index = tasks.findIndex((item) => item.id === Number(match[1]));
    if (index < 0) return sendJson(response, 404, { error: 'task not found' });
    tasks.splice(index, 1);
    return response.writeHead(204).end();
  }

  if (request.method === 'GET' && url.pathname === '/') {
    const html = await readFile(join(__dirname, 'index.html'));
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return response.end(html);
  }

  return sendJson(response, 404, { error: 'not found' });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Taskboard demo listening on http://127.0.0.1:${port}`);
});
