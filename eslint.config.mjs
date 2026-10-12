import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // 의존 방향: app → features → shared. feature는 index.ts로만 공개하고 서로 참조하지 않는다.
  {
    files: ["src/**"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [
        { group: ["@/features/*/*"], message: "feature는 index.ts(공개 진입점)로만 import합니다." },
      ] }],
    },
  },
  {
    files: ["src/features/**"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [
        { group: ["@/features/*", "@/features/*/*"], message: "feature끼리는 참조하지 않습니다. 공통 코드는 shared로 옮깁니다." },
        { group: ["@/app/*"], message: "feature는 app을 참조하지 않습니다." },
      ] }],
    },
  },
  {
    files: ["src/shared/**"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [
        { group: ["@/features/*", "@/features/*/*", "@/app/*"], message: "shared는 feature·app을 참조하지 않습니다." },
      ] }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
