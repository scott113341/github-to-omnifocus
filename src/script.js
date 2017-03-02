const formatDate = require('dateformat');
const esc = require('escape-string-applescript');

function makeScript (issue) {
  return `
    tell application "OmniFocus"
      tell default document\n
        ${makeProject(issue)}\n
        ${makeTask(issue)}\n
        ${updateTask(issue)}\n
      end tell
    end tell
`.trim();
}

function makeProject ({ repo }) {
  const setRepoProject = `set repoProject to first flattened project where its name = "${esc(repo)}"`;
  return `
    try
      ${setRepoProject}
    on error
      tell it to make new project with properties {name:"${esc(repo)}"}
      ${setRepoProject}
    end try
  `.trim();
}

function makeTask ({ number }) {
  const setIssueTask = `set issueTask to first flattened task where its note starts with "#${number}" and its containing project = repoProject`;
  return `
    try
      ${setIssueTask}
    on error
      tell repoProject to make new task with properties {note:"#${number}"}
      ${setIssueTask}
    end try
  `.trim();
}

function updateTask (issue) {
  const i = issue;
  return `
    set issueTask's name to "#${i.number} ${esc(i.name)}"
    set issueTask's due date to ${i.due ? `date "${formatDate(i.due, 'm/d/yyyy')}"` : 'missing value'}
    set issueTask's completion date to ${i.closed ? `date "${formatDate(i.closed, 'm/d/yyyy')}"` : 'missing value'}
    set issueTask's note to "#${i.number}\n\n${esc(i.url)}\n\n${i.description ? esc(i.description) : ''}"
  `.trim();
}

module.exports = {
  makeScript,
  makeProject,
  makeTask,
  updateTask
};
