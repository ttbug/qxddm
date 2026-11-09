var body = $response.body.replace(/vip":\d+/g, 'vip":1').replace(/vipReal":\d+/g, 'vipReal":1').replace(/svip":\d+/g, 'svip":1').replace(/vipEnd":".*?"/g, 'vipEnd":"2099-12-12"').replace(/vipEndReal":".*?"/g, 'vipEndReal":"2099-12-12"').replace(/svipEnd":".*?"/g, 'svipEnd":"2099-12-12"').replace(/svipType":\d+/g, 'svipType":1');
$done({body});
