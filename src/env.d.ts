// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEZOS_ENDPOINT: string;
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_IPFS_API_KEY: string;
  readonly VITE_IPFS_API_SECRET: string;
  readonly VITE_IPFS_API_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
