export type Framework =
    | "node_version"
    | "expo_version"
    | "react-native_version"
    | "ionic_version"
    | "capacitor_version"
    | "angular_version"
    | "react_version";

export type Flags = "--help" | "-h" | "--version" | "-v" | "--versions" | "--report";

export type VersionObject = {
    key: Framework;
    value: string;
};

export type FrameworkObject = {
    key: Framework;
    naming: Array<string>;
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

export type ReportBody = {
    meta: Array<VersionObject>;
    project_info: {
        environment: string;
        packages: Array<PackageObject>;
    };
};
