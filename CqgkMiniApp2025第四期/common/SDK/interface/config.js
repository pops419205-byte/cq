const current = 'prod';
const profiles = {
	'dev': {
		'online': true,
		'baseURL': 'https://cy.ysfwgroup.cn', //开发环境地址
		'timeout': 600000 //超时时间
	},
	'prod': {
		'online': false,
		'baseURL': 'https://cy.ysfwgroup.cn', //生产环境地址
		'timeout': 600000 //超时时间
	},

};
//http://183.230.164.36:47688
// https: //cy.klwsxx.com  https://cy.klwsxx.com    https://cy.klwsxx.com
console.log("profiles--", profiles)
export const baseURL = profiles[current].baseURL;
export const timeout = profiles[current].timeout;


// --------------------------------------------------
// https://459zz5195vw7.vicp.fun
//https://cy.ysfwgroup.cn/

// const current = 'prod';
// const profiles = {
// 	'dev': {
// 		'online': true,
// 		'baseURL': 'https://cy.youbang.biz', //开发环境地址
// 		'timeout': 60000 //超时时间
// 	},
// 'prod': {
// 	'online': false,
// 	'baseURL': 'https://cy.klwsxx.com', //生产环境地址
// 	'timeout': 60000 //超时时间
// },

// };
// //http://183.230.164.36:47688
// // https://cy.klwsxx.com  https://cy.klwsxx.com    https://cy.klwsxx.com
// export const baseURL = profiles[current].baseURL;
// export const timeout = profiles[current].timeout;