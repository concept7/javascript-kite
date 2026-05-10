import { ReportBody } from "../types.js";
import { getKiteConfig, getPackages } from "../utils.js";
import { getProjectVersions } from "./versions.js";

const BASE_URL = "https://kite-monitor.concept7.dev";

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

    const token = process.env.KITE_TOKEN;

    if (!token) {
        console.info("Kite credentials are incomplete, add KITE_TOKEN to your .env");
        process.exit(0);
    }

    if (!environment) {
        console.info("There is no environment variable found in the .env, add ENV or ENVIRONMENT to your .env");
        process.exit(0);
    }

    const url = `${process.env.KITE_URI ?? BASE_URL}/api/project`;
    const config = getKiteConfig();

    let packages = getPackages();

    if (config.packages !== null) {
        packages = packages.filter((pkg) => config.packages!.includes(pkg.name));
    }

    const projectInfo: ReportBody["project_info"] = {
        environment,
        packages,
    };

    if (config.monitored_packages.length > 0) {
        projectInfo.monitored_packages = config.monitored_packages;
    }

    const body: ReportBody = {
        meta: getProjectVersions(),
        project_info: projectInfo,
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
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
