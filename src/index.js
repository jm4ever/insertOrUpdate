const express = require('express');
const { insertOrUpdate } = require('./controller/insertOrUpdate');
const { logger } = require('./utils/logger');
const { port } = require('./config/server');

const app = express();

// 解析JSON请求体
app.use(express.json());

// 处理insertOrUpdate请求
app.post('/insertOrUpdate', async (req, res) => {
    try {
        const result = await insertOrUpdate(req.body);
        res.json(result);
    } catch (error) {
        logger.error('处理请求失败:', error);
        res.status(500).json({
            success: false,
            error_code: 0,
            error_msg: error.message
        });
    }
});

// 启动服务器
app.listen(port, () => {
    logger.info(`服务已启动，监听端口 ${port}`);
});