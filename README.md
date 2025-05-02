# 明道云数据新增或更新服务

## 项目说明

本服务提供了一个API接口，用于向明道云平台新增或更新数据。服务会根据传入的参数，自动判断是新增还是更新操作。

## 配置说明

### 配置文件

项目使用`config.json`作为配置文件，**此配置文件必须存在且格式正确，否则服务将无法启动**。配置文件包含以下内容：

```json
{
  "apps": {
    "default": {
      "baseUrl": "http://47.94.3.222:3168/api/v2/open",
      "appKey": "88f51dc127d40d50",
      "sign": "ZjM4ZDE3MThiNGZhMzExMjMwNmFhZDZlZTZmZDZiMmNmMzBhNTNmYzhmZDBlZmVkNzM1N2YxNDkxZDdmY2Q4OQ=="
    }
  },
  "tables": {
    "user": {
      "worksheetId": "yonghubiao",
      "appId": "default"
    }
  }
}
```

### 配置项说明

- `apps`: 应用配置信息，不同应用有不同的appKey和sign
  - `baseUrl`: 明道云API基础URL
  - `appKey`: 应用的appKey
  - `sign`: 应用的签名

- `tables`: 工作表映射配置，包含worksheetId和所属的appId
  - `worksheetId`: 工作表ID
  - `appId`: 所属应用ID，对应apps中的配置

## 在容器中使用

### 使用Docker运行

```bash
docker build -t mingdaoyun-insert-or-update .
docker run -p 3168:3168 -v $(pwd)/config.json:/app/config.json mingdaoyun-insert-or-update
```

### 修改配置

在容器环境中，您可以通过以下方式修改配置：

1. **挂载配置文件**（推荐）

   创建自定义的`config.json`文件，然后在启动容器时挂载：

   ```bash
   docker run -p 3168:3168 -v /path/to/your/config.json:/app/config.json mingdaoyun-insert-or-update
   ```

2. **构建自定义镜像**

   修改`config.json`文件后重新构建镜像：

   ```bash
   docker build -t mingdaoyun-insert-or-update:custom .
   docker run -p 3168:3168 mingdaoyun-insert-or-update:custom
   ```

## API使用说明

### 接口地址

```
POST http://localhost:3168/insertOrUpdate
```

### 请求参数

```json
{
    "tableName": "user",
    "rowId": "472453f5-9df2-4bc8-9d3f-7c2e3611f0ba", // 可选，有值为更新，无值为新增
    "data": {
        "姓名": "张三",
        "年龄": 18,
        "性别": "男",
        "地址": "北京市"
    }
}
```

### 返回结果

新增成功：

```json
{
    "success": true,
    "error_code": 1,
    "data": {
        "rowId": "新记录ID"
    }
}
```

更新成功：

```json
{
    "success": true,
    "error_code": 1
}
```

操作失败：

```json
{
    "success": false,
    "error_code": 0,
    "error_msg": "错误信息"
}
```