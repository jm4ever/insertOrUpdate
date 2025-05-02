FROM node:18.17-alpine

# 设置淘宝npm镜像，加速依赖安装
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com

WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 只复制必要的源代码和配置文件
COPY src/ ./src/
COPY config.json ./
COPY .env* ./

# 确保日志目录存在
RUN mkdir -p log

# 暴露端口
EXPOSE 3168

# 启动应用
CMD ["npm", "start"]