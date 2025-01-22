/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
        // need this for static export
        unoptimized: true,
    }
};

export default nextConfig;
