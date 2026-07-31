import { spawnSync } from 'node:child_process';

const testFiles = [
	'test/integration.test.mjs',
	'test/smoke.test.mjs',
	'test/trigger.test.mjs',
	'test/unit.test.mjs',
];

for (const testFile of testFiles) {
	const result = spawnSync(process.execPath, ['--test', testFile], {
		stdio: 'inherit',
	});

	if (result.error) throw result.error;
	if (result.status !== 0) process.exit(result.status ?? 1);
}
