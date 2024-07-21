# NSGM CLI PROJECT

## 命令
- npm run init    初始化项目
- npm run upgrade 升级项目基础文件
- npm run create  创建模板页面
- npm run delete  删除模板页面
- npm run dev     开发模式
- npm run start   生产模式
- npm run build   编译
- npm run export  导出静态页面
        
## 参数
- dictionary: 在 export/init 的时候使用, 默认 webapp, 譬如: npm run init|export dictionary=webapp 或者 npm run init|export webapp
- controller: 在 create/delete 的时候使用， 必须有。譬如： npm run create|delete math
- action:     在 create/delete 的时候使用， 默认 manage, 跟在 controller 后面， 譬如 npm run create|delete math test
