const { getTableConfig } = require('../config/tableMapping');
const { getWorksheetInfo, addRow, editRow } = require('../services/mingdaoyunApi');
const { logger } = require('../utils/logger');

/**
 * 构造控件数据
 * @param {Object} worksheetInfo 工作表结构信息
 * @param {Object} data 传入的数据
 * @returns {Array} 控件数据数组
 */
function buildControls(worksheetInfo, data) {
    const controls = [];
    
    for (const control of worksheetInfo.controls) {
        const value = data[control.controlName];
        if (value !== undefined) {
            controls.push({
                controlId: control.controlId,
                value: String(value) // 确保值为字符串类型
            });
        }
    }

    return controls;
}

/**
 * 处理数据新增或更新
 * @param {Object} params 请求参数
 * @returns {Promise<Object>} 处理结果
 */
async function insertOrUpdate(params) {
    const { tableName, rowId, data } = params;
    
    // 检查tableName是否为字符串
    if (typeof tableName !== 'string') {
        throw new Error(`表名必须是字符串，当前类型: ${typeof tableName}, 值: ${JSON.stringify(tableName)}`);
    }
    
    // 记录请求参数
    logger.info(`接收到请求: tableName=${tableName}, rowId=${rowId || '无'}, 数据字段数=${Object.keys(data).length}`);
    

    // 1. 获取工作表结构
    const worksheetInfo = await getWorksheetInfo(tableName);

    // 3. 构造控件数据
    const controls = buildControls(worksheetInfo, data);

    // 4. 根据rowId判断是新增还是更新
    if (!rowId) {
        // 新增操作
        logger.info(`开始新增数据，表名: ${tableName}`);
        const result = await addRow(tableName, controls);
        logger.info(`新增数据成功，表名: ${tableName}, 新记录ID: ${result.data}`);
        // 格式化返回结果，确保符合规范
        return {
            success: true,
            error_code: 1,
            data: {
                rowId: result.data
            }
        };
    } else {
        // 更新操作
        logger.info(`开始更新数据，表名: ${tableName}, rowId: ${rowId}`);
        await editRow(tableName, rowId, controls);
        logger.info(`更新数据成功，表名: ${tableName}, rowId: ${rowId}`);
        return {
            success: true,
            error_code: 1
        };
    }
}

module.exports = {
    insertOrUpdate
};