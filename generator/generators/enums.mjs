/**

  Generates JS relative list of vulkan enums and bitmasks

**/
import fs from "fs";
import nunjucks from "nunjucks";
import pkg from "../../package.json";

let ast = null;

const H_TEMPLATE = fs.readFileSync(`${pkg.config.TEMPLATE_DIR}/enums-h.njk`, "utf-8");

nunjucks.configure({ autoescape: true });

function getEnumType(enu) {
  if (enu.type === "ENUM_STRINGS") return `std::string`;
  return `int32_t`;
};

function getEnumMemberValue(member) {
  if (member.isStringValue) return `"${member.value}"`;
  return member.value || member.alias;
};

function getEnumNapiValue(enu) {
  if (
    enu.type === "ENUM" ||
    enu.type === "BITMASK" ||
    enu.type === "UNKNOWN"
  ) {
    return `Napi::Number::New(env, static_cast<int32_t>(it->second))`;
  }
  else if (enu.type === "ENUM_STRINGS") {
    return `Napi::String::New(env, it->second.c_str())`;
  }
};

const findDuplicates = (arr) => {
  let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
  // JS by default uses a crappy string compare.
  // (we use slice to clone the array so the
  // original array won't be modified)
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  return results;
}


export default function (astReference, enums) {
  ast = astReference;



  for (let num of enums) {
    for (let val of num.children) {
      if(val.name == "VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VARIABLE_POINTER_FEATURES_KHR")
      {
        console.log(val);
      }
    }
  }

  let vars = {
    enums,
    getEnumType,
    getEnumNapiValue,
    getEnumMemberValue
  };
  let out = {
    source: null
  };
  // h
  {
    let template = H_TEMPLATE;
    let output = nunjucks.renderString(template, vars);
    out.source = output;
  }
  return out;
};
