export type Flags = "--help" | "-h" | "--version" | "-v" | "--versions" | "--report";

export type VersionObject = {
    key: "node_version";
    value: string;
};

export enum Ecosystem {
    Composer = "composer",
    Npm = "npm",
}

export type PackageObject = {
    name: string;
    version: string | unknown;
    ecosystem: Ecosystem;
    is_direct: boolean;
    required_by: string[];
};

export type ConfigResponse = {
    config: {
        monitored_packages: string[];
        is_sharing_all_packages: boolean;
    };
};

export type ReportBody = {
    meta: Array<VersionObject>;
    project_info: {
        environment: string;
        packages: Array<PackageObject>;
    };
};
