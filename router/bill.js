/*jshint esversion: 6 */
const router = require("koa-router")();

const { query } = require("../mysql/query"); //引入封装好的异步查询方法
const { QUERY_DATAS, INSERT_DATA } = require("../mysql/sql"); //部分引入sql库

router.prefix("/bill"); //路由前缀

let getResCode = (judge) => {
  let getAllBills_success = { code: "10010", message: "success" };
  let getAllBills_faild = { code: "10011", message: "failed" };

  if (judge == 0) return getAllBills_success;
  if (judge == 1) return getAllBills_faild;
};
// getAllBills
router.get("/getAllBills", async (ctx, next) => {
  let payLoad = `bill order by id desc`;
  let sql = QUERY_DATAS(payLoad);
  let res = await query(sql);
  let response = { bill: res };
  let json = JSON.stringify(response);
  ctx.body = json;
  next();
});

//setBill
router.get("/setBill", async (ctx, next) => {
  let {
    event,
    amount,
    amountCode,
    eventDate,
    submitterId,
    submitterTrueName,
    submitterUserName,
  } = ctx.query;
  let colums_payLoad = `event,amount,amountCode,eventDate,submitterId,submitterTrueName,submitterUserName`;
  let values_payLoad = `'${event}', '${amount}', '${amountCode}', '${eventDate}', '${submitterId}','${submitterTrueName}','${submitterUserName}'`;
  let sql = INSERT_DATA("bill", colums_payLoad, values_payLoad);
  let resultCount = await query(sql);

  if (resultCount.length == 0 || resultCount == "undefined") {
    let resCode = getResCode(1);
    let json = JSON.stringify(resCode);
    ctx.body = json;
    return;
  } else {
    let resCode = getResCode(0);
    let json = JSON.stringify(resCode);
    ctx.body = json;
  }
  next();
});
//getBillsByDate
router.get("/getBillsByDate", async (ctx, next) => {
  let { eventDate } = ctx.query;
  let payLoad = `bill where eventDate like '${eventDate}'`;
  let sql = QUERY_DATAS(payLoad);
  let res = await query(sql);
  let response = { bill: res };
  let json = JSON.stringify(response);
  ctx.body = json;
  next();
});

module.exports = router;
