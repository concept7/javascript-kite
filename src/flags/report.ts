import { ConfigResponse, PackageObject, ReportBody } from "../types.js";
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

    const token = process.env.KITE_TOKEN;

    if (!token) {
        console.info("Kite credentials are incomplete, add KITE_TOKEN to your .env");
        process.exit(0);
    }

    if (!environment) {
        console.info("There is no environment variable found in the .env, add ENV or ENVIRONMENT to your .env");
        process.exit(0);
    }

    const baseUrl = process.env.KITE_URI ?? "https://kite-monitor.com";
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    const config = await fetchConfig(baseUrl, headers);
    const packages = filterPackages(getPackages(), config);

    const body: ReportBody = {
        meta: getProjectVersions(),
        project_info: {
            environment,
            packages,
        },
    };

    try {
        const response = await fetch(`${baseUrl}/api/project`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
            .catch((error) => error);

        console.info(response.message);
    } catch (error) {
        console.info("Something went wrong reporting the data :: ", error);
    }
};

const fetchConfig = async (baseUrl: string, headers: Record<string, string>): Promise<ConfigResponse["config"]> => {
    try {
        const response = await fetch(`${baseUrl}/api/config`, { headers });

        if (!response.ok) {
            return { monitored_packages: [], is_sharing_all_packages: true };
        }

        const data: ConfigResponse = await response.json();

        return data.config ?? { monitored_packages: [], is_sharing_all_packages: true };
    } catch {
        return { monitored_packages: [], is_sharing_all_packages: true };
    }
};

const filterPackages = (packages: PackageObject[], config: ConfigResponse["config"]): PackageObject[] => {
    if (config.is_sharing_all_packages) {
        return packages;
    }

    return packages.filter((packageObject) => config.monitored_packages.includes(packageObject.name));
};
