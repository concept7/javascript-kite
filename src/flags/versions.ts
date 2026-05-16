import { VersionObject } from "../types.js";
import { getNodeVersion, readJsonFile } from "../utils.js";

export const getProjectVersions = (): VersionObject[] => {
    const packageFile = readJsonFile("package.json");

    if (!packageFile) {
        console.info("package.json is incorrect or missing");
        process.exit(0);
    }

    return [
        {
            key: "node_version",
            value: getNodeVersion(packageFile),
        },
    ];
};
