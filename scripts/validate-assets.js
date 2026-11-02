const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

function read(relativePath) {
  return readFileSync(resolve(__dirname, '..', relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const openApi = read('openapi/taskboard.openapi.yaml');
assert(openApi.includes('openapi: 3.0.3'), 'OpenAPI version is missing.');
assert(openApi.includes('/api/tasks:'), 'Task collection endpoint is missing from OpenAPI.');
assert(openApi.includes('/api/tasks/{id}:'), 'Task item endpoint is missing from OpenAPI.');

const collection = JSON.parse(read('postman/Taskboard.postman_collection.json'));
assert(collection.info?.schema?.includes('collection/v2.1.0'), 'Postman collection schema is invalid.');
assert(Array.isArray(collection.item) && collection.item.length >= 2, 'Postman collection must contain at least two checks.');

const sql = read('sql/test-data.sql');
assert(sql.includes('CREATE TABLE tasks'), 'SQL fixture does not define the tasks table.');
assert(sql.includes('INSERT INTO tasks'), 'SQL fixture does not seed task data.');

console.log('Asset validation passed: OpenAPI, Postman collection, and SQL fixture are present and structurally valid.');
