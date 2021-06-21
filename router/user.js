/*jshint esversion: 6 */
const router = require("koa-router")();

const { query } = require("../mysql/query"); //引入封装好的异步查询方法
const { QUERY_DATAS,INSERT_DATA } = require("../mysql/sql"); //部分引入sql库

router.prefix("/user"); //路由前缀

class User {
  constructor(code, message, id, role, trueName, userName, nickName, address) {
    this.code = code;
    this.message = message;
    this.id = id;
    this.role = role;
    this.trueName = trueName;
    this.userName = userName;
    this.nickName = nickName;
    this.address = address;
  }
}

let getResCode = (judge) => {
  let login_success = { code: "1000", message: "登录成功" };
  let login_fail = { code: "1001", message: "登录失败" };
  let login_psErr = { code: "1002", message: "登录失败,密码错误" };
  let regis_success = { code: "1000", message: "success" };
  let regis_fail = { code: "1001", message: "faild" };
  let register_fail = { code: "1001", message: "注册失败" };
  let register_success = { code: "1000", message: "注册成功" };
  if (judge == 0) return login_success;
  if (judge == 1) return login_fail;
  if (judge == 2) return login_psErr;
  if (judge == 3) return regis_success;
  if (judge == 4) return regis_fail;
  if (judge == 5) return register_fail;
  if (judge == 6) return register_success;
};
// 登录
router.get("/login", async (ctx, next) => {
  let { userName, passWord } = ctx.query;
  let payLoad = `where username='${userName}'`;
  let sql = QUERY_DATAS(`admin ${payLoad}`);
  let user = await query(sql);

  if (user.length == 0 || user == "undefined") {
    let resCode = getResCode(1);
    let json = JSON.stringify(resCode);
    ctx.body = json;
    return;
  }
  if (user[0].passWord === passWord) {
    let { code, message } = getResCode(0);
    let response = new User(code, message);
    response.id = `${user[0].id}`;
    response.role = `${user[0].role}`;
    response.trueName = `${user[0].trueName}`;
    response.userName = `${user[0].userName}`;
    let json = JSON.stringify(response);
    ctx.body = json;
  } else {
    let resCode = getResCode(2);
    let json = JSON.stringify(resCode);
    ctx.body = json;
  }
  next();
});

//注册
//searchUser
router.get("/searchUser", async (ctx, next) => {
  let { trueName, userName } = ctx.query;
  let payLoad = `where username='${userName}' or truename ='${trueName}'`;
  let sql = QUERY_DATAS(`admin ${payLoad}`);
  let resultCount = await query(sql);

  if (resultCount.length == 0 || resultCount == "undefined") {
    let resCode = getResCode(3);
    let json = JSON.stringify(resCode);
    ctx.body = json;
  } else {
    let resCode= getResCode(4);
    let json = JSON.stringify(resCode);
    ctx.body = json;
  }

  next();
});
//register
router.get("/register", async (ctx, next) => {
  let { trueName, nickName, address, userName, passWord } = ctx.query;
  let colums_payLoad = `trueName,nickName,address,userName,passWord,role`;
  let values_payLoad = `'${trueName}', '${nickName}', '${address}', '${userName}', '${passWord}','2'`;
  let sql = INSERT_DATA('admin',colums_payLoad, values_payLoad);
  console.log(sql);
  let resultCount = await query(sql);
  if (resultCount == 0) {
    let resCode = getResCode(5);
    let json = JSON.stringify(resCode);
    ctx.body = json;
    return;
  } else {
    let resCode = getResCode(6);
    let json = JSON.stringify(resCode);
    ctx.body = json;
  }
  next();
});

module.exports = router;
