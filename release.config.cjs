module.exports = {
	branches: ["main"],
	tagFormat: "n8n-node-v${version}",
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		[
			"@semantic-release/exec",
			{
				prepareCmd:
					'npm version "${nextRelease.version}" --no-git-tag-version --allow-same-version && npm run validate:release-tag -- "${nextRelease.gitTag}"',
			},
		],
		[
			"@semantic-release/git",
			{
				assets: ["package.json", "package-lock.json"],
				message: "chore(release): ${nextRelease.gitTag} [skip ci]",
			},
		],
		[
			"@semantic-release/github",
			{
				assets: [
					{
						path: "artifacts/*.tgz",
						label: "@attocash/n8n-nodes-atto package",
					},
				],
			},
		],
	],
};
