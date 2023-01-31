这是一个通过
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)
创建的一个人博客系统。

# 如何使用
### 1. fork本仓库,并克隆到本地
### 2. 开始使用

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

# 如何新建文章
```shell
yarn create
```
根据提示，输入文章分类，标题等信息。

最后会在目录_posts下生成刚才的文章_posts/xxx/xxx/xxx.md

# 如何自动发布
### 1. 新建仓库{username}.github.io
username就是自己的github账号，这里替换成自己的用户名即可。

后面的{username}同理。

### 2. 创建access token
user>setting>Developer settings>[Personal access tokens](https://github.com/settings/tokens)

新建一个token，记下这个token，不要丢失，一会儿要用到。

### 3. 添加access token
myGitPage>setting>Secrets and variables>[Action](https://github.com/{username}/git-page/settings/secrets/actions)

点击 New repository secret

```yaml
# 就是.github/workflows/gh-pages.yml中的{secrets.ACTIONS_DEPLOY_KEY}，也可以自己起其他名字。
name: 'ACTIONS_DEPLOY_KEY' 
Secret: 'token' # 刚才创建的token
```
这一步的目的是：

让工作流gh-pages.yml构建执行完成后，可以有权限把代码从`myGitPage`仓库push到`{username}.github.io`中

### 4. 修改.github/workflow/gh-pages.yml
把 gh-pages.yml中的{username}改成自己的用户名

ACTIONS_DEPLOY_KEY变量会自动获取刚才设置的token

### 5. 创建分支publish
给 `myGitPage` 创建一个新的分支 `publish` 用于触发工gh-pages.yml作流的执行。

### 6. 最后
把 `myGitPage` 代码从`master/main`分支merge到`publish`，并push，稍等几分钟，就可以看到自己的博客了：

[my blog](https://{username}.github.io)

# 其他扩展
可以自行修改lib/api.mjs来实现高级功能

如果不想他人看到自己的原始博客源码，可以将`myGitPage`仓库设置为私有即可，不影响后续流程。
