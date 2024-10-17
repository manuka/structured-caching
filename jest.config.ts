import type { JestConfigWithTsJest } from "ts-jest"
import { pathsToModuleNameMapper } from "ts-jest"

const jestConfig: JestConfigWithTsJest = {
  preset: `ts-jest`,
  moduleDirectories: [`node_modules`, `<rootDir>`],
  moduleNameMapper: pathsToModuleNameMapper({
    "@": [`src/index`],
    "@/*": [`src/*`],
    "&": [`test/index`],
    "&/*": [`test/*`],
  }),
}

export default jestConfig
