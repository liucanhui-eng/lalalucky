# 前端启动本地调试文档 


* 首次启动：所有命令都在项目根目录下执行
```bash
npm i
dfx start --clean --background
dfx deploy
npm run start
```

* 已启动，重置服务

```bash
dfx stop
dfx killall
dfx start --clean --background
dfx deploy
npm run start
```


* 本地与链上调试

```bash
# 访问测试环境
npm run start:test
# 访问生产环境
npm run start:prod
```