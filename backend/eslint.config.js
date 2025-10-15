import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"],
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: {...globals.node, ...globals.es2021} },
    rules : {
      "no-unused-vars" : ["warn", {"argsIgnorePattern" : "^_"}]
    },
      
    },
    {
      files : ["**/*.test.{js, mjs, cjs}", "tests/setup/setup.js"],
      languageOptions : {
        globals : {...globals.jest}
      }

    }
    
]);


//npx eslint . 
