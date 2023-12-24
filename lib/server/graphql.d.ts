/// <reference types="node" />
declare const _default: (command: string) => (request: import("http").IncomingMessage & {
    url: string;
}, response: import("http").ServerResponse<import("http").IncomingMessage> & {
    json?: ((data: unknown) => void) | undefined;
}) => Promise<void>;
export default _default;
