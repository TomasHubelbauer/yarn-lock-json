import fs from 'fs';
import util from 'util';
import path from 'path';

fs.readyFileAsync = util.promisify(fs.readFile);
fs.writeFileAsync = util.promisify(fs.writeFile);
fs.accessAsync = util.promisify(fs.access);

const tolLevelOnly = process.argv[2] === '--top-level-only';

async function run() {
	const currentWorkingDirectoryPath = process.cwd();

	const packageJsonFilePath = path.join(currentWorkingDirectoryPath, 'package.json');
	let packageJsonFileText;
	try {
		await fs.accessAsync(packageJsonFilePath);
		packageJsonFileText = String(await fs.readyFileAsync(packageJsonFilePath));
	} catch (error) {
		packageJsonFileText = '{ "dependencies": [], "devDependencies": [] }';
	}
	const packageJsonFileData = JSON.parse(packageJsonFileText);

	const packageJustificationMdFilePath = path.join(currentWorkingDirectoryPath, 'package-justification.md');
	let packageJustificationMdFileText;
	try {
		await fs.accessAsync(packageJustificationMdFilePath);
		packageJustificationMdFileText = String(await fs.readyFileAsync(packageJustificationMdFilePath));
	} catch (error) {
		packageJustificationMdFileText = '# Package Justification\n\n|Package|Version Strings|Type|Justification|Approved|\n|-|-|-|-|-|\n';
	}
	const packageJustificationMdFileData = parsePackageJustificationMd(packageJustificationMdFileText);

	const yarnLockJsonFilePath = path.join(currentWorkingDirectoryPath, 'yarn.lock.json');
	const yarnLockFilePath = path.join(currentWorkingDirectoryPath, 'yarn.lock');
	const yarnLockFileText = String(await fs.readyFileAsync(yarnLockFilePath));
	const yarnLockFileData = parseYarnLock(yarnLockFileText, packageJsonFileData);

	await fs.writeFileAsync(packageJustificationMdFilePath,
		makeUpdatedTable(yarnLockFileData, packageJustificationMdFileData));
}

run();

function parseYarnLock(text, packageJsonFileData) {
	const packages = [];

	// 1st pass generating the structure of the lock file
	let state = 'auto-generated-comment';
	const lines = text.split('\n');
	for (const line of lines) {
		switch (state) {
			case 'auto-generated-comment': {
				if (line.trim() === '# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.') {
					state = 'version-comment';
					break;
				}

				throw new Error(`Unexpected line ${line}. Expected line conforming to ${state}.`);
			}

			case 'version-comment': {
				if (line.trim() === '# yarn lockfile v1') {
					state = '1st-blank-line';
					break;
				}

				throw new Error(`Unexpected line ${line}. Expected line conforming to ${state}.`);
			}

			case '1st-blank-line': {
				if (line.trim() === '') {
					state = '2nd-blank-line';
					break;
				}

				throw new Error(`Unexpected line ${line}. Expected line conforming to ${state}.`);
			}

			case '2nd-blank-line': {
				if (line.trim() === '') {
					state = 'package-names-and-version-strings';
					break;
				}

				throw new Error(`Unexpected line ${line}. Expected line conforming to ${state}.`);
			}

			case 'package-names-and-version-strings': {
				 // package@versionString1, package@versionString2, …
				const parts = line.trim().slice(0, -1) /* Remove `:` */.split(',').map(part => {
					part = part.trim();
					if (part[0] === '"' && part[part.length - 1] === '"') {
						part = part.slice(1, -1).replace(/ /g, ''); // Version strings with spaces in them.
					}

					return part.split('@');
				});

				if (!parts.every(part => part[0] === parts[0][0])) {
					throw new Error(`Not all versions of ${parts[0][0]} share the name.`)
				}

				const name = parts[0][0];
				const versionStrings = parts.map(part => part[1]); 
				packages.push({ name, versionStrings, dependencies: [], dependants: [] });
				state = 'package-version-line';
				break;
			}

			case 'package-version-line': {
				const parts = line.trim().split(' ', 2);
				if (parts[0].trim() !== 'version') {
					throw new Error(`Unexpected line ${line}. Expected line conforming to ${state}.`);
				}

				const version = parts[1].trim().slice(1, -1); // Remove `"`
				packages[packages.length - 1].version = version;
				state = 'package-resolved-line';
				break;
			}

			case 'package-resolved-line': {
				const parts = line.trim().split(' ', 2);
				if (parts[0].trim() !== 'resolved') {
					throw new Error(`Unexpected line ${line}. Expected line conforming to ${state}.`);
				}

				const resolved = parts[1].trim().slice(1, -1); // Remove `"`
				packages[packages.length - 1].resolved = resolved;
				state = 'package-dependencies-line-or-terminator-blank-line';
				break;
			}

			case 'package-dependencies-line-or-terminator-blank-line': {
				if (line.trim() === '') {
					state = 'package-names-and-version-strings';
					break;
				}

				if (line.trim() === 'dependencies:') {
					state = 'package-dependency-line-or-terminator-blank-line';
					break;
				}

				throw new Error(`Unexpected line ${line}. Expected line conforming to ${state}.`);
			}

			case 'package-dependency-line-or-terminator-blank-line': {
				if (line.trim() === '') {
					state = 'package-names-and-version-strings';
					break;
				}

				const parts = line.trim().split(' ', 2);
				const name = parts[0].trim();
				const versionString = parts[1].trim().slice(1, -1); // Remove `"`
				packages[packages.length - 1].dependencies.push({ name, versionString });
				break;
			}

			default: {
				throw new Error(`Invalid state ${state}.`);
			}
		}
	}

	// 2nd pass computing `dependants` for each package
	for (const _package of packages) {
		for (const dependency of _package.dependencies) {
			const _package2 = packages.find(p => p.name === dependency.name);
			if (!_package2) {
				throw new Error(`Cannot find package ${dependency.name}, a dependency of ${_package.name}.`);
			}

			_package2.dependants.push(_package.name);
		}
	}

	// 3rd pass to mark packages as "dependency", "developmentDependency" or "" (for dependnecy of a dependency)
	for (const _package of packages) {
		if (_package.dependants.length > 0)
		{
			_package.type = '';
			continue;
		}

		if (Object.keys(packageJsonFileData.dependencies || {}).find(p => p === _package.name)) {
			_package.type = 'dependency';
		} else if (Object.keys(packageJsonFileData.devDependencies || {}).find(p => p === _package.name)) {
			_package.type = 'development dependency';
		} else {
			_package.type = 'unknown';
			console.log(`Found a package without dependants but not included in package.json: ${_package.name}.`);
		}
	}

	return packages;
}

function parsePackageJustificationMd(text) {
	const records = [];
	let lastPrefixLineIndex;
	let firstSuffixLineIndex;

	let state = 'maybe-table-header';
	const lines = text.split('\n');
	for (let index = 0; index < lines.length; index++) {
		const line = lines[index];
		switch (state) {
			case 'maybe-table-header': {
				if (line.split('|').map(c => c.trim()).join('|') === '|Package|Version Strings|Type|Justification|Approved|') {
					state = 'table-header';
					lastPrefixLineIndex = index;
				}

				break;
			}

			case 'table-header': {
				if (line.split('|').map(c => c.trim().replace(/-/g, '')).join('|') === '||||||') {
					state = 'table-row-or-terminator-blank-line';
					break;
				}

				throw new Error(`Unexpected line ${line}. Expected line conforming to ${state}.`);
			}

			case 'table-row-or-terminator-blank-line': {
				if (line.trim() === '') {
					state = 'suffix-lines';
					firstSuffixLineIndex = index;
				} else {
					const parts = line.split('|').map(c => c.trim());
					const _package = parts[1];
					const versionStrings = parts[2];
					const type = parts[3];
					const justification = parts[4];
					const approved = parts[5];
					const isApproved = approved.trim().startsWith('[x]') || approved.trim().startsWith('[X]');

					records.push({ package: _package, type, justification, approved, isApproved });
				}

				break;
			}
		}
	}

	const prefix = lines.slice(0, lastPrefixLineIndex).join('\n');
	const suffix = lines.slice(firstSuffixLineIndex).join('\n');

	return { prefix, records, suffix };
}

function makeUpdatedTable(yarnLockFileData, packageJustificationMdFileData) {
	// Compute longest lenths in order to be able to pad columns to a consistent width.
	let longestPackageLength = 'Package'.length;
	let longestVersionStringsLength = 'Version Strings'.length;
	let longestTypeLength = 'Type'.length;
	let longestJustificationLength = 'Justification'.length;
	let longestApprovedLength = 'Approved'.length;
	
	const records = [];
	const breaches = [];
	for (let _package of yarnLockFileData) {
		const recordIndex = packageJustificationMdFileData.records.findIndex(r => r.package === _package.name);
		
		const packageName = _package.name;
		if (packageName.length > longestPackageLength) longestPackageLength = packageName.length;

		const versionStrings = _package.versionStrings.join(', ');
		if (versionStrings.length > longestVersionStringsLength) longestVersionStringsLength = versionStrings.length;

		const type = _package.type;
		if (type.length > longestTypeLength) longestTypeLength = type.length;

		let justification;
		let approved;
		if (recordIndex !== -1) {
			const record = packageJustificationMdFileData.records[recordIndex];
			justification = record.justification;
			approved = record.approved;

			if (record.isApproved && !record.justification) {
				if (!tolLevelOnly || (record.type === 'dependency' || record.type === 'development dependency')) {
					breaches.push(_package.name);
				}
			}
		} else {
			justification = _package.dependants.length > 0 ? ('Dependency of ' + _package.dependants.join(', ')) : '';
			approved = '[ ]';
		}

		if (justification.length > longestJustificationLength) longestJustificationLength = justification.length;
		if (approved.length > longestApprovedLength) longestApprovedLength = approved.length;

		records.push({ package: packageName, versionStrings, type, justification, approved });
	}

	if (breaches.length > 0) {
		throw new Error(`The following approved packages miss justification:\n${breaches.join('\n')}`);
	}

	const tableHead = '|'
		+ ` ${spaceRightTo('Package', longestPackageLength)} |`
		+ ` ${spaceRightTo('Version Strings', longestVersionStringsLength)} |`
		+ ` ${spaceRightTo('Type', longestTypeLength)} |`
		+ ` ${spaceRightTo('Justification', longestJustificationLength)} |`
		+ ` ${spaceRightTo('Approved', longestApprovedLength)} |`
		+ `\n|`
		+ `${'-'.repeat(longestPackageLength + 2)}|`
		+ `${'-'.repeat(longestVersionStringsLength + 2)}|`
		+ `${'-'.repeat(longestTypeLength + 2)}|`
		+ `${'-'.repeat(longestJustificationLength + 2)}|`
		+ `${'-'.repeat(longestApprovedLength + 2)}|`;

	const tablebody = records
		.map(r => '|'
			+ ` ${spaceRightTo(r.package, longestPackageLength)} |`
			+ ` ${spaceRightTo(r.versionStrings, longestVersionStringsLength)} |`
			+ ` ${spaceRightTo(r.type, longestTypeLength)} |`
			+ ` ${spaceRightTo(r.justification, longestJustificationLength)} |`
			+ ` ${spaceRightTo(r.approved, longestApprovedLength)} |`)
		.join('\n');

	return `${packageJustificationMdFileData.prefix}\n${tableHead}\n${tablebody}\n${packageJustificationMdFileData.suffix}`;
}

function spaceRightTo(text, length) {
	if (length > text.length) {
		return text + ' '.repeat(length - text.length);
	}
	
	return text;
}
