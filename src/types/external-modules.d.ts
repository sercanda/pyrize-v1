declare module 'vite' {
  export interface UserConfig {
    [key: string]: unknown;
  }

  export interface ConfigEnv {
    mode: string;
    [key: string]: unknown;
  }

  export type UserConfigExport = UserConfig | ((env: ConfigEnv) => UserConfig);

  // eslint-disable-next-line @typescript-eslint/ban-types
  export function defineConfig(config: UserConfigExport): UserConfigExport;
  export function loadEnv(mode: string, root: string, prefix?: string): Record<string, string>;
}

declare module '@vitejs/plugin-react' {
  const plugin: (...args: unknown[]) => unknown;
  export default plugin;
}

declare module 'jszip' {
  class JSZip {
    static loadAsync(data: ArrayBuffer | Blob | Buffer | string): Promise<JSZip>;
    file(name: string): JSZipObject | null;
    file(name: string, data: string | ArrayBuffer | Uint8Array | Buffer): JSZip;
    files: { [filename: string]: JSZipObject };
    folder(name: string): JSZip | null;
    generateAsync(options: { type: 'blob' }): Promise<Blob>;
    generateAsync(options: { type: 'arraybuffer' }): Promise<ArrayBuffer>;
    generateAsync(options: { type: 'uint8array' }): Promise<Uint8Array>;
    generateAsync(options: { type: 'base64' | 'string' }): Promise<string>;
    forEach(callback: (relativePath: string, file: JSZipObject) => void): void;
  }

  interface JSZipObject {
    name: string;
    dir: boolean;
    async(type: 'string' | 'text'): Promise<string>;
    async(type: 'arraybuffer'): Promise<ArrayBuffer>;
    async(type: 'uint8array'): Promise<Uint8Array>;
    async(type: 'blob'): Promise<Blob>;
    async(type: 'base64'): Promise<string>;
  }

  export default JSZip;
}
