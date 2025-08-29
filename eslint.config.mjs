import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // 在某些情况下允许使用 any 类型
      "@typescript-eslint/no-explicit-any": "off",
      // 允许未使用的变量（在某些情况下）
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;