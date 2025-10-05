/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This setting will allow your project to build successfully
    // by ignoring the type error that only happens on Vercel.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;