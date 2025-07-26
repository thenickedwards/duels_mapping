/** @type {import('next').NextConfig} */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASSE_ANON_KEY;
const powersyncUrl = process.env.NEXT_PUBLIC_POWERSYNC_URL;

const nextConfig = {
  supabaseUrl: supabaseUrl,
  supabaseAnonKey: supabaseAnonKey,
  powersyncUrl: powersyncUrl,
};

export default nextConfig;

//  FROM POWERSYNC
//   module.exports = {
//   images: {
//     disableStaticImages: true,
//   },
//   webpack: (config, { isServer }) => {
//     if (isServer) {
//       return config;
//     }
//     return {
//       ...config,
//       module: {
//         ...config.module,
//         rules: [
//           ...config.module.rules,
//           {
//             test: /\.css/,
//             use: ["style-loader", "css-loader"],
//           },
//           {
//             test: /\.scss/,
//             use: ["style-loader", "css-loader", "sass-loader"],
//           },
//         ],
//       },
//     };
//   },
//   ,};
