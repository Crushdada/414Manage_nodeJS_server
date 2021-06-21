//  router/index.js , 处理各请求
const router = require("koa-router")();
router.use((ctx, next) => {
  console.log(`路由执行成功啦~~~`, Date.now());
  next();
});

const login = require("./login");

// //  业务模块2
// const moduleB = require("./routes/业务模块2");

// // 业务模块3
// const moduleC = require("./routes/业务模块3");
router.use(login);
// router.use(moduleA).use(moduleB).use(moduleC);

module.exports = { router };
