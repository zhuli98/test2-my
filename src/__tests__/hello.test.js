import { Hello } from "../index";
test("My Hello", () => {
  let hello = Hello('zhuzhu');
  expect(hello).toBe("helloya~~ zhuzhu");
});
// 与.babelrc冲突
// {
//   "presets": ["@babel/preset-env"],
//   "plugins": ["@babel/plugin-transform-modules-commonjs"]
// }