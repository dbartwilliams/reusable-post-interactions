// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: "img.clerk.com",
          // pathname: '/my-bucket/**',
        },
      ],
    },
  };
  
  export default nextConfig;
