import { ReportBody } from "../types.js";
import { getPackages } from "../utils.js";
import { getProjectVersions } from "./versions.js";

export const report = async () => {
    const environment =
        process.env.ENV ||
        process.env.ENVIRONMENT ||
        process.env.EXPO_PUBLIC_ENV ||
        process.env.EXPO_PUBLIC_ENVIRONMENT ||
        process.env.NG_APP_ENV ||
        process.env.NG_APP_ENVIRONMENT ||
        process.env.VITE_ENV ||
        process.env.VITE_ENVIRONMENT;

    const uri = process.env.KITE_URI;
    const projectId = process.env.KITE_PROJECT_ID;
    const projectKey = process.env.KITE_PROJECT_KEY;

    if (!uri || !projectId || !projectKey) {
        console.info("Kite credentials are incomplete, add them to your .env");
        process.exit(0);
    }

    if (!environment) {
        console.info("There is no environment variable found in the .env, add ENV or ENVIRONMENT to your .env");
        process.exit(0);
    }

    const url = `${uri}/api/project/${projectId}`;

    const body: ReportBody = {
        meta: getProjectVersions(),
        project_info: {
            environment,
            packages: getPackages(),
        },
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${projectKey}`,
            },
            body: JSON.stringify(body),
        })
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                return error;
            });

        console.info(response.message);
    } catch (error) {
        console.info("Something went wrong reporting the data :: ", error);
    }
};
