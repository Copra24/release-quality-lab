const SwaggerParser = require('@apidevtools/swagger-parser');
const { resolve } = require('node:path');

async function validate() {
  const contractPath = resolve('openapi/taskboard.openapi.yaml');
  const contract = await SwaggerParser.validate(contractPath);
  console.log(`OpenAPI contract is valid: ${contract.info.title} v${contract.info.version}`);
}

validate().catch((error) => {
  console.error('OpenAPI contract validation failed.');
  console.error(error);
  process.exitCode = 1;
});
