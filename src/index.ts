#!/usr/bin/env node

import dotenv from "dotenv";
import { report } from "./flags/report.js";
import { getProjectVersions } from "./flags/versions.js";
import { hasFlag, helpText, readJsonFile } from "./utils.js";

//* Read .env file from project
dotenv.config({
    path: `${process.cwd()}/.env`,
});

const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    helpText();
    process.exit(0);
}

const showVersions = hasFlag("--versions");

if (showVersions) {
    const versions = getProjectVersions();

    console.info("Project versions");
    console.info(JSON.stringify(versions, null, 4));

    process.exit(0);
}

const shouldReport = hasFlag("--report");

if (shouldReport) {
    console.info("Reporting versions to Kite Dashboard..");

    await report();

    process.exit(0);
}

const showVersion = hasFlag("--version") || hasFlag("-v");

if (showVersion) {
    const packageJson = readJsonFile("package.json");

    console.info(packageJson.version);
    process.exit(0);
}

helpText();
process.exit(0);
