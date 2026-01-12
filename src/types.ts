export type Framework = "node" | "expo" | "react-native" | "ionic" | "capacitor" | "angular" | "react" | "unknown";

export type Flags = "--help" | "-h" | "--version" | "-v" | "--versions" | "--send";

export type VersionObject = {
    key: Framework;
    value: string;
};

export type FrameworkObject = {
    key: Framework;
    naming: Array<string>;
};
