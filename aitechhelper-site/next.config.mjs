/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The receptionist page became the Bronze package. Keep the old URL
      // working — it was live and may already be linked from elsewhere.
      { source: "/ai-receptionist", destination: "/bronze", permanent: true },
    ];
  },
};

export default nextConfig;
