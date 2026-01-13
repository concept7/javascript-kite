export type Framework =
    | "node_version"
    | "expo_version"
    | "react-native_version"
    | "ionic_version"
    | "capacitor_version"
    | "angular_version"
    | "react_version";

export type Flags = "--help" | "-h" | "--version" | "-v" | "--versions" | "--send";

export type VersionObject = {
    key: Framework;
    value: string;
};

export type FrameworkObject = {
    key: Framework;
    naming: Array<string>;
};

export type PackageObject = {
    name: string;
    version: string | unknown;
};

export type SendBody = {
    meta: Array<VersionObject>;
    project_info: {
        environment: string;
        packages: Array<PackageObject>;
    };
};
