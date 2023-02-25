
/**
 * order_codeのための乱数を生成するメソッド
 */
const generateCode = (logger) => {
      // 生成
      const randomCode = Math.random().toString(36).substring(2, 10);
      logger.debug("randomCode", ランダムコード);
      return randomCode;
};

module.exports = {
      generateCode
}