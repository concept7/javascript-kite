import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { DependentObject, Ecosystem, Flags, PackageObject } from "./types.js";

export const readJsonFile = (fileName: string): any => {
    if (!fs.existsSync(fileName)) {
        return null;
    }
    return JSON.parse(fs.readFileSync(fileName, "utf-8"));
};

export const getKiteVersion = (): string => {
    const packageJsonPath = fileURLToPath(new URL("../package.json", import.meta.url));

    return readJsonFile(packageJsonPath)?.version ?? "unknown";
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
        if (pkgPath === "") {
            continue;
        }

        const name = nameFromPath(pkgPath);
        if (!name) {
            continue;
        }

        for (const dep of Object.keys((info as any).dependencies ?? {})) {
            if (!requiredBy[dep]) {
                requiredBy[dep] = [];
            }
            requiredBy[dep].push(name);
        }
    }

    return requiredBy;
};

/**
 * Resolves a dependency the way Node does: the nearest node_modules folder
 * from the requiring package up to the project root.
 */
const resolveDependencyPath = (lockfilePackages: Record<string, any>, parentPath: string, dependency: string): string | null => {
    let basePath = parentPath;

    while (true) {
        const candidate = basePath === "" ? `node_modules/${dependency}` : `${basePath}/node_modules/${dependency}`;

        if (lockfilePackages[candidate]) {
            return candidate;
        }

        if (basePath === "") {
            return null;
        }

        const lastNodeModules = basePath.lastIndexOf("node_modules/");
        basePath = lastNodeModules > 0 ? basePath.slice(0, lastNodeModules - 1) : "";
    }
};

/**
 * Per installed copy (name:version): the constraint the project manifest puts
 * on it when it is a direct dependency, and every parent copy that requires it
 * with the constraint that parent puts on it.
 */
const buildConstraints = (
    lockfilePackages: Record<string, any>,
): { manifestConstraints: Record<string, string>; dependents: Record<string, DependentObject[]> } => {
    const manifestConstraints: Record<string, string> = {};
    const dependents: Record<string, DependentObject[]> = {};

    for (const [pkgPath, info] of Object.entries(lockfilePackages)) {
        const parentName = pkgPath === "" ? null : nameFromPath(pkgPath);
        const parentVersion = (info as any).version;

        if (pkgPath !== "" && (!parentName || !parentVersion)) {
            continue;
        }

        const dependencySpecs: Record<string, string> = {
            ...((info as any).peerDependencies ?? {}),
            ...((info as any).optionalDependencies ?? {}),
            ...((info as any).devDependencies ?? {}),
            ...((info as any).dependencies ?? {}),
        };

        for (const [dependency, constraint] of Object.entries(dependencySpecs)) {
            const dependencyPath = resolveDependencyPath(lockfilePackages, pkgPath, dependency);
            const dependencyVersion = dependencyPath ? lockfilePackages[dependencyPath].version : null;

            if (!dependencyVersion) {
                continue;
            }

            const key = `${dependency}:${dependencyVersion}`;

            if (pkgPath === "") {
                manifestConstraints[key] = constraint;
                continue;
            }

            if (!dependents[key]) {
                dependents[key] = [];
            }

            const isKnownDependent = dependents[key].some(
                (dependent) => dependent.name === parentName && dependent.version === parentVersion && dependent.constraint === constraint,
            );

            if (!isKnownDependent) {
                dependents[key].push({ name: parentName as string, version: parentVersion, constraint });
            }
        }
    }

    return { manifestConstraints, dependents };
};

export const getPackages = (): Array<PackageObject> => {
    const packageJson = readJsonFile("package.json");
    const lockfile = readJsonFile("package-lock.json");

    if (!lockfile?.packages) {
        return [];
    }

    const directNames = new Set([...Object.keys(packageJson?.dependencies ?? {}), ...Object.keys(packageJson?.devDependencies ?? {})]);

    const requiredByMap = buildRequiredByMap(lockfile.packages);
    const { manifestConstraints, dependents } = buildConstraints(lockfile.packages);
    const packages: Record<string, PackageObject> = {};

    for (const [pkgPath, info] of Object.entries(lockfile.packages)) {
        if (pkgPath === "") {
            continue;
        }

        const name = nameFromPath(pkgPath);
        const version = (info as any).version;

        if (!name || !version) {
            continue;
        }

        const key = `${name}:${version}`;
        if (!packages[key]) {
            packages[key] = {
                name,
                version,
                ecosystem: Ecosystem.Npm,
                is_direct: directNames.has(name),
                required_by: requiredByMap[name] ?? [],
                constraint: manifestConstraints[key] ?? null,
                dependents: dependents[key] ?? [],
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
