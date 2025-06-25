# Cloudflare

将你的数据存储到 [Cloudflare KV](https://www.cloudflare-cn.com/developer-platform/products/workers-kv/) 中。

优点：白嫖 1G 存储空间，KV 大小限制更大(key: 0.5Kb, value: 25Mb)
缺点：没有梯子大概率无法访问

## 快速开始

### 创建 KV 命名空间和 workers

进入[控制台](https://dash.cloudflare.com)，找到`存储和数据库` - `KV`，创建一个命名空间。

完成之后进入 `计算(Workers)` - `Workers 和 Pages`，创建一个 Workers，选择 `导入现有库`，之后导入下面的连接:

```text
https://github.com/vudsen/CloudSync/tree/master/template/cloudflare
```

### 绑定变量

点击刚才创建的 Worker，进入页面后点击 `绑定` - `创建绑定`，找到 `KV 命名空间`。

点击后有两个参数：
- 变量名称：固定为 `CloudSync`，不可以修改！
- KV 命名空间：你刚才创建的命名空间

---

上面的方式不是持久化的，在你每次部署后都会丢失，你需要修改配置文件以持久化。

在你导入开源项目后， cloudflare 会在你自己的 Github 账号上创建一个对应的仓库，此时我们修改 `wrangler.jsonc` 添加如下配置:

```json
{
	"kv_namespaces": [
		{
			"binding": "CloudSync",
			"id": "<kv_namespace_id>"
		}
	]
}
```

### 设置访问秘钥

进入 Worker 的设置，点击 `变量和机密`，添加一个机密，名称为 `Token`，值为秘钥，请根据情况填写。
