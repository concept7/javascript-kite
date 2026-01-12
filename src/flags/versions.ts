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
            key: "node",
            value: getNodeVersion(packageFile),
        },
    ];

    //FIXME: fix adding ionic version to array
    frameworks.forEach((value) => {
        let result: string | null = null;

        value.naming.forEach((name) => {
            result = getInstalledVersion(name, packageLockFile);

            if (result) {
                return;
            }
        });

        if (result !== null) {
            array.push({
                key: value.key as Framework,
                value: result,
            });
        }
    });

    return array;
};
