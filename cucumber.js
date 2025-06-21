const common = [
  "features/**/*.feature",
  "--require-module ts-node/register",
  "--require step-definitions/**/*.ts",
  "--require hooks/**/*.ts",
  "--format progress-bar",
  "--format json:cucumber-reports/cucumber-report.json",
  "--format html:cucumber-reports/cucumber-report.html",
  "--format @cucumber/pretty-formatter",
].join(" ")

module.exports = {
  default: common,
  parallel: common + " --parallel 2",
  chrome: "BROWSER=chromium " + common,
  firefox: "BROWSER=firefox " + common,
  safari: "BROWSER=webkit " + common,
  debug: common + " --tags @debug",
  report: common + " --dry-run", // For testing report generation
}
