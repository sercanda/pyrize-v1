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
