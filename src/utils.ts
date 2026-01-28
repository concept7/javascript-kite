import fs from "fs";
import path from "path";
import { Flags, PackageObject } from "./types.js";

export const readJsonFile = (fileName: string): any => {
    if (!fs.existsSync(fileName)) {
        return null;
    }
    return JSON.parse(fs.readFileSync(fileName, "utf-8"));
};

export const getNodeVersion = (packageJson: any): string => {
    const nvmrcPath = path.join(process.cwd(), ".nvmrc");

    if (fs.existsSync(nvmrcPath)) {
        return fs
            .readFileSync(nvmrcPath, "utf-8")
            .trim()
            .replace(/[^0-9.]/g, "");
    }

    if (packageJson.engines) {
        return packageJson.engines.node.replace(/[^0-9.]/g, "");
    }

    console.info("No Node version found");
    process.exit(0);
};

export const getInstalledVersion = (packageName: string, lockfile: any): string | null => {
    if (!lockfile?.packages) {
        return null;
    }

    for (const [pkgPath, info] of Object.entries(lockfile.packages)) {
        if (pkgPath.endsWith(`node_modules/${packageName}`)) {
            return (info as any).version ?? null;
        }
    }

    return null;
};

export const getPackages = (): Array<PackageObject> => {
    const packageJson = readJsonFile("package.json");

    const packages: Array<PackageObject> = [];

    for (const [name, version] of Object.entries(packageJson.dependencies)) {
        packages.push({
            name,
            version,
        });
    }

    return packages;
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
