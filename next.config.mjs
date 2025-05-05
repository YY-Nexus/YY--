import { withFederatedSidecar } from "@module-federation/nextjs-mf"

// 微前端配置
const federationConfig = {
  name: "shell",
  filename: "static/chunks/remoteEntry.js",
  remotes: {
    organization: "organization@[organizationUrl]/remoteEntry.js",
    employee: "employee@[employeeUrl]/remoteEntry.js",
    compensation: "compensation@[compensationUrl]/remoteEntry.js",
  },
  exposes: {
    // 暴露共享组件和服务
    "./components/ui": "./components/ui/index.ts",
    "./lib/utils": "./lib/utils.ts",
    "./lib/auth": "./lib/auth-context.tsx",
  },
  shared: {
    // 共享依赖
    react: {
      singleton: true,
      requiredVersion: false,
    },
    "react-dom": {
      singleton: true,
      requiredVersion: false,
    },
    "next/navigation": {
      singleton: true,
      requiredVersion: false,
    },
  },
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // 添加PWA相关配置
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config, options) {
    config.plugins.push(
      new options.webpack.container.ModuleFederationPlugin({
        ...federationConfig,
        shared: {
          ...federationConfig.shared,
        },
      })
    )
    return config
  },
}

export default withFederatedSidecar(nextConfig)
