//app.js
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");
const port = 8091;

let app = new Koa();

app.use(cors()); //koa-cors解决跨域
app.use(bodyParser()); //解析post参数

const dealUser = require("./router/user");
const dealBill = require("./router/bill");

app.use(dealUser.routes());
app.use(dealBill.routes());

app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

app.listen(port, () => {
  console.log("server at where http://localhost:8091");
});
