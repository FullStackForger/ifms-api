var date = module.exports = {},
	Moment = require('moment');

date.startOfToday = parseInt(Moment().startOf('day').format('YYMMDD'));
date.startOfTheWeek = parseInt(Moment().startOf('week').format('YYMMDD'));
date.startOfTheMonth = parseInt(Moment().startOf('month').format('YYMMDD'));