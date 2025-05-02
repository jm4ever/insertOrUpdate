const axios = require('axios');
const NodeCache = require('node-cache');
const { getTableConfig } = require('../config/tableMapping');
const { logger } = require('../utils/logger');

// 创建缓存实例，默认缓存时间1小时
const cache = new NodeCache({ stdTTL: 3600 });

/**
 * 根据API配置创建axios实例
 * @param {Object} apiConfig API配置
 * @returns {Object} axios实例
 */
function getApiInstance(apiConfig) {
    return axios.create({
        baseURL: apiConfig.baseUrl,
        timeout: 10000
    });
}

/**
 * 获取工作表结构
 * @param {string} tableName 表名
 * @returns {Promise<Object>} 工作表结构信息
 */
async function getWorksheetInfo(tableName) {
    // 获取表配置
    const { worksheetId, apiConfig } = getTableConfig(tableName);
    const cacheKey = `worksheet_${worksheetId}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
        return cachedData;
    }

    try {
        logger.info(`获取工作表结构，表名: ${tableName}, worksheetId: ${worksheetId}`);
        const api = getApiInstance(apiConfig);
        const response = await api.post('/worksheet/getWorksheetInfo', {
            appKey: apiConfig.appKey,
            sign: apiConfig.sign,
            worksheetId
        });

        if (!response.data.success) {
            throw new Error(response.data.error_msg || '获取工作表结构失败');
        }

        cache.set(cacheKey, response.data.data);
        return response.data.data;
    } catch (error) {
        logger.error(`获取工作表结构失败，表名: ${tableName}, worksheetId: ${worksheetId}:`, error);
        throw error;
    }
}

/**
 * 新增数据行
 * @param {string} tableName 表名
 * @param {Array} controls 控件数据
 * @returns {Promise<Object>} 新增结果
 */
async function addRow(tableName, controls) {
    // 获取表配置
    const { worksheetId, apiConfig } = getTableConfig(tableName);
    
    try {
        logger.info(`新增数据，表名: ${tableName}, worksheetId: ${worksheetId}`);
        const api = getApiInstance(apiConfig);
        const response = await api.post('/worksheet/addRow', {
            appKey: apiConfig.appKey,
            sign: apiConfig.sign,
            worksheetId,
            triggerWorkflow: true,
            controls
        });

        if (!response.data.success) {
            throw new Error(response.data.error_msg || '新增数据失败');
        }

        return response.data;
    } catch (error) {
        logger.error(`新增数据失败，表名: ${tableName}, worksheetId: ${worksheetId}:`, error);
        throw error;
    }
}

/**
 * 更新数据行
 * @param {string} tableName 表名
 * @param {string} rowId 行记录ID
 * @param {Array} controls 控件数据
 * @returns {Promise<Object>} 更新结果
 */
async function editRow(tableName, rowId, controls) {
    // 获取表配置
    const { worksheetId, apiConfig } = getTableConfig(tableName);
    
    try {
        logger.info(`更新数据，表名: ${tableName}, worksheetId: ${worksheetId}, rowId: ${rowId}`);
        const api = getApiInstance(apiConfig);
        const response = await api.post('/worksheet/editRow', {
            appKey: apiConfig.appKey,
            sign: apiConfig.sign,
            worksheetId,
            triggerWorkflow: true,
            rowId,
            controls
        });

        if (!response.data.success) {
            throw new Error(response.data.error_msg || '更新数据失败');
        }

        return response.data;
    } catch (error) {
        logger.error(`更新数据失败，表名: ${tableName}, worksheetId: ${worksheetId}, rowId: ${rowId}:`, error);
        throw error;
    }
}

module.exports = {
    getWorksheetInfo,
    addRow,
    editRow
};