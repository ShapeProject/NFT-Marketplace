require('dotenv').config();
const express = require('express');
const app = express();
const log4js = require('log4js');
const generateCode = require('./../lib/generateCode');
// 暗号化用のモジュールを読み込む
const crypto = require('crypto');
const https = require('https');

// get contants 
const {
  API_ENDPOINT
} = require('./../utils/constants');

// log4jsの設定
log4js.configure('./log/log4js_setting.json');
const logger = log4js.getLogger("server");

// get Mnemonic code
const {
  SLASH_AUTH_TOKEN,
  SLASH_HASH_TOKEN,
} = process.env

app.use(express.json());

// 最新のオーダーコード
var order_code = '';

////////////////////////////////////////////////////////////
// APIの定義
////////////////////////////////////////////////////////////

/**
 * 決済用のURLを発行するAPI
 * @param amount 総金額
 * @param amount_type 法定通貨の種類
 * @param ext_reserved エンコードされたデータ
 * @param ext_description 決済時に出力する説明文
 */
app.post('/api/generateUrl', async(req, res) => {
  logger.log("決済用のURLを発行するAPI開始");

  // get amount & encode
  var amount_to_be_charged = req.query.amount;
  var amount_type = req.query.amount_type;
  var ext_reserved = req.query.ext_reserved;
  var ext_description = req.query.ext_description;

  // generate order code
  const order_code = generateCode();
  // generate verify token
  const raw = `${order_code}::${amount_to_be_charged.toFixed(2)}::${SLASH_HASH_TOKEN}`;
  const verify_byte = crypto.createHash('sha256').update(raw).digest();
  const verify_token = Buffer.from(verify_byte).toString('hex');

  // POST params
  const params = `identification_token=${SLASH_AUTH_TOKEN}&order_code=${order_code}&verify_token=${verify_token}&amount=${amount_to_be_charged.toFixed(2)}&amount_type=${amount_type}&ext_reserved=${ext_reserved}&ext_description=${ext_description}`;
  
  // POST config
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': params.length
    }
  };

  var payment_url;

  // request
  const requet = https.request(API_ENDPOINT, options, (response) => {
    let result = '';

    response.on('data', (chunk) => {
      result += chunk;
    });

    response.on('end', () => {
      const obj = JSON.parse(result);
      payment_url = obj.url;
      logger.log(`The URL is: ${payment_url}`);
    });
  });
  
  requet.on('error', (error) => {
    logger.log("決済用のURLを発行するAPI終了");
    res.set({ 'Access-Control-Allow-Origin': '*' });
    res.json({ result: 'fail' });
  });
  
  requet.write(params);
  requet.end();

  logger.log("決済用のURLを発行するAPI終了");
  res.set({ 'Access-Control-Allow-Origin': '*' });
  res.json({ result: payment_url });
});

module.exports = {
  app,
  logger
};