const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');

// 从配置文件加载配置
function loadConfig() {
    try {
        // 首先尝试从项目根目录读取配置文件
        const configPath = path.resolve(process.cwd(), 'config.json');
        if (fs.existsSync(configPath)) {
            logger.info(`从配置文件加载配置: ${configPath}`);
            const configData = fs.readFileSync(configPath, 'utf8');
            const config = JSON.parse(configData);
            return {
                appConfigs: config.apps || {},
                tableMapping: config.tables || {}
            };
        }
    } catch (error) {
        logger.error('加载配置文件失败:', error);
    }
    
    // 如果配置文件不存在或读取失败，抛出错误
    logger.error('未找到配置文件或读取失败，无法启动服务');
    throw new Error('未找到配置文件或读取失败，请确保config.json文件存在且格式正确');
}

// 加载配置
const { appConfigs, tableMapping } = loadConfig();

/**
 * 根据表名获取完整的API配置
 * @param {string} tableName 表名
 * @returns {Object} 包含worksheetId和apiConfig的对象
 */
function getTableConfig(tableName) {
    // 确保tableName是字符串
    if (typeof tableName !== 'string') {
        throw new Error(`表名必须是字符串，当前类型: ${typeof tableName}, 值: ${JSON.stringify(tableName)}`);
    }
    
    const tableConfig = tableMapping[tableName];
    if (!tableConfig) {
        throw new Error(`未找到表 "${tableName}" 的映射配置，请检查表名是否正确`);
    }
    
    const appConfig = appConfigs[tableConfig.appId];
    if (!appConfig) {
        throw new Error(`未找到应用 ${tableConfig.appId} 的配置`);
    }
    
    return {
        worksheetId: tableConfig.worksheetId,
        apiConfig: appConfig
    };
}

module.exports = {
    tableMapping,
    getTableConfig,
    // 为了向后兼容，保留apiConfig导出
    apiConfig: appConfigs.default
};