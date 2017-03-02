const runScript = require('run-applescript');

const Script = require('./script.js');
const Cache = require('./Cache.js');
const GitHub = require('./GitHub.js');

const [ TOKEN, ignoreCache ] = process.argv.slice(2);

async function main () {
  try {
    const gh = new GitHub(TOKEN);
    const issues = await gh.getAllIssues();
    console.log(`importing ${issues.length} issues`);

    for (let issue of issues) {
      process.stdout.write('.');
      if (Cache.isCached(issue) && !ignoreCache) continue;
      const script = Script.makeScript(issue);
      await runScript(script);
      Cache.setCached(issue, true);
    }

    process.stdout.write('\n');
    Cache.saveCache();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

main();
