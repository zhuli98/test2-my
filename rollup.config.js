import babel from "rollup-plugin-babel"; 
import transformRemoveConsole from "babel-plugin-transform-remove-console";
import commonjs from "rollup-plugin-commonjs";
// import WindiCSS from "rollup-plugin-windicss";
import postcss from "rollup-plugin-postcss";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer"; 
import url from "@rollup/plugin-url";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import { eslint } from "rollup-plugin-eslint";
const input =  "src/index.js"
export default {
  // 打包入口
  input,
  output: [
    {
      // 最终打包出来的文件路径和文件名，这里是在package.json的"main": "dist/index.js"
      file: "dist/index.js",
      // 必填/ umd是兼容amd/cjs/iife的通用打包格式，适合浏览器  iife  es  umd  cjs ？？？
      format: "umd", // 浏览器iife/umd  
      name: "MySdk", // 最终导出的对象名  const {xxx} = MySdk
      // sourcemap: true,
      // sourcemapFile: './dist/bundle.js.map'
    },
    // 同时打包多个模块格式的包 js cjs mjs
    {
      file: input.replace("src/", "dist/").replace(".js", ".cjs"),
      format: "cjs",
    },
    {
      file: input.replace("src/", "dist/").replace(".js", ".mjs"),
      format: "es",
    },
  ],
  // <script src="./lib/my_sdk.js"></script> 浏览器引入、
  plugins: [
    // 每次编译之前清空历史编译目录
    // clear({
    //   targets: ["dist"],  // 项目打包编译生成的目录
    //   watch: true,  // 实时监听文件变化
    // }),
    resolve(), // 识别集成第三方包: 查找和打包node_modules中的第三方模块，需要使用第三方包，如果不解析，就只会在代码中有一行 import ‘xxx’; 使用时要比 commonjs 和 babel 早调用
    commonjs(), // 将 commonjs 解析成 es2015, 与 babel 同在时必须在 babel 之前调用;
    babel({
      // babel插件：将代码按照 browserslistrc 中的目标进行编译，以兼容这里面的浏览器
      exclude: "node_modules/**", // 只转义我们的源码
      // extentions: [".js", ".jsx", ".ts", ".tsx"],
      plugins: [
        transformRemoveConsole, // 打包移除console
      ],
    }),
    // ...WindiCSS(), // css框架 ????有问题
    postcss({
      // 手动写css
      plugins: [
        autoprefixer(), // 自动添加 css 兼容性前缀
        cssnano(), // 压缩 css 成一行
      ],
      extensions: ["less", "css", "scss"], // 解析 less。css, scss
      // extract: "css/index.css", // 将 css 抽离成单独的文件，一般不需要开启,因为最后只要暴露一个js 出来，不用拆分
    }),
    url({
      // 将图片打包成 base64 (最后只能暴露出一个 js 文件，此时需要将图片打包成内联的 base64)
      limit: 300 * 1024,
      exclude: "node_modules/**",
    }),
    terser({
      // 代码压缩
      ecma: 6,
      output: {
        comments: false, // 移除注释
      },
    }),
    // 会自动加载文件根目录的 `.eslintrc.js` 配置文件
    eslint({
      fix: true,
      throwOnError: true, // 有错误时会抛出
      throwOnWarning: true, // 有警报时会抛出
      include: ["src"],
      exclude: [], // 默认值 node_modules/**
      formatter: () => {}, // https://www.npmjs.com/package/rollup-plugin-eslint
    }),
  ],
  external: [
    // 包不集成到输出文件中,指出应该将哪些模块看做外部模块，不和我们的源码包打在一起，该参数接收数组或者参数为模块名称的函数，返回true则将被看做外部引入不打包在一起
    "lodash",
  ],
};
