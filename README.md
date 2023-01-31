这是一个通过
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)
创建的一个人博客系统。

# 如何使用
### 1. fork本仓库
### 2.创建项目 {username}.github.io 项目
项目名必须用自己的`github用户名+.github.io`
### 3. 把fork后的仓库克隆到本地
### 4. 开始使用

```shell
# 进入fork的项目
cd myGitPage

# 安装依赖
yarn install
# 或
pnpm install

# 启动项目
yarn dev
```

### 5. 创建文章
```shell
yarn create
```
根据提示，输入文章分类，标题等信息。

最后会在目录_posts下生成刚才的文章_posts/xxx/xxx/xxx.md

# 其他扩展
可以自行修改lib/api.mjs来实现高级功能
