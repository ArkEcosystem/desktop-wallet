import { compileToFunctions } from 'vue-template-compiler'

export function compileTemplate (template) {
  return compileToFunctions(template)
}
