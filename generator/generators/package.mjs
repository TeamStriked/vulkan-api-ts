/**

  Generates a package.json for the sake

**/
import fs from "fs";
import path from "path";
import nunjucks from "nunjucks";
import pkg from "../../package.json";

import {
  resolveLunarVkSDKPath
} from "../utils.mjs";

let ast = null;

const PKG_TEMPLATE = fs.readFileSync(`${pkg.config.TEMPLATE_DIR}/package-json.njk`, "utf-8");

nunjucks.configure({ autoescape: true });

function normalizeJSONPath(path) {
  return path.split(String.fromCharCode(92)).join(String.fromCharCode(92,92))
}

export default function(astReference, VK_VERSION) {
  ast = astReference;
  let vars = {
    VK_VERSION,
    VULKANAPI_VERSION: pkg.version,
    SDK_PATH: normalizeJSONPath(path.normalize(resolveLunarVkSDKPath(VK_VERSION)))
  };
  let out = {
    json: null
  };
  // package.json
  {
    let template = PKG_TEMPLATE;
    let output = nunjucks.renderString(template, vars);
    out.json = output;
  }
  return out;
};
