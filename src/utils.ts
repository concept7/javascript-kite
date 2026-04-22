import fs from "fs";
import path from "path";
import { Ecosystem, Flags, PackageObject } from "./types.js";

export const readJsonFile = (fileName: string): any => {
    if (!fs.existsSync(fileName)) {
        return null;
    }
    return JSON.parse(fs.readFileSync(fileName, "utf-8"));
};

export const getNodeVersion = (packageJson: any): string => {
    const nvmrcPath = path.join(process.cwd(), ".nvmrc");

    if (fs.existsSync(nvmrcPath)) {
        return fs.readFileSync(nvmrcPath, "utf-8").trim().replace(/^v/, "");
    }

    if (packageJson.engines) {
        return packageJson.engines.node.replace(/^v/, "");
    }

    console.info("No Node version found");
    process.exit(0);
};

const nameFromPath = (pkgPath: string): string | null => {
    const parts = pkgPath.split("node_modules/");
    const name = parts[parts.length - 1];
    return name || null;
};

const buildRequiredByMap = (lockfilePackages: Record<string, any>): Record<string, string[]> => {
    const requiredBy: Record<string, string[]> = {};

    for (const [pkgPath, info] of Object.entries(lockfilePackages)) {
        if (pkgPath === "") continue;

        const name = nameFromPath(pkgPath);
        if (!name) continue;

        for (const dep of Object.keys((info as any).dependencies ?? {})) {
            if (!requiredBy[dep]) requiredBy[dep] = [];
            requiredBy[dep].push(name);
        }
    }

    return requiredBy;
};

export const getPackages = (): Array<PackageObject> => {
    const packageJson = readJsonFile("package.json");
    const lockfile = readJsonFile("package-lock.json");

    if (!lockfile?.packages) {
        return [];
    }

    const directNames = new Set([
        ...Object.keys(packageJson?.dependencies ?? {}),
        ...Object.keys(packageJson?.devDependencies ?? {}),
    ]);

    const requiredByMap = buildRequiredByMap(lockfile.packages);
    const packages: Record<string, PackageObject> = {};

    for (const [pkgPath, info] of Object.entries(lockfile.packages)) {
        if (pkgPath === "") continue;

        const name = nameFromPath(pkgPath);
        const version = (info as any).version;

        if (!name || !version) continue;

        const key = `${name}:${version}`;
        if (!packages[key]) {
            packages[key] = {
                name,
                version,
                ecosystem: Ecosystem.Npm,
                is_direct: directNames.has(name),
                required_by: requiredByMap[name] ?? [],
            };
        }
    }

    return Object.values(packages);
};

export const hasFlag = (flag: Flags): boolean => {
    return process.argv.includes(flag);
};

export const helpText = (): void => {
    console.info(`
    Usage:
        kite [options]

    Options:
        --versions      Print detected project versions
        --report        Report data to the Kite dashboard

        --help, -h      Print this help text for CLI usage
        --version, -v   Print Kite version
  `);
};
