const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const resultPath = process.env.PLAYWRIGHT_RESULTS_PATH ?? join('artifacts', 'playwright-results.json');
const outputPath = join('artifacts', 'release-quality-summary.md');

function latestResult(test) {
  return test.results?.at(-1);
}

function collectProjectResults(suites, projects = new Map()) {
  for (const suite of suites ?? []) {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        const result = latestResult(test);
        const project = test.projectName ?? 'unassigned';
        const summary = projects.get(project) ?? { total: 0, passed: 0, failed: 0, skipped: 0 };
        summary.total += 1;
        if (result?.status === 'passed') summary.passed += 1;
        else if (result?.status === 'skipped') summary.skipped += 1;
        else summary.failed += 1;
        projects.set(project, summary);
      }
    }
    collectProjectResults(suite.suites, projects);
  }
  return projects;
}

function run() {
  if (!existsSync(resultPath)) {
    throw new Error(`Playwright JSON results were not found at ${resultPath}. Run the Playwright suite before generating a release report.`);
  }

  const report = JSON.parse(readFileSync(resultPath, 'utf8'));
  const stats = report.stats ?? {};
  const projects = collectProjectResults(report.suites);
  const unexpected = Number(stats.unexpected ?? 0);
  const decision = unexpected === 0 ? 'GO FOR THE COVERED DEMO SCOPE' : 'NO-GO';
  const runReference = process.env.GITHUB_RUN_ID
    ? `GitHub Actions run ${process.env.GITHUB_RUN_ID}`
    : 'Local execution';
  const projectRows = [...projects.entries()]
    .map(([name, summary]) => `| ${name} | ${summary.passed} | ${summary.failed} | ${summary.skipped} | ${summary.total} |`)
    .join('\n') || '| No project results found | 0 | 0 | 0 | 0 |';

  const markdown = `# Release Quality Summary\n\n` +
`> Generated from Playwright JSON results. This is independent portfolio evidence for the demo application, not a production release approval.\n\n` +
`## Decision\n\n` +
`- **Recommendation:** ${decision}\n` +
`- **Execution:** ${runReference}\n` +
`- **Playwright duration:** ${Number(stats.duration ?? 0)} ms\n` +
`- **Expected tests:** ${Number(stats.expected ?? 0)}\n` +
`- **Unexpected failures:** ${unexpected}\n` +
`- **Flaky tests:** ${Number(stats.flaky ?? 0)}\n` +
`- **Skipped tests:** ${Number(stats.skipped ?? 0)}\n\n` +
`## Results by project\n\n` +
`| Project | Passed | Failed | Skipped | Total |\n| --- | ---: | ---: | ---: | ---: |\n${projectRows}\n\n` +
`## Covered quality signals\n\n` +
`- Browser UI regression and responsive mobile-web interaction\n` +
`- API functional and negative-path coverage\n` +
`- Automated accessibility checks\n` +
`- Cross-browser execution on configured projects\n\n` +
`## Residual risks and limits\n\n` +
`- This summary does not include the separate API performance-smoke job or manually triggered Sauce Labs Android workflow.\n` +
`- Automated accessibility checks require manual follow-up for screen-reader behaviour, zoom/reflow, and task-specific assistive-technology journeys.\n` +
`- The demo API uses an in-memory fixture and is deliberately executed with one CI worker for deterministic state.\n`;

  mkdirSync('artifacts', { recursive: true });
  writeFileSync(outputPath, markdown);
  console.log(`Generated ${outputPath}`);
}

try {
  run();
} catch (error) {
  console.error('Release quality report generation failed.');
  console.error(error);
  process.exitCode = 1;
}
