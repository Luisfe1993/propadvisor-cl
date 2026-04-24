// Stub to prevent TypeScript from resolving exceljs's internal .ts source file
declare module "exceljs" {
  // Re-export everything from the dist types
  export * from "../node_modules/exceljs/dist/exceljs.bare";
  export { default } from "../node_modules/exceljs/dist/exceljs.bare";
}
