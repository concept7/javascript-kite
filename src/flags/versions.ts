import { frameworks } from "../constants.js";
import { Framework, VersionObject } from "../types.js";
import { getInstalledVersion, getNodeVersion, readJsonFile } from "../utils.js";

export const getProjectVersions = (): VersionObject[] => {
    const packageFile = readJsonFile("package.json");
    const packageLockFile = readJsonFile("package-lock.json");

    if (!packageFile || !packageLockFile) {
        console.info("package.json and/or package-lock.json are incorrect or missing");
        process.exit(0);
    }

    const array: VersionObject[] = [
        {
            key: "node_version",
            value: getNodeVersion(packageFile),
        },
    ];

    frameworks.forEach((value) => {
        let result: string | null = null;

        for (let i = 0; i < value.naming.length; i++) {
            const name = value.naming[i];

            result = getInstalledVersion(name, packageLockFile);

            if (result) {
                break;
            }
        }

        if (result !== null) {
            array.push({
                key: value.key as Framework,
                value: result,
            });
        }
    });

    return array;
};
