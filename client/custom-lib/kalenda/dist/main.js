var $cw6c3$swchelpers = require("@swc/helpers");
var $cw6c3$reactjsxruntime = require("react/jsx-runtime");
var $cw6c3$react = require("react");
var $cw6c3$regeneratorruntime = require("regenerator-runtime");
var $cw6c3$luxon = require("luxon");
var $cw6c3$kalendlayout = require("kalend-layout");
var $cw6c3$kalendlayoutconstants = require("kalend-layout/constants");

function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "CalendarView", function () { return $3f7b2fe5d2c34f8f$export$b573856c46cc9357; });
$parcel$export(module.exports, "getNewCalendarDaysHelper", function () { return $3f7b2fe5d2c34f8f$export$b6e764c50c031f2a; });
$parcel$export(module.exports, "default", function () { return $3f7b2fe5d2c34f8f$export$2e2bcd8739ae039; });


var $e4750b0ebeed8e48$export$ec9758e21af63072;
(function($e4750b0ebeed8e48$export$ec9758e21af63072) {
    $e4750b0ebeed8e48$export$ec9758e21af63072["AGENDA"] = 'agenda';
    $e4750b0ebeed8e48$export$ec9758e21af63072["WEEK"] = 'week';
    $e4750b0ebeed8e48$export$ec9758e21af63072["DAY"] = 'day';
    $e4750b0ebeed8e48$export$ec9758e21af63072["THREE_DAYS"] = 'threeDays';
    $e4750b0ebeed8e48$export$ec9758e21af63072["MONTH"] = 'month';
})($e4750b0ebeed8e48$export$ec9758e21af63072 || ($e4750b0ebeed8e48$export$ec9758e21af63072 = {}));
var $e4750b0ebeed8e48$export$76a2e4c433c23bb9;
(function($e4750b0ebeed8e48$export$76a2e4c433c23bb9) {
    $e4750b0ebeed8e48$export$76a2e4c433c23bb9["NORMAL"] = 'normal';
    $e4750b0ebeed8e48$export$76a2e4c433c23bb9["MONTH"] = 'month';
    $e4750b0ebeed8e48$export$76a2e4c433c23bb9["AGENDA"] = 'agenda';
    $e4750b0ebeed8e48$export$76a2e4c433c23bb9["HEADER"] = 'header';
    $e4750b0ebeed8e48$export$76a2e4c433c23bb9["SHOW_MORE_MONTH"] = 'showMoreMonth';
})($e4750b0ebeed8e48$export$76a2e4c433c23bb9 || ($e4750b0ebeed8e48$export$76a2e4c433c23bb9 = {}));
var $e4750b0ebeed8e48$export$c2bed76d77ee7287;
(function($e4750b0ebeed8e48$export$c2bed76d77ee7287) {
    $e4750b0ebeed8e48$export$c2bed76d77ee7287["FORWARD"] = 'forward';
    $e4750b0ebeed8e48$export$c2bed76d77ee7287["BACKWARDS"] = 'backwards';
    $e4750b0ebeed8e48$export$c2bed76d77ee7287["TODAY"] = 'today';
})($e4750b0ebeed8e48$export$c2bed76d77ee7287 || ($e4750b0ebeed8e48$export$c2bed76d77ee7287 = {}));
var $e4750b0ebeed8e48$export$5a05f7ffc0500403;
(function($e4750b0ebeed8e48$export$5a05f7ffc0500403) {
    $e4750b0ebeed8e48$export$5a05f7ffc0500403["MONDAY"] = "MONDAY";
    $e4750b0ebeed8e48$export$5a05f7ffc0500403["SUNDAY"] = "SUNDAY";
    $e4750b0ebeed8e48$export$5a05f7ffc0500403["UNKNOWN"] = "UNKNOWN";
})($e4750b0ebeed8e48$export$5a05f7ffc0500403 || ($e4750b0ebeed8e48$export$5a05f7ffc0500403 = {}));
var $e4750b0ebeed8e48$export$c4e1e4e065ff5bd8;
(function($e4750b0ebeed8e48$export$c4e1e4e065ff5bd8) {
    $e4750b0ebeed8e48$export$c4e1e4e065ff5bd8["H_24"] = '24';
    $e4750b0ebeed8e48$export$c4e1e4e065ff5bd8["H_12"] = '12';
})($e4750b0ebeed8e48$export$c4e1e4e065ff5bd8 || ($e4750b0ebeed8e48$export$c4e1e4e065ff5bd8 = {}));









var $88a08af890f49243$export$eae15a231de23f4a = 25;
var $88a08af890f49243$export$fd6e3e2f92ae10fd = 1;
var $88a08af890f49243$export$c1af425794ec7f44 = 5;
var $88a08af890f49243$export$b4e2ba6756dec2c = 8;
var $88a08af890f49243$export$25973911efc96b71 = 40;
var $88a08af890f49243$export$447c5938f45c45a5 = 40;
var $88a08af890f49243$export$1c9a1263a0d343f4 = 40;
var $88a08af890f49243$export$81f0fddb54debad3 = 60;
var $88a08af890f49243$export$27633cf363057263 = 25;
var $88a08af890f49243$export$4b16cd32b50218c6 = 14;
var $88a08af890f49243$export$9a6bb2acef5e644a = 15;
var $88a08af890f49243$export$418e7590fd81e209 = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23', 
];





//
// Support for local datetime, timezones and floating times
//
var $28306200f69a6328$var$FLOATING_DATETIME = 'floating'; // fixed datetime without timezone
var $28306200f69a6328$var$UTC_TIMEZONE = 'UTC';
var $28306200f69a6328$export$64d4bb1347f411e8 = function(date, zone, deviceTimezone) {
    var dateString = typeof date === 'string' ? date : date.toString();
    var isFloatingDatetime = zone === $28306200f69a6328$var$FLOATING_DATETIME;
    // Adjust date with timezone so when converted to UTC it represents correct value with fixed time
    if (isFloatingDatetime) {
        var dateFloating = $cw6c3$luxon.DateTime.fromISO(dateString, {
            zone: $28306200f69a6328$var$UTC_TIMEZONE
        });
        return dateFloating.toUTC().toISO();
    }
    var thisDate = $cw6c3$luxon.DateTime.fromISO(dateString);
    // Adjust datetime to device timezone
    if (deviceTimezone) {
        var dateConvert = thisDate.setZone(zone);
        return dateConvert.setZone(deviceTimezone).toString();
    }
    return thisDate.setZone(zone).toString();
};
var $28306200f69a6328$export$6c2618c4afcf6cfb = function(date, zone, deviceTimezone) {
    var dateString = typeof date === 'string' ? date : date.toString();
    var isFloatingDatetime = zone === $28306200f69a6328$var$FLOATING_DATETIME;
    // Adjust date with timezone so when converted to UTC it represents correct value with fixed time
    if (isFloatingDatetime) {
        var dateFloating = $cw6c3$luxon.DateTime.fromISO(dateString, {
            zone: $28306200f69a6328$var$UTC_TIMEZONE
        });
        return dateFloating.toUTC();
    }
    var thisDate = $cw6c3$luxon.DateTime.fromISO(dateString);
    if (!zone) {
        // Adjust datetime to device timezone
        if (deviceTimezone) return thisDate.setZone(deviceTimezone);
        else return thisDate;
    }
    return thisDate.setZone(zone);
};


var $bf7b38bce41ca3dd$export$b7a9dbebc395fc65 = function(className, isDark) {
    return isDark ? "".concat(className, "-dark") : className;
};
var $bf7b38bce41ca3dd$export$5f81845c2fa0b381 = function(className, isMobile) {
    return isMobile ? "".concat(className, "-mobile") : className;
};
var $bf7b38bce41ca3dd$export$cf733e3bd5432c08 = function(className, isMobile, isDark) {
    var classNameParsed = className;
    classNameParsed = isMobile ? "".concat(classNameParsed, "-mobile") : classNameParsed;
    classNameParsed = isDark ? "".concat(classNameParsed, "-dark") : classNameParsed;
    return classNameParsed;
};
var $bf7b38bce41ca3dd$export$f5a7c490b6f9fbc4 = function(dateObj) {
    return dateObj.isValid ? dateObj.toFormat('dd-MM-yyyy') : $cw6c3$luxon.DateTime.fromISO(dateObj).toFormat('dd-MM-yyyy');
};
var $bf7b38bce41ca3dd$export$6a8d31c8b7f17aa5 = function(dateObj) {
    return dateObj.toFormat('dd-MM-yyyy');
};
var $bf7b38bce41ca3dd$export$76c69f043295405f = function(calendarView) {
    if (calendarView === $e4750b0ebeed8e48$export$ec9758e21af63072.THREE_DAYS || calendarView === $e4750b0ebeed8e48$export$ec9758e21af63072.DAY || calendarView === $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK) return $88a08af890f49243$export$447c5938f45c45a5;
    return 0;
};
var $bf7b38bce41ca3dd$export$4be7a748c9766cf9 = function(array) {
    return array[0];
};
var $bf7b38bce41ca3dd$export$126fc096895fc6f5 = function(array) {
    return array[array.length - 1];
};
var $bf7b38bce41ca3dd$export$3643189503061f69 = function(date) {
    return date.set({
        hour: 0,
        minute: 0,
        second: 0
    }).toUTC().toString();
};
var $bf7b38bce41ca3dd$export$a7827c78319dafc9 = function(date) {
    return date.set({
        hour: 23,
        minute: 59,
        second: 59
    }).toUTC().toString();
};
var $bf7b38bce41ca3dd$export$23783ea7bfe28abd = function(item) {
    if (!item) return false;
    return(// @ts-ignore
    $28306200f69a6328$export$6c2618c4afcf6cfb(item.endAt, item.timezoneStartAt).diff($28306200f69a6328$export$6c2618c4afcf6cfb(item.startAt, item.timezoneStartAt), 'days').toObject().days > 1);
};
var $bf7b38bce41ca3dd$export$205aaf06acb1c5fc = function(calendarView, translations) {
    switch(calendarView){
        case $e4750b0ebeed8e48$export$ec9758e21af63072.AGENDA:
            return translations['buttons']['agenda'];
        case $e4750b0ebeed8e48$export$ec9758e21af63072.DAY:
            return translations['buttons']['day'];
        case $e4750b0ebeed8e48$export$ec9758e21af63072.THREE_DAYS:
            return translations['buttons']['threeDays'];
        case $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK:
            return translations['buttons']['week'];
        case $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH:
            return translations['buttons']['month'];
        default:
            return '';
    }
};
var $bf7b38bce41ca3dd$export$e3e4ea182aca355e = function(calendarView) {
    switch(calendarView){
        case $e4750b0ebeed8e48$export$ec9758e21af63072.AGENDA:
            return $e4750b0ebeed8e48$export$ec9758e21af63072.AGENDA;
        case $e4750b0ebeed8e48$export$ec9758e21af63072.DAY:
            return $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK;
        case $e4750b0ebeed8e48$export$ec9758e21af63072.THREE_DAYS:
            return $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK;
        case $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK:
            return $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK;
        case $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH:
            return $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH;
        default:
            return '';
    }
};
var $bf7b38bce41ca3dd$export$6d0e4c4a8ffb9c2b = function(events) {
    var result = [];
    if (!events) return result;
    Object.entries(events).forEach(function(keyValue) {
        var eventsItems = keyValue[1];
        result = $cw6c3$swchelpers.toConsumableArray(result).concat($cw6c3$swchelpers.toConsumableArray(eventsItems));
    });
    return result;
};
var $bf7b38bce41ca3dd$export$3d836550a1b0c60b = function(events, timezone) {
    var result = {};
    events === null || events === void 0 ? void 0 : events.forEach(function(item) {
        var dateKey = $28306200f69a6328$export$6c2618c4afcf6cfb(item.startAt, item.timezoneStartAt || timezone).toFormat('dd-MM-yyyy');
        if (result[dateKey]) result[dateKey] = $cw6c3$swchelpers.toConsumableArray(result[dateKey]).concat([
            item
        ]);
        else result[dateKey] = [
            item
        ];
    });
    return result;
};
var $bf7b38bce41ca3dd$export$b32ccbc1ca23891 = function(width, isMobile, selectedView) {
    if (selectedView === $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK || selectedView === $e4750b0ebeed8e48$export$ec9758e21af63072.DAY || selectedView === $e4750b0ebeed8e48$export$ec9758e21af63072.THREE_DAYS) {
        if (isMobile && ('ontouchstart' in window || window.navigator.maxTouchPoints)) return width;
        else return width - $88a08af890f49243$export$9a6bb2acef5e644a;
    }
    return width;
};
var $bf7b38bce41ca3dd$export$d9b78e6f3f437c1f = function(timeFormat) {
    var result = [];
    if (timeFormat === $e4750b0ebeed8e48$export$c4e1e4e065ff5bd8.H_24) {
        for(var i = 0; i < 24; i++)if (i < 10) result.push("0".concat(i));
        else result.push(String(i));
    } else if (timeFormat === $e4750b0ebeed8e48$export$c4e1e4e065ff5bd8.H_12) for(var i1 = 0; i1 < 24; i1++){
        if (i1 < 12) result.push("".concat(i1, " AM"));
        else if (i1 === 12) result.push("".concat(i1, " PM"));
        else result.push("".concat(i1 - 12, " PM"));
    }
    return result;
};



//
// Support for local datetime, timezones and floating times
//
var $d49542164c9bae14$var$FLOATING_DATETIME = 'floating'; // fixed datetime without timezone
var $d49542164c9bae14$var$UTC_TIMEZONE = 'UTC';
var $d49542164c9bae14$export$9e6a8e9ca52f6a3d = "yyyy-MM-dd HH:mm:ss 'Z'";
var $d49542164c9bae14$export$b7b5db2aa6555cc1 = 'd. MMM, HH:mm';
var $d49542164c9bae14$export$45c85543ba71221d = 'd. MMMM';
var $d49542164c9bae14$export$c4e1e4e065ff5bd8 = 'HH:mm';
var $d49542164c9bae14$export$2fd089738c9b03fb = 'd. MMMM (EEEEEE)';
var $d49542164c9bae14$export$4679370298bfc65 = 'cccc';
var $d49542164c9bae14$export$1be242b518527e80 = 'ccc';
var $d49542164c9bae14$export$884cf35d3975e8b9 = 'EEEEEE';
var $d49542164c9bae14$export$7c233a6f2ca6f19e = 'd. MMMM yyyy';
var $d49542164c9bae14$export$74b2237eca26435b = 'dd-MM-yyyy';
var $d49542164c9bae14$export$64d4bb1347f411e8 = function(date, zone, deviceTimezone) {
    var dateString = typeof date === 'string' ? date : date.toString();
    var isFloatingDatetime = zone === $d49542164c9bae14$var$FLOATING_DATETIME;
    // Adjust date with timezone so when converted to UTC it represents correct value with fixed time
    if (isFloatingDatetime) {
        var dateFloating = $cw6c3$luxon.DateTime.fromISO(dateString, {
            zone: $d49542164c9bae14$var$UTC_TIMEZONE
        });
        return dateFloating.toUTC().toISO();
    }
    var thisDate = $cw6c3$luxon.DateTime.fromISO(dateString);
    // Adjust datetime to device timezone
    if (deviceTimezone) {
        var dateConvert = thisDate.setZone(zone);
        return dateConvert.setZone(deviceTimezone).toString();
    }
    return thisDate.setZone(zone).toString();
};
var $d49542164c9bae14$var$LuxonHelper = {
    parseToDateTime: function(date) {
        return typeof date === 'string' ? $cw6c3$luxon.DateTime.fromISO(date) : date;
    },
    getLastDayOfMonth: function(date) {
        var daysInMonth = date.daysInMonth;
        return date.set({
            day: daysInMonth
        });
    },
    getFirstDayOfMonth: function(date) {
        return date.set({
            day: 1
        });
    },
    isSameDay: function(dateA, dateB) {
        return dateA.year === dateB.year && dateA.month === dateB.month && dateA.day === dateB.day;
    },
    isBefore: function(dateA, dateB) {
        return $cw6c3$luxon.DateTime.fromISO(dateB).valueOf() - $cw6c3$luxon.DateTime.fromISO(dateA).valueOf() > 0;
    },
    isBeforeInDateTime: function(dateA, dateB) {
        return dateB.valueOf() - dateA.valueOf() > 0;
    },
    isBeforeAny: function(dateA, dateB) {
        var dateADateTime = $d49542164c9bae14$var$LuxonHelper.parseToDateTime(dateA);
        var dateBDateTime = $d49542164c9bae14$var$LuxonHelper.parseToDateTime(dateB);
        return dateBDateTime.valueOf() - dateADateTime.valueOf() > 0;
    },
    isToday: function(dateA) {
        var todayDate = $cw6c3$luxon.DateTime.local();
        return dateA.day === todayDate.day && dateA.month === todayDate.month && dateA.year === todayDate.year;
    },
    parseToString: function(date) {
        if (typeof date !== 'string') {
            if (date.isValid) return date.toUTC().toString();
        }
        return date.toString();
    },
    toUtcString: function(date) {
        return $cw6c3$luxon.DateTime.fromISO(date).toUTC().toISO();
    },
    toUtc: function(date) {
        return date.toUTC().toISO();
    },
    setTimezone: function(dateString, timezone) {
        return $cw6c3$luxon.DateTime.fromISO(dateString).setZone(timezone).toString();
    },
    toHumanDate: function(dateString) {
        return $cw6c3$luxon.DateTime.fromISO(dateString).toFormat('d LLL yyyy hh:mm');
    }
};
var $d49542164c9bae14$export$2e2bcd8739ae039 = $d49542164c9bae14$var$LuxonHelper;


var $1500da26cef85c66$var$ONE_DAY = 1;
var $1500da26cef85c66$var$THREE_DAYS = 3;
var $1500da26cef85c66$var$SEVEN_DAYS = 7;
var $1500da26cef85c66$export$b314e84a21bd4b5f = function(stringDate) {
    return stringDate.slice(0, stringDate.indexOf('T'));
};
var $1500da26cef85c66$export$a6181a60b480c9a4 = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24, 
];
var $1500da26cef85c66$export$418e7590fd81e209 = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23', 
];
var $1500da26cef85c66$export$b1af3e61661bd3b2 = {
    red: {
        dark: '#ef9a9a',
        light: '#e53935'
    },
    pink: {
        dark: '#f48fb1',
        light: '#d81b60'
    },
    purple: {
        dark: '#ce93d8',
        light: '#8e24aa'
    },
    'deep purple': {
        dark: '#b39ddb',
        light: '#5e35b1'
    },
    indigo: {
        dark: '#9fa8da',
        light: '#3949ab'
    },
    blue: {
        dark: '#90caf9',
        light: '#1e88e5'
    },
    'light blue': {
        dark: '#81d4fa',
        light: '#039be5'
    },
    cyan: {
        dark: '#80deea',
        light: '#00acc1'
    },
    teal: {
        dark: '#80cbc4',
        light: '#00897b'
    },
    green: {
        dark: '#a5d6a7',
        light: '#43a047'
    },
    'light green': {
        dark: '#c5e1a5',
        light: '#7cb342'
    },
    yellow: {
        dark: '#fff59d',
        light: '#fdd835'
    },
    amber: {
        dark: '#ffe082',
        light: '#ffb300'
    },
    orange: {
        dark: '#ffcc80',
        light: '#fb8c00'
    },
    'deep orange': {
        dark: '#ffab91',
        light: '#f4511e'
    },
    brown: {
        dark: '#bcaaa4',
        light: '#6d4c41'
    },
    'blue grey': {
        dark: '#b0bec5',
        light: '#546e7a'
    }
};
var $1500da26cef85c66$export$2d5ed1e6bc597003 = function(colorString, isDark) {
    return $1500da26cef85c66$export$b1af3e61661bd3b2[colorString] ? $1500da26cef85c66$export$b1af3e61661bd3b2[colorString][isDark ? 'dark' : 'light'] : colorString;
};
var $1500da26cef85c66$export$933d53aed74a6ef0 = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun'
];
var $1500da26cef85c66$export$88e7cb308ec58e48 = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat', 
];
var $1500da26cef85c66$export$737cca9a4f8febb7 = function(date) {
    return date;
};
var $1500da26cef85c66$var$calculateMondayStartWeekDay = function(date, calendarView) {
    var days = [];
    var dayInWeek = date.weekday;
    var startDate = date.minus({
        days: dayInWeek - 1
    });
    if (calendarView === $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH) {
        if (dayInWeek === 0) {
            for(var i = 6; i > 0; i--)days.push(date.minus({
                days: i
            }));
            days.push(date);
        } else {
            days.push(startDate);
            for(var i1 = 1; i1 < 7; i1++)days.push(startDate.plus({
                days: i1
            }));
        }
    } else for(var i2 = 0; i2 < 7; i2++)days.push(startDate.plus({
        days: i2
    }));
    return days;
};
var $1500da26cef85c66$var$calculateSundayStartWeekDay = function(date, calendarView) {
    var days = [];
    var dayInWeek = date.weekday;
    var startDate = dayInWeek === 7 ? date.plus({
        days: dayInWeek - 7
    }) : date.minus({
        days: dayInWeek
    });
    if (calendarView === $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH) {
        if (dayInWeek === 7) {
            for(var i = 6; i > 0; i--)days.push(date.minus({
                days: i
            }));
            days.push(date);
        } else {
            days.push(startDate);
            for(var i3 = 1; i3 < 7; i3++)days.push(startDate.plus({
                days: i3
            }));
        }
    } else for(var i4 = 0; i4 < 7; i4++)days.push(startDate.plus({
        days: i4
    }));
    return days;
};
var $1500da26cef85c66$export$69ac73875782844e = function(date, calendarView, weekDayStart, setSelectedDate) {
    // Set state
    if (setSelectedDate && calendarView !== $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH) setSelectedDate(date);
    if (weekDayStart === $e4750b0ebeed8e48$export$5a05f7ffc0500403.MONDAY) return $1500da26cef85c66$var$calculateMondayStartWeekDay(date, calendarView);
    else return $1500da26cef85c66$var$calculateSundayStartWeekDay(date, calendarView);
};
var $1500da26cef85c66$export$b34cdd4783897766 = function(date, setSelectedDate, isGoingForward) {
    var days = [];
    if (isGoingForward === null || isGoingForward === undefined) for(var i = 0; i <= 2; i++)days.push(date.plus({
        days: i
    }));
    else if (isGoingForward) for(var i5 = 1; i5 <= 3; i5++)days.push(date.plus({
        days: i5
    }));
    else for(var i6 = 3; i6 > 0; i6--)days.push(date.minus({
        days: i6
    }));
    // Set state
    if (setSelectedDate) setSelectedDate(days[1]);
    return days;
};
var $1500da26cef85c66$export$f16d393a3268e3f3 = function(calendarView) {
    switch(calendarView){
        case $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK:
            return $1500da26cef85c66$var$SEVEN_DAYS;
        case $e4750b0ebeed8e48$export$ec9758e21af63072.THREE_DAYS:
            return $1500da26cef85c66$var$THREE_DAYS;
        case $e4750b0ebeed8e48$export$ec9758e21af63072.DAY:
            return $1500da26cef85c66$var$ONE_DAY;
        default:
            return $1500da26cef85c66$var$SEVEN_DAYS;
    }
};
var $1500da26cef85c66$var$getOneDay = function(date, setSelectedDate) {
    var refDate = $1500da26cef85c66$export$737cca9a4f8febb7(date);
    // Set state
    if (setSelectedDate) setSelectedDate(refDate);
    return [
        refDate
    ];
};
var $1500da26cef85c66$export$f82b43a5dad4749 = function(refDate) {
    var firstDayInMonth = $d49542164c9bae14$export$2e2bcd8739ae039.getFirstDayOfMonth(refDate);
    var daysInMonth = refDate.daysInMonth;
    var monthDays = [];
    // Add missing days to month view
    for(var i = 0; i <= daysInMonth; i += 1){
        var day = firstDayInMonth.plus({
            days: i
        });
        monthDays.push(day);
    }
    return monthDays;
};
var $1500da26cef85c66$export$be98daea68e5bd4 = function(date, weekDayStart) {
    var FIVE_WEEKS_DAYS_COUNT = 36;
    // Get reference date for calculating new month
    // Get first week of current month
    var firstDayOfCurrentMonth = $d49542164c9bae14$export$2e2bcd8739ae039.getFirstDayOfMonth(date);
    var firstWeekOfCurrentMonth = $1500da26cef85c66$export$69ac73875782844e(firstDayOfCurrentMonth, $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK, weekDayStart, undefined);
    var monthDays = firstWeekOfCurrentMonth;
    // Add missing days to month view
    for(var i = 1; i < FIVE_WEEKS_DAYS_COUNT; i += 1){
        var day = firstWeekOfCurrentMonth[6].plus({
            days: i
        });
        monthDays.push(day);
    }
    return monthDays;
};
var $1500da26cef85c66$export$4b1bd9c645c26ec4 = function(date, setSelectedDate) {
    var monthDays = $1500da26cef85c66$export$f82b43a5dad4749(date);
    // Set state
    if (setSelectedDate) setSelectedDate(monthDays[15]);
    return monthDays;
};
var $1500da26cef85c66$export$214c174a056fc56f = function(date, setSelectedDate, weekDayStart) {
    var monthDays = $1500da26cef85c66$export$be98daea68e5bd4(date, weekDayStart);
    // Set state
    if (setSelectedDate) setSelectedDate(monthDays[15]);
    return monthDays;
};
var $1500da26cef85c66$export$431753531f5fca31 = function(item) {
    return typeof item === 'string' ? $cw6c3$luxon.DateTime.fromISO(item) : item;
};
var $1500da26cef85c66$export$89694f4f8cea7fb = function(item) {
    return typeof item === 'string' ? item : item.toString();
};
var $1500da26cef85c66$export$8abac2236d14a91f = function(oldIndex, newIndex) {
    return oldIndex === 0 && newIndex === 1 || oldIndex === 1 && newIndex === 2 || oldIndex === 2 && newIndex === 0;
};
var $1500da26cef85c66$export$77c6031193b02723 = function(calendarView) {
    switch(calendarView){
        case $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH:
            return 15;
        case $e4750b0ebeed8e48$export$ec9758e21af63072.AGENDA:
            return 15;
        case $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK:
            return 2;
        case $e4750b0ebeed8e48$export$ec9758e21af63072.THREE_DAYS:
            return 0;
        case $e4750b0ebeed8e48$export$ec9758e21af63072.DAY:
            return 0;
        default:
            return 2;
    }
};
var $1500da26cef85c66$export$e75d169fad6edf5f = function(calendarView, date, weekDayStart, setSelectedDate) {
    switch(calendarView){
        case $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK:
            return $1500da26cef85c66$export$69ac73875782844e(date, calendarView, weekDayStart, setSelectedDate);
        case $e4750b0ebeed8e48$export$ec9758e21af63072.THREE_DAYS:
            return $1500da26cef85c66$export$b34cdd4783897766(date, setSelectedDate);
        case $e4750b0ebeed8e48$export$ec9758e21af63072.DAY:
            return $1500da26cef85c66$var$getOneDay(date, setSelectedDate);
        case $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH:
            return $1500da26cef85c66$export$214c174a056fc56f(date, setSelectedDate, weekDayStart);
        case $e4750b0ebeed8e48$export$ec9758e21af63072.AGENDA:
            return $1500da26cef85c66$export$4b1bd9c645c26ec4(date, setSelectedDate);
        default:
            return $1500da26cef85c66$export$69ac73875782844e(date, calendarView, setSelectedDate);
    }
};
var $1500da26cef85c66$var$getReferenceDate = function(direction, calendarView, calendarDays) {
    if (direction === $e4750b0ebeed8e48$export$c2bed76d77ee7287.TODAY) return $cw6c3$luxon.DateTime.now();
    if (calendarView === $e4750b0ebeed8e48$export$ec9758e21af63072.THREE_DAYS) {
        if (direction === $e4750b0ebeed8e48$export$c2bed76d77ee7287.FORWARD) return $bf7b38bce41ca3dd$export$126fc096895fc6f5(calendarDays).plus({
            days: 1
        });
        else return $bf7b38bce41ca3dd$export$4be7a748c9766cf9(calendarDays).minus({
            days: 3
        });
    }
    if (calendarView === $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK || calendarView === $e4750b0ebeed8e48$export$ec9758e21af63072.DAY) {
        if (direction === $e4750b0ebeed8e48$export$c2bed76d77ee7287.FORWARD) return $bf7b38bce41ca3dd$export$126fc096895fc6f5(calendarDays).plus({
            days: 1
        });
        else return $bf7b38bce41ca3dd$export$4be7a748c9766cf9(calendarDays).minus({
            days: 1
        });
    }
    if (calendarView === $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH || calendarView === $e4750b0ebeed8e48$export$ec9758e21af63072.AGENDA) {
        if (direction === $e4750b0ebeed8e48$export$c2bed76d77ee7287.FORWARD) return calendarDays[15].plus({
            months: 1
        });
        else return calendarDays[15].minus({
            months: 1
        });
    }
    return $cw6c3$luxon.DateTime.now();
};
var $1500da26cef85c66$export$20dc9138dd5b1a6a = function(direction, calendarDays, calendarView, setSelectedDate, weekDayStart) {
    return $1500da26cef85c66$export$e75d169fad6edf5f(calendarView, $1500da26cef85c66$var$getReferenceDate(direction, calendarView, calendarDays), weekDayStart, setSelectedDate);
};
var $1500da26cef85c66$export$fef151b94550e9f5 = function(calendarDays) {
    var ref, ref1, ref2;
    return {
        rangeFrom: calendarDays === null || calendarDays === void 0 ? void 0 : (ref = calendarDays[0]) === null || ref === void 0 ? void 0 : ref.set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0
        }).toUTC().toString(),
        rangeTo: (ref2 = calendarDays === null || calendarDays === void 0 ? void 0 : (ref1 = calendarDays[(calendarDays === null || calendarDays === void 0 ? void 0 : calendarDays.length) - 1]) === null || ref1 === void 0 ? void 0 : ref1.set({
            hour: 23,
            minute: 59,
            second: 59,
            millisecond: 59
        })) === null || ref2 === void 0 ? void 0 : ref2.toUTC().toString()
    };
};


var $63103f0ef67d319d$export$3d0db7ed812b6b3f = function(calendarDays, calendarView, direction, weekDayStart, dispatchContext) {
    var setSelectedDate = function(date) {
        if (dispatchContext) dispatchContext('selectedDate', date);
    };
    var newCalendarDays = $1500da26cef85c66$export$20dc9138dd5b1a6a(direction, calendarDays, calendarView, setSelectedDate, weekDayStart);
    if (dispatchContext) dispatchContext('calendarDays', newCalendarDays);
    return newCalendarDays;
// dispatchContext(
//   'selectedDate',
//   newCalendarDays[chooseSelectedDateIndex(calendarView)]
// );
};
var $63103f0ef67d319d$export$28b655052872eb26 = function() {
    var _ref = $cw6c3$swchelpers.asyncToGenerator(($parcel$interopDefault($cw6c3$regeneratorruntime)).mark(function _callee(selectedView, setContext, weekDayStart) {
        var dateNow, _args = arguments;
        return ($parcel$interopDefault($cw6c3$regeneratorruntime)).wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    dateNow = _args.length > 3 && _args[3] !== void 0 ? _args[3] : $cw6c3$luxon.DateTime.now();
                    $63103f0ef67d319d$export$3d0db7ed812b6b3f([
                        dateNow
                    ], selectedView, $e4750b0ebeed8e48$export$c2bed76d77ee7287.TODAY, weekDayStart, setContext);
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function $63103f0ef67d319d$export$28b655052872eb26(selectedView, setContext, weekDayStart) {
        return _ref.apply(this, arguments);
    };
}();




var $078907888c55a58c$var$getCalendarView = function(value) {
    if (value.toLowerCase() === $e4750b0ebeed8e48$export$ec9758e21af63072.DAY.toLowerCase()) return $e4750b0ebeed8e48$export$ec9758e21af63072.DAY;
    if (value.toLowerCase() === $e4750b0ebeed8e48$export$ec9758e21af63072.THREE_DAYS.toLowerCase()) return $e4750b0ebeed8e48$export$ec9758e21af63072.THREE_DAYS;
    if (value.toLowerCase() === $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK.toLowerCase()) return $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK;
    if (value.toLowerCase() === $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH.toLowerCase()) return $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH;
    if (value.toLowerCase() === $e4750b0ebeed8e48$export$ec9758e21af63072.AGENDA.toLowerCase()) return $e4750b0ebeed8e48$export$ec9758e21af63072.AGENDA;
    return null;
};
var $078907888c55a58c$export$45855e0dd982478b = function(props) {
    // Validate views
    if (props.disabledViews) {
        // throw error if all views are disabled
        if (props.disabledViews.length === Object.values($e4750b0ebeed8e48$export$ec9758e21af63072).length) throw Error('[Kalend]: At least one calendar view has to be enabled');
    }
    // validate initial view
    if (props.initialView) {
        var initialView = $078907888c55a58c$var$getCalendarView(props.initialView.toString());
        if (!initialView) throw Error('[Kalend]: Initial view "'.concat(props.initialView, '" is not valid'));
    }
    // validate weekDayStart
    if (props.weekDayStart && props.weekDayStart !== 'Monday' && props.weekDayStart !== 'Sunday') throw Error('[Kalend]: invalid weekDayStart prop "'.concat(props.weekDayStart, '". Set either Monday or Sunday'));
    // validate timeFormat
    if (props.timeFormat) {
        if (props.timeFormat !== $e4750b0ebeed8e48$export$c4e1e4e065ff5bd8.H_24.toString() && props.timeFormat !== $e4750b0ebeed8e48$export$c4e1e4e065ff5bd8.H_12.toString()) props.timeFormat, $e4750b0ebeed8e48$export$c4e1e4e065ff5bd8.H_24.toString(), $e4750b0ebeed8e48$export$c4e1e4e065ff5bd8.H_12.toString();
    }
};
var $078907888c55a58c$export$fbb8247b2e46a70a = function() {
    var el = document.querySelector('.Kalend__Calendar__root');
    if (el) {
        if (window.getComputedStyle(el).display !== 'flex') throw Error("[Calend]: CSS file not imported.\n         Reason: You probably forgot to import css file in your app as\n         import 'kalend/dist/styles/index.css';\n\n         Valid usage:\n         import Kalend from 'kalend';\n         import 'kalend/dist/styles/index.css';");
    }
};



















var $585762b051d85803$export$c212dd23f1f0a1e3 = function(eventA, eventB, timezone) {
    var startAtFirst = $28306200f69a6328$export$6c2618c4afcf6cfb(eventA.startAt, eventA.timezoneStartAt, timezone);
    var endAtFirst = $28306200f69a6328$export$6c2618c4afcf6cfb(eventA.endAt, eventA.timezoneStartAt, timezone);
    var startAtSecond = $28306200f69a6328$export$6c2618c4afcf6cfb(eventB.startAt, eventB.timezoneStartAt, timezone);
    var endAtSecond = $28306200f69a6328$export$6c2618c4afcf6cfb(eventB.endAt, eventB.timezoneStartAt, timezone);
    return $cw6c3$luxon.Interval.fromDateTimes(startAtFirst, endAtFirst).overlaps($cw6c3$luxon.Interval.fromDateTimes(startAtSecond, endAtSecond));
};
var $585762b051d85803$var$adjustForMinimalHeight = function(eventA, eventB, hourHeight) {
    var result = {
        eventA: $cw6c3$swchelpers.objectSpread({}, eventA),
        eventB: $cw6c3$swchelpers.objectSpread({}, eventB)
    };
    var eventADiff = // @ts-ignore
    $cw6c3$luxon.DateTime.fromISO(eventA.endAt).diff($cw6c3$luxon.DateTime.fromISO(eventA.startAt)).toObject().minutes / (60 / hourHeight);
    var eventBDiff = // @ts-ignore
    $cw6c3$luxon.DateTime.fromISO(eventB.endAt).diff($cw6c3$luxon.DateTime.fromISO(eventB.startAt)).toObject().minutes / (60 / hourHeight);
    if (eventADiff < $88a08af890f49243$export$eae15a231de23f4a) result.eventA.endAt = $cw6c3$luxon.DateTime.fromISO(result.eventA.endAt).plus({
        minutes: $88a08af890f49243$export$eae15a231de23f4a - eventADiff
    }).toString();
    if (eventBDiff < $88a08af890f49243$export$eae15a231de23f4a) result.eventB.endAt = $cw6c3$luxon.DateTime.fromISO(result.eventB.endAt).plus({
        minutes: $88a08af890f49243$export$eae15a231de23f4a - eventBDiff
    }).toString();
    return result;
};
var $585762b051d85803$export$75fe04c694e7ab2e = function(events, calendarIDsHidden) {
    if (!calendarIDsHidden || calendarIDsHidden.length === 0) return events;
    return events.filter(function(item) {
        if (item.calendarID) {
            if (calendarIDsHidden === null || calendarIDsHidden === void 0 ? void 0 : calendarIDsHidden.includes(item.calendarID)) return false;
            else return item;
        }
        return item;
    });
};
var $585762b051d85803$export$6a8cd07afb93412f = function(events, baseWidth, config, selectedView, dateKey) {
    var result = [];
    var offsetCount = []; //Store every event id of overlapping items
    var offsetCountFinal; //Sort events by id number
    var tableWidth = baseWidth / $1500da26cef85c66$export$f16d393a3268e3f3(selectedView);
    var tableSpace = tableWidth / 100 * $88a08af890f49243$export$b4e2ba6756dec2c;
    if (events) {
        var eventsData = events;
        // Filter all day events and multi day events
        eventsData.filter(function(item) {
            return !item.allDay;
        }).map(function(event) {
            var width = 1; //Full width
            var offsetLeft = 0;
            // Compare events
            eventsData.forEach(function(item2) {
                if (event.id !== item2.id && !item2.allDay) {
                    // adjust events to have at least minimal height to check
                    // overlapping
                    var ref = $585762b051d85803$var$adjustForMinimalHeight(event, item2, config.hourHeight), eventA = ref.eventA, eventB = ref.eventB;
                    if ($585762b051d85803$export$c212dd23f1f0a1e3(eventA, eventB, config.timezone) && !eventB.allDay) {
                        width = width + 1; //add width for every overlapping item
                        offsetCount.push(item2.id); // set offset for positioning
                        offsetCount.push(event.id); // set offset for positioning
                    }
                }
            });
            var offsetTop = // @ts-ignore
            $28306200f69a6328$export$6c2618c4afcf6cfb(event.startAt, event.timezoneStartAt, config.timezone).diff($28306200f69a6328$export$6c2618c4afcf6cfb(event.startAt, event.timezoneStartAt, config.timezone).set({
                hour: 0,
                minute: 0,
                second: 0
            }), 'minutes').toObject().minutes / (60 / config.hourHeight); // adjust based on hour column height
            var eventHeight = // @ts-ignore
            $28306200f69a6328$export$6c2618c4afcf6cfb(event.endAt, event.timezoneStartAt).diff($28306200f69a6328$export$6c2618c4afcf6cfb(event.startAt, event.timezoneStartAt), 'minutes').toObject().minutes / (60 / config.hourHeight); // adjust based on hour column height
            var eventWidth = tableWidth / width;
            //sort items for proper calculations of offset by id
            // prevent different order in loop
            if (offsetCount.length > 0) offsetCountFinal = offsetCount.sort();
            if (offsetCountFinal) offsetLeft = eventWidth * offsetCountFinal.indexOf(event.id); //count offset
            //event.left
            // Current status: events is displayed in wrong place
            offsetCount = [];
            offsetCountFinal = '';
            result.push({
                dateKey: dateKey,
                event: event,
                height: eventHeight < $88a08af890f49243$export$eae15a231de23f4a ? $88a08af890f49243$export$eae15a231de23f4a : eventHeight,
                width: eventWidth,
                offsetLeft: offsetLeft,
                offsetTop: offsetTop,
                zIndex: 2,
                meta: {
                    isFullWidth: width === 1,
                    showTime: eventWidth >= $88a08af890f49243$export$81f0fddb54debad3 && eventHeight >= $88a08af890f49243$export$81f0fddb54debad3,
                    centerText: eventHeight <= $88a08af890f49243$export$81f0fddb54debad3
                }
            });
        });
    }
    var partialResult = result.map(function(item) {
        var ref;
        // full event width
        if ((ref = item.meta) === null || ref === void 0 ? void 0 : ref.isFullWidth) return $cw6c3$swchelpers.objectSpread({}, item, {
            width: Math.round(item.width - tableSpace)
        });
        else if (item.offsetLeft > 0) return $cw6c3$swchelpers.objectSpread({}, item, {
            width: Math.round(item.width),
            offsetLeft: item.offsetLeft - tableSpace,
            zIndex: item.zIndex ? item.zIndex + 2 : 2
        });
        else return $cw6c3$swchelpers.objectSpread({}, item, {
            width: Math.round(item.width)
        });
    });
    return partialResult;
};
var $585762b051d85803$export$2edf4a4fedf73d36 = function(calendarDays, events, baseWidth, config, selectedView) {
    var result = {};
    calendarDays.forEach(function(calendarDay) {
        var formattedDayString = calendarDay.toFormat('dd-MM-yyyy');
        var dayEvents = events[formattedDayString];
        var groupedPositions = {};
        var positions = $585762b051d85803$export$6a8cd07afb93412f(dayEvents, baseWidth, config, selectedView, formattedDayString);
        positions.forEach(function(item) {
            if (groupedPositions[item.event.id]) groupedPositions[item.event.id] = item;
            else groupedPositions[item.event.id] = item;
        });
        result[formattedDayString] = groupedPositions;
    });
    return result;
};
var $585762b051d85803$export$f917769c218c90fd = function(event, day, timezone) {
    var dateStart = $28306200f69a6328$export$6c2618c4afcf6cfb(event.startAt, event.timezoneStartAt || timezone);
    var dateEnd = $28306200f69a6328$export$6c2618c4afcf6cfb(event.endAt, event.timezoneStartAt || timezone);
    var dayTruncated = $1500da26cef85c66$export$431753531f5fca31(day).set({
        hour: 0,
        minute: 0,
        millisecond: 0,
        second: 0
    }).toMillis();
    var eventStartTruncated = dateStart.set({
        hour: 0,
        minute: 0,
        millisecond: 0,
        second: 0
    }).toMillis();
    var eventEndTruncated = dateEnd.set({
        hour: 0,
        minute: 0,
        millisecond: 0,
        second: 0
    }).toMillis();
    // fix wrong positioning when external all day event ends in next day
    if (event.externalID) return dayTruncated >= eventStartTruncated && dayTruncated < eventEndTruncated;
    else return dayTruncated >= eventStartTruncated && dayTruncated <= eventEndTruncated;
};
var $585762b051d85803$export$3a6eb9efca632dee = function(event, days, timezone) {
    var hasMatch = false;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = days[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var day = _step.value;
            if ($585762b051d85803$export$f917769c218c90fd(event, day, timezone)) {
                hasMatch = true;
                return true;
            // return false;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return hasMatch;
};



// eslint-disable-next-line @typescript-eslint/no-empty-function
var $3886b97a1526edd3$var$emptyFunction = function() {};
var $3886b97a1526edd3$var$parseTimeFormat = function(timeFormatValue) {
    if (timeFormatValue) {
        if (timeFormatValue.toLowerCase() === $e4750b0ebeed8e48$export$c4e1e4e065ff5bd8.H_24.toString().toLowerCase()) return $e4750b0ebeed8e48$export$c4e1e4e065ff5bd8.H_24;
        else if (timeFormatValue.toLowerCase() === $e4750b0ebeed8e48$export$c4e1e4e065ff5bd8.H_12.toString().toLowerCase()) return $e4750b0ebeed8e48$export$c4e1e4e065ff5bd8.H_12;
    }
};
var $3886b97a1526edd3$var$parseWeekDayStart = function(weekDayStartValue) {
    if (weekDayStartValue) {
        if (weekDayStartValue.toLowerCase() === $e4750b0ebeed8e48$export$5a05f7ffc0500403.MONDAY.toLowerCase()) return $e4750b0ebeed8e48$export$5a05f7ffc0500403.MONDAY;
        else if (weekDayStartValue.toLowerCase() === $e4750b0ebeed8e48$export$5a05f7ffc0500403.SUNDAY.toLowerCase()) return $e4750b0ebeed8e48$export$5a05f7ffc0500403.SUNDAY;
    }
};
var $3886b97a1526edd3$export$45a69314cf48a3eb = function(props) {
    return {
        hourHeight: props.hourHeight || $88a08af890f49243$export$1c9a1263a0d343f4,
        timeFormat: $3886b97a1526edd3$var$parseTimeFormat(props.timeFormat) || $e4750b0ebeed8e48$export$c4e1e4e065ff5bd8.H_24,
        timezone: props.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        weekDayStart: $3886b97a1526edd3$var$parseWeekDayStart(props.weekDayStart) || $e4750b0ebeed8e48$export$5a05f7ffc0500403.MONDAY,
        isDark: false,
        showTimeLine: props.showTimeLine || false,
        disableMobileDropdown: props.disableMobileDropdown || false,
        disabledViews: props.disabledViews,
        calendarIDsHidden: props.calendarIDsHidden || null,
        hasExternalLayout: props.eventLayouts !== undefined
    };
};
var $3886b97a1526edd3$export$96e2a2f386b0b376 = function(props) {
    return {
        onEventDragFinish: props.onEventDragFinish || undefined,
        onPageChange: props.onPageChange || undefined,
        onSelectView: props.onSelectView || undefined,
        onEventClick: props.onEventClick || $3886b97a1526edd3$var$emptyFunction,
        onNewEventClick: props.onNewEventClick || $3886b97a1526edd3$var$emptyFunction,
        showMoreMonth: props.showMoreMonth || $3886b97a1526edd3$var$emptyFunction,
        onStateChange: props.onStateChange || undefined
    };
};
var $3886b97a1526edd3$var$ConfigLayer = function(props) {
    var ref;
    var ref1 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(false), 2), isReady = ref1[0], setIsReady = ref1[1];
    var ref2 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 2), dispatch = ref2[1];
    var setContext = function(type, payload) {
        dispatch({
            type: type,
            payload: payload
        });
    };
    var initFromProps = function() {
        var config = $3886b97a1526edd3$export$45a69314cf48a3eb(props);
        var callbacks = $3886b97a1526edd3$export$96e2a2f386b0b376(props);
        setContext('config', config);
        setContext('callbacks', callbacks);
        setContext('selectedView', props.selectedView || props.initialView || $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK);
        setContext('selectedDate', props.initialDate ? $cw6c3$luxon.DateTime.fromISO(props.initialDate) : $cw6c3$luxon.DateTime.now());
        if (props.style) setContext('style', props.style);
        setIsReady(true);
    };
    $cw6c3$react.useEffect(function() {
        initFromProps();
        setIsReady(true);
    }, []);
    $cw6c3$react.useEffect(function() {
        initFromProps();
    }, [
        props.hourHeight,
        props.timeFormat,
        props.timezone,
        // props.disabledViews, // keeps re-rendering without any change
        props.isDark,
        props.disableMobileDropdown, 
    ]);
    $cw6c3$react.useEffect(function() {
        var eventsFiltered = $585762b051d85803$export$75fe04c694e7ab2e(props.events, props.calendarIDsHidden);
        setContext('events', eventsFiltered);
    }, [
        JSON.stringify(props.calendarIDsHidden),
        (ref = props.calendarIDsHidden) === null || ref === void 0 ? void 0 : ref.length, 
    ]);
    return isReady ? props.children : null;
};
var $3886b97a1526edd3$export$2e2bcd8739ae039 = $3886b97a1526edd3$var$ConfigLayer;




// tslint:disable-next-line:cyclomatic-complexity
var $e7acfb653c6fbfca$var$Reducer = function(state, action) {
    switch(action.type){
        case 'initialView':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                initialView: action.payload
            });
        case 'selectedView':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                selectedView: action.payload
            });
        case 'isMobile':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                isMobile: action.payload
            });
        case 'translations':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                translations: action.payload
            });
        case 'style':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                style: action.payload
            });
        case 'direction':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                direction: action.payload
            });
        case 'daysViewLayout':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                daysViewLayout: action.payload
            });
        case 'config':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                config: action.payload
            });
        case 'headerLayout':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                headerLayout: action.payload
            });
        case 'monthLayout':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                monthLayout: action.payload
            });
        case 'monthOverflowEvents':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                monthOverflowEvents: action.payload
            });
        case 'showMoreEvents':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                showMoreEvents: action.payload
            });
        case 'layoutUpdateSequence':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                layoutUpdateSequence: action.payload
            });
        case 'events':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                events: action.payload
            });
        case 'selectedDate':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                selectedDate: action.payload
            });
        case 'calendarDays':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                calendarDays: action.payload
            });
        case 'isLoading':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                isLoading: action.payload
            });
        case 'width':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                width: action.payload
            });
        case 'height':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                height: action.payload
            });
        case 'callbacks':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                callbacks: action.payload
            });
        case 'headerEventRowsCount':
            return $cw6c3$swchelpers.objectSpread({}, state, {
                headerEventRowsCount: action.payload
            });
        default:
            return state;
    }
};
var $e7acfb653c6fbfca$export$2e2bcd8739ae039 = $e7acfb653c6fbfca$var$Reducer;


var $073ad6afefbd1c74$exports = {};
$073ad6afefbd1c74$exports = JSON.parse("{\"buttons\":{\"today\":\"Today\",\"agenda\":\"Agenda\",\"day\":\"Day\",\"threeDays\":\"3 Days\",\"week\":\"Week\",\"month\":\"Month\",\"showMore\":\"More\"},\"months\":{\"january\":\"January\",\"february\":\"February\",\"march\":\"March\",\"april\":\"April\",\"may\":\"May\",\"june\":\"June\",\"july\":\"July\",\"august\":\"August\",\"september\":\"September\",\"october\":\"October\",\"november\":\"November\",\"december\":\"December\"},\"weekDays\":{\"Mon\":\"Mon\",\"Tue\":\"Tue\",\"Wed\":\"Wed\",\"Thu\":\"Thu\",\"Fri\":\"Fri\",\"Sat\":\"Sat\",\"Sun\":\"Sun\"}}");


var $65553fbba1d6d65b$export$841858b892ce1f4c = /*#__PURE__*/ $cw6c3$react.createContext({});
var $65553fbba1d6d65b$var$StoreProvider = function(param) {
    var children = param.children;
    var initialContext = {
        isLoading: false,
        headerEventRowsCount: 0,
        initialView: null,
        selectedView: null,
        selectedDate: $cw6c3$luxon.DateTime.now(),
        calendarDays: [],
        width: 0,
        // height: 0,
        isMobile: false,
        events: {},
        daysViewLayout: null,
        headerLayout: null,
        monthLayout: null,
        monthOverflowEvents: null,
        showMoreEvents: null,
        layoutUpdateSequence: 1,
        config: $3886b97a1526edd3$export$45a69314cf48a3eb({}),
        callbacks: $3886b97a1526edd3$export$96e2a2f386b0b376({}),
        direction: $e4750b0ebeed8e48$export$c2bed76d77ee7287.TODAY,
        translations: (/*@__PURE__*/$parcel$interopDefault($073ad6afefbd1c74$exports)),
        style: {
            primaryColor: '#ec407a',
            baseColor: '#424242FF',
            inverseBaseColor: '#E5E5E5FF'
        }
    };
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useReducer($e7acfb653c6fbfca$export$2e2bcd8739ae039, initialContext), 2), store = ref[0], dispatch = ref[1];
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($65553fbba1d6d65b$export$841858b892ce1f4c.Provider, {
        value: [
            store,
            dispatch
        ],
        children: children
    });
};
var $65553fbba1d6d65b$export$2e2bcd8739ae039 = $65553fbba1d6d65b$var$StoreProvider;








var $2c4fe1f6b84a6784$export$3c49c185de0c2bfc = function() {
    var rootEl = document.querySelector('.Kalend__Calendar__root');
    if (rootEl) return rootEl.clientWidth;
    return 0;
};
var $2c4fe1f6b84a6784$export$3aee49006f13db09 = function() {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState($2c4fe1f6b84a6784$export$3c49c185de0c2bfc()), 2), width = ref[0], setWidth = ref[1];
    // Get width on init
    $cw6c3$react.useEffect(function() {
        var listenToResizeEvent = function() {
            setWidth($2c4fe1f6b84a6784$export$3c49c185de0c2bfc());
        };
        window.addEventListener('resize', listenToResizeEvent);
        return function() {
            window.removeEventListener('resize', listenToResizeEvent);
        };
    }, []);
    return width;
};
var $2c4fe1f6b84a6784$export$c08559766941f856 = function() {
    var rootEl = document.querySelector('.Kalend__Calendar__table');
    if (rootEl) return rootEl.clientHeight;
    return 0;
};
var $2c4fe1f6b84a6784$export$30dc190df7e420c4 = function() {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState($2c4fe1f6b84a6784$export$c08559766941f856()), 2), height = ref[0], setHeight = ref[1];
    // Get height on init
    $cw6c3$react.useEffect(function() {
        $2c4fe1f6b84a6784$export$c08559766941f856();
    }, []);
    $cw6c3$react.useEffect(function() {
        var listenToResizeEvent = function() {
            setHeight($2c4fe1f6b84a6784$export$c08559766941f856());
        };
        window.addEventListener('resize', listenToResizeEvent);
        return function() {
            window.removeEventListener('resize', listenToResizeEvent);
        };
    }, []);
    return height;
};



















var $ecf585202d453fcb$var$DateWeekDay = function(props) {
    var width = props.width, day = props.day;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var selectedView = store.selectedView, style = store.style;
    var isDayToday = $d49542164c9bae14$export$2e2bcd8739ae039.isToday(day);
    var isMonthView = selectedView === $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH;
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        className: 'Kalend__CalendarHeaderDates__col',
        style: {
            width: width
        },
        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
            className: "Kalend__CalendarHeaderDates__circle".concat(isMonthView ? '-small' : ''),
            style: {
                background: isDayToday ? style.primaryColor : 'transparent'
            },
            children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("p", {
                className: "Kalend__text Kalend__CalendarHeaderDates__text ".concat(selectedView === $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH ? 'Kalend__CalendarHeaderDates__text-size-small' : ''),
                style: {
                    color: isDayToday ? style.inverseBaseColor : style.baseColor
                },
                children: day.day
            })
        })
    });
};
var $ecf585202d453fcb$export$2e2bcd8739ae039 = $ecf585202d453fcb$var$DateWeekDay;






var $0689dc746d054cae$var$DayOfWeekText = function(props) {
    var width = props.width, day = props.day;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var translations = store.translations;
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        className: 'Kalend__CalendarHeaderWeekDays__col',
        style: {
            width: width
        },
        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("p", {
            className: 'Kalend__text Kalend__CalendarHeaderWeekDays__text',
            children: translations['weekDays']["".concat(day.toFormat('EEE'))]
        })
    });
};
var $0689dc746d054cae$export$2e2bcd8739ae039 = $0689dc746d054cae$var$DayOfWeekText;












var $79dca703cc699b4f$export$38477230a29207e3 = function() {
    return {
        offsetLeft: 0,
        offsetTop: 0,
        width: '90%',
        height: $88a08af890f49243$export$4b16cd32b50218c6,
        zIndex: 1,
        border: 'none',
        meta: {
            showTime: false,
            isFullWidth: true,
            centerText: true
        }
    };
};
var $79dca703cc699b4f$export$2b35b885b699e674 = {
    dragging: false,
    initialTop: 0,
    initialLeft: 0,
    offsetTop: null,
    offsetLeft: null,
    xPosition: 0,
    eventHasChanged: false,
    width: null,
    height: null,
    zIndex: 2,
    border: '',
    meta: {},
    isDragging: false
};
var $79dca703cc699b4f$export$633076c346814fbe = function(type, day, event, store, setLayout, index) {
    var daysViewLayout = store.daysViewLayout, headerLayout = store.headerLayout, monthLayout = store.monthLayout;
    if (type === $e4750b0ebeed8e48$export$76a2e4c433c23bb9.NORMAL && day) {
        var ref;
        var formattedDayString = $bf7b38bce41ca3dd$export$6a8d31c8b7f17aa5(day);
        var eventLayoutValue = (ref = daysViewLayout[formattedDayString]) === null || ref === void 0 ? void 0 : ref[event.id];
        if (eventLayoutValue) setLayout(eventLayoutValue);
    } else if (type === $e4750b0ebeed8e48$export$76a2e4c433c23bb9.HEADER) {
        if (store.headerLayout) {
            var headerLayoutValue = headerLayout[event.id];
            if (headerLayoutValue) setLayout(headerLayoutValue);
        }
    } else if (type === $e4750b0ebeed8e48$export$76a2e4c433c23bb9.MONTH) {
        if (store.monthLayout && index !== undefined) {
            var ref1;
            var monthLayoutValue = monthLayout === null || monthLayout === void 0 ? void 0 : (ref1 = monthLayout[index]) === null || ref1 === void 0 ? void 0 : ref1[event.id];
            if (monthLayoutValue) setLayout(monthLayoutValue);
        }
    } else setLayout($79dca703cc699b4f$export$38477230a29207e3());
};
var $79dca703cc699b4f$export$6da1c85d7de31b61 = function(e) {
    var ref, ref2;
    var touches = (ref = e.nativeEvent) === null || ref === void 0 ? void 0 : (ref2 = ref.touches) === null || ref2 === void 0 ? void 0 : ref2[0];
    return !!touches;
};







var $f7dc25aaa4235907$var$timeout;
var $f7dc25aaa4235907$var$ButtonBase = function(props) {
    var id = props.id, onClick = props.onClick, text = props.text, className = props.className, style1 = props.style, children = props.children, propagation = props.propagation, disabled = props.disabled, onClickFromParent = props.onClickFromParent, onMouseDown = props.onMouseDown, onMouseUp = props.onMouseUp, onMouseMove = props.onMouseMove, onTouchEnd = props.onTouchEnd;
    var buttonRef = $cw6c3$react.useRef(null);
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(false), 2), isPressed = ref[0], setIsPressed = ref[1];
    var ref1 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState({}), 2), spanStyle = ref1[0], setSpanStyle = ref1[1];
    var onButtonClick = function(e) {
        onClick(e);
        if (onClickFromParent) onClickFromParent();
    };
    var animateRipple = function(event) {
        var button = buttonRef.current;
        if (!button) return;
        var rect = button.getBoundingClientRect();
        var oneSide = button.clientWidth > button.clientHeight ? button.clientWidth : button.clientHeight;
        var touches = event.touches ? event.touches[0] : undefined;
        var clickLeft;
        var clickTop;
        if (touches) {
            clickLeft = touches.clientX - rect.left - oneSide;
            clickTop = touches.clientY - rect.top - oneSide;
        } else {
            clickLeft = event.clientX;
            clickTop = event.clientY;
        }
        var style = {
            width: "".concat(oneSide * 2, "px"),
            height: "".concat(oneSide * 2, "px"),
            left: "".concat(clickLeft, "px"),
            top: "".concat(clickTop, "px")
        };
        setSpanStyle(style);
        setIsPressed(true);
    };
    var onTouchStart = function(e) {
        if (!propagation) e.stopPropagation();
        if (props.onTouchStart) props.onTouchStart(e);
        if (isPressed) setIsPressed(false);
        $f7dc25aaa4235907$var$timeout = setTimeout(function() {
            animateRipple(e);
        }, 100);
    };
    // Clear timeout for ripple effect
    var onTouchMove = function(e) {
        if (!propagation) e.stopPropagation();
        if (props.onTouchMove) props.onTouchMove(e);
        clearTimeout($f7dc25aaa4235907$var$timeout);
    };
    var buttonText = text ? text : '';
    var buttonClassName = className ? "Kalend__button ".concat(className, " Kalend__ButtonBase") : 'Kalend__button Kalend__ButtonBase';
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("button", {
        id: id,
        ref: buttonRef,
        onClick: onButtonClick,
        onTouchMove: onTouchMove,
        onTouchStart: onTouchStart,
        onTouchEnd: onTouchEnd,
        onMouseDown: onMouseDown,
        onMouseUp: onMouseUp,
        onMouseMove: onMouseMove,
        // onTouchStart={handleTouchStart}
        // onMouseLeave={handleTouchOff}
        // onTouchEnd={handleTouchOff}
        // onTouchEndCapture={handleTouchCancel}
        className: buttonClassName,
        style: style1,
        children: [
            children ? children : buttonText,
            isPressed && !disabled ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("span", {
                style: spanStyle,
                className: 'Kalend__ButtonBase__animation'
            }) : null
        ]
    });
};
var $f7dc25aaa4235907$export$2e2bcd8739ae039 = $f7dc25aaa4235907$var$ButtonBase;




var $8304c40ecd0ca62c$var$EventSummary = function(props) {
    var isDark = props.isDark, summary = props.summary, type = props.type;
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("p", {
        className: "Kalend__text Kalend__Event__summary Kalend__Event__summary__type-".concat(type),
        children: [
            summary,
            ' '
        ]
    });
};
var $8304c40ecd0ca62c$export$2e2bcd8739ae039 = $8304c40ecd0ca62c$var$EventSummary;







var $5293df8efc30aa85$var$TIME_FORMAT_PATTERN = 'HH:mm';
var $5293df8efc30aa85$var$TIME_H_12_FORMAT_PATTERN = 'hh:mm a';
var $5293df8efc30aa85$var$parseTimeFormat = function(day, timeFormat) {
    if (timeFormat === $e4750b0ebeed8e48$export$c4e1e4e065ff5bd8.H_24) return day.toFormat($5293df8efc30aa85$var$TIME_FORMAT_PATTERN);
    else return day.toFormat($5293df8efc30aa85$var$TIME_H_12_FORMAT_PATTERN);
};
var $5293df8efc30aa85$var$formatEventTimeV2 = function(event, timeFormat, timezone) {
    var startAt = event.startAt, endAt = event.endAt, timezoneStartAt = event.timezoneStartAt;
    var startAtDateTime = $28306200f69a6328$export$6c2618c4afcf6cfb(startAt, timezoneStartAt, timezone);
    var endAtDateTime = $28306200f69a6328$export$6c2618c4afcf6cfb(endAt, timezoneStartAt, timezone);
    return {
        start: $5293df8efc30aa85$var$parseTimeFormat(startAtDateTime, timeFormat),
        end: $5293df8efc30aa85$var$parseTimeFormat(endAtDateTime, timeFormat)
    };
};
var $5293df8efc30aa85$var$EventTime = function(props) {
    var isDark = props.isDark, event = props.event, type = props.type;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var config = store.config;
    var timezone = config.timezone, timeFormat = config.timeFormat;
    var timeV2 = $5293df8efc30aa85$var$formatEventTimeV2(event, timeFormat, timezone);
    // const time: string = formatEventTime(event);
    return null;
};
var $5293df8efc30aa85$export$2e2bcd8739ae039 = $5293df8efc30aa85$var$EventTime;


var $82d351ff4940fae4$var$EventAgenda = function(props) {
    var isDark = props.isDark, event = props.event, type = props.type;
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
        className: 'Kalend__EventAgenda__container',
        children: [
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($8304c40ecd0ca62c$export$2e2bcd8739ae039, {
                summary: event.summary,
                isDark: isDark,
                type: type
            }),
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($5293df8efc30aa85$export$2e2bcd8739ae039, {
                isDark: isDark,
                event: event,
                type: type
            })
        ]
    });
};
var $82d351ff4940fae4$export$2e2bcd8739ae039 = $82d351ff4940fae4$var$EventAgenda;




var $e4c1f2269414489f$var$EventMonth = function(props) {
    var isDark = props.isDark, event = props.event, type = props.type;
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($8304c40ecd0ca62c$export$2e2bcd8739ae039, {
        summary: event.summary,
        isDark: isDark,
        type: type
    });
};
var $e4c1f2269414489f$export$2e2bcd8739ae039 = $e4c1f2269414489f$var$EventMonth;






var $05400c9842705755$var$EventNormal = function(props) {
    var isDark = props.isDark, event = props.event, type = props.type, meta = props.meta;
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '-webkit-fill-available'
        },
        children: [
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($8304c40ecd0ca62c$export$2e2bcd8739ae039, {
                summary: event.summary,
                isDark: isDark,
                type: type
            }),
            (meta === null || meta === void 0 ? void 0 : meta.showTime) ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($5293df8efc30aa85$export$2e2bcd8739ae039, {
                isDark: isDark,
                event: event,
                type: $e4750b0ebeed8e48$export$76a2e4c433c23bb9.NORMAL
            }) : null
        ]
    });
};
var $05400c9842705755$export$2e2bcd8739ae039 = $05400c9842705755$var$EventNormal;




var $54523a3171a39713$var$EventShowMoreMonth = function(props) {
    var isDark = props.isDark, event = props.event, type = props.type;
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        className: 'Kalend__EventShowMoreMonth__container',
        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($8304c40ecd0ca62c$export$2e2bcd8739ae039, {
            summary: event.summary,
            isDark: isDark,
            type: type
        })
    });
};
var $54523a3171a39713$export$2e2bcd8739ae039 = $54523a3171a39713$var$EventShowMoreMonth;



var $66c3795c5fc7507d$var$StateReducer = function(state, action) {
    // Replace whole state
    if (!action.payload) return $cw6c3$swchelpers.objectSpread({}, state, action);
    var _payload = action.payload, stateName = _payload.stateName, type = _payload.type, data = _payload.data;
    return $cw6c3$swchelpers.objectSpread({}, state, $cw6c3$swchelpers.defineProperty({}, stateName, data));
};
var $66c3795c5fc7507d$export$2e2bcd8739ae039 = $66c3795c5fc7507d$var$StateReducer;


// ref to cancel timout
var $b852c5f3008abacb$var$timeoutRef;
var $b852c5f3008abacb$var$EventButton = function(props) {
    var item = props.item, type1 = props.type, _day = props.day, day = _day === void 0 ? $cw6c3$luxon.DateTime.now() : _day, index = props.index;
    var event = item.event;
    var startAt = event.startAt;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useReducer($66c3795c5fc7507d$export$2e2bcd8739ae039, $79dca703cc699b4f$export$2b35b885b699e674), 2), state = ref[0], dispatchState = ref[1];
    var setState = function(stateName, data) {
        var payload = {
            stateName: stateName,
            data: data
        };
        dispatchState({
            state: state,
            payload: payload
        });
    };
    // store values as refs to access them in event listener
    var offsetTopRef = $cw6c3$react.useRef(state.offsetTop);
    var offsetLeftRef = $cw6c3$react.useRef(state.offsetLeft);
    var xShiftIndexRef = $cw6c3$react.useRef(0);
    var yShiftIndexRef = $cw6c3$react.useRef(0);
    var draggingRef = $cw6c3$react.useRef(false);
    var eventWasChangedRef = $cw6c3$react.useRef(false);
    var ref1 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 2), store = ref1[0], dispatch = ref1[1];
    var setContext = function(type, payload) {
        dispatch({
            type: type,
            payload: payload
        });
    };
    var width = store.width, calendarDays = store.calendarDays, config = store.config, callbacks = store.callbacks;
    var heightHook = $2c4fe1f6b84a6784$export$30dc190df7e420c4();
    var hourHeight = config.hourHeight, isDark = config.isDark;
    var onEventClick = callbacks.onEventClick, onEventDragFinish = callbacks.onEventDragFinish;
    var columnWidth = width / (type1 === $e4750b0ebeed8e48$export$76a2e4c433c23bb9.MONTH ? 7 : calendarDays.length);
    var eventColor = event.color ? $1500da26cef85c66$export$2d5ed1e6bc597003(event.color, isDark) : 'indigo';
    var style = {
        position: type1 === $e4750b0ebeed8e48$export$76a2e4c433c23bb9.AGENDA || type1 === $e4750b0ebeed8e48$export$76a2e4c433c23bb9.SHOW_MORE_MONTH ? 'relative' : 'absolute',
        height: state.height !== null ? state.height : item.height || $cw6c3$kalendlayoutconstants.MONTH_EVENT_HEIGHT,
        width: state.width !== null ? state.width : item.width || '100%',
        top: state.offsetTop !== null ? state.offsetTop : item.offsetTop,
        left: state.offsetLeft !== null ? state.offsetLeft : item.offsetLeft,
        zIndex: state.zIndex || item.zIndex,
        border: state.zIndex > 2 ? "solid 1px white" : "solid 1px ".concat(eventColor),
        backgroundColor: eventColor,
        visibility: 'visible'
    };
    var handleEventClick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (draggingRef.current) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            draggingRef.current = false;
            return;
        }
        if (onEventClick) onEventClick(event);
    };
    var setLayout = function(layout) {
        setState('initialTop', layout.offsetTop);
        setState('initialLeft', layout.offsetLeft);
        setState('offsetTop', layout.offsetTop);
        setState('offsetLeft', layout.offsetLeft);
        setState('drawingY', layout.offsetTop);
        setState('startAt', startAt);
        setState('width', layout.width);
        setState('height', layout.height);
        setState('zIndex', layout.zIndex);
        setState('border', layout.border);
        setState('meta', layout.meta);
    };
    $cw6c3$react.useEffect(function() {
        setLayout(item);
    // initEventButtonPosition(type, props.day, event, store, setLayout, index);
    }, []);
    // useEffect(() => {
    //   initEventButtonPosition(type, props.day, event, store, setLayout, index);
    // }, [
    //   // @ts-ignore
    //   daysViewLayout?.[formatDateTimeToString(props.day || DateTime.now())]?.[
    //     event.id
    //   ],
    // ]);
    // useEffect(() => {
    //   initEventButtonPosition(type, props.day, event, store, setLayout, index);
    // }, [store.layoutUpdateSequence]);
    var initMove = function() {
        return;
    };
    var onMove = function(e) {
        return;
    };
    /**
   * Cancel dragging event
   * remove listeners clean long click timeout and reset state
   * @param e
   */ var onMouseUp = function(e) {
        return;
    };
    /**
   * Start event dragging on long press/touch
   * Set listeners
   * @param e
   */ var onMouseDownLong = function(e) {
        return;
    };
    /**
   * Initial long press click/touch on event
   * @param e
   */ var onMouseDown = function(e) {
        return;
    };
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs($f7dc25aaa4235907$export$2e2bcd8739ae039, {
        id: event.id,
        isDark: isDark,
        style: style,
        className: "Kalend__Event-".concat(type1, " ").concat(state.isDragging ? 'Kalend__EventButton__elevation' : ''),
        onClick: handleEventClick,
        onMouseDown: onMouseDown,
        onMouseUp: onMouseUp,
        onTouchStart: onMouseDown,
        onTouchMove: onMove,
        onTouchEnd: onMouseUp,
        children: [
            type1 === $e4750b0ebeed8e48$export$76a2e4c433c23bb9.MONTH || type1 === $e4750b0ebeed8e48$export$76a2e4c433c23bb9.HEADER ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($e4c1f2269414489f$export$2e2bcd8739ae039, {
                event: event,
                isDark: isDark,
                type: type1
            }) : null,
            type1 === $e4750b0ebeed8e48$export$76a2e4c433c23bb9.NORMAL ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($05400c9842705755$export$2e2bcd8739ae039, {
                event: event,
                isDark: isDark,
                type: type1,
                meta: item.meta
            }) : null,
            type1 === $e4750b0ebeed8e48$export$76a2e4c433c23bb9.AGENDA ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($82d351ff4940fae4$export$2e2bcd8739ae039, {
                event: event,
                isDark: isDark,
                type: type1
            }) : null,
            type1 === $e4750b0ebeed8e48$export$76a2e4c433c23bb9.SHOW_MORE_MONTH ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($54523a3171a39713$export$2e2bcd8739ae039, {
                event: event,
                isDark: isDark,
                type: type1
            }) : null
        ]
    });
};
var $b852c5f3008abacb$export$2e2bcd8739ae039 = $b852c5f3008abacb$var$EventButton;


var $86ca9f6752cc056e$var$renderEvents = function(events) {
    if (!events || events.length === 0) return [];
    var sortedEvents = events === null || events === void 0 ? void 0 : events.sort(function(a, b) {
        return $cw6c3$luxon.DateTime.fromISO(a.startAt).toMillis() - $cw6c3$luxon.DateTime.fromISO(b.startAt).toMillis();
    });
    return sortedEvents.map(function(event) {
        return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($b852c5f3008abacb$export$2e2bcd8739ae039, {
            item: {
                event: event
            },
            type: $e4750b0ebeed8e48$export$76a2e4c433c23bb9.AGENDA
        }, "".concat(event.id).concat(event.internalID ? event.internalID : ''));
    });
};
var $86ca9f6752cc056e$var$AgendaDayRow = function(props) {
    var day = props.day, events = props.events;
    var dayEvents = $86ca9f6752cc056e$var$renderEvents(events);
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
        className: 'Kalend__AgendaDayRow__container',
        children: [
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
                className: 'Kalend__AgendaDayRow__container-day',
                children: [
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($0689dc746d054cae$export$2e2bcd8739ae039, {
                        day: day,
                        width: 50
                    }),
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($ecf585202d453fcb$export$2e2bcd8739ae039, {
                        width: 50,
                        day: day
                    })
                ]
            }),
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                className: 'Kalend__AgendaDayRow__events',
                children: dayEvents
            })
        ]
    });
};
var $86ca9f6752cc056e$export$2e2bcd8739ae039 = $86ca9f6752cc056e$var$AgendaDayRow;



var $ae9d5d34ac1cc52f$var$renderAgendaEvents = function(events, calendarDays) {
    return calendarDays.map(function(calendarDay) {
        var hasEvents = !!events[calendarDay.toFormat($d49542164c9bae14$export$74b2237eca26435b)];
        if (hasEvents) return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($86ca9f6752cc056e$export$2e2bcd8739ae039, {
            day: calendarDay,
            events: events[calendarDay.toFormat($d49542164c9bae14$export$74b2237eca26435b)]
        }, calendarDay.toString());
    });
};
var $ae9d5d34ac1cc52f$var$AgendaView = function(props) {
    var events = props.events, eventLayouts = props.eventLayouts;
    var ref3 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(false), 2), wasInit = ref3[0], setWasInit = ref3[1];
    var ref1 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(null), 2), calendarContent = ref1[0], setCalendarContent = ref1[1];
    var ref2 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 2), store = ref2[0], dispatch = ref2[1];
    var setContext = function(type, payload) {
        dispatch({
            type: type,
            payload: payload
        });
    };
    var calendarDays = store.calendarDays, width = store.width;
    var height = $2c4fe1f6b84a6784$export$30dc190df7e420c4();
    var hasExternalLayout = eventLayouts !== undefined;
    $cw6c3$react.useEffect(function() {
        if (!hasExternalLayout) {
            ($parcel$interopDefault($cw6c3$kalendlayout))({
                events: events,
                selectedView: $e4750b0ebeed8e48$export$ec9758e21af63072.AGENDA,
                height: height,
                width: width,
                calendarDays: [],
                config: store.config
            }).then(function(res) {
                setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);
                var content = $ae9d5d34ac1cc52f$var$renderAgendaEvents(res.events, calendarDays);
                setCalendarContent(content);
            });
            setWasInit(true);
        }
    }, [
        calendarDays[0]
    ]);
    $cw6c3$react.useEffect(function() {
        // don't need to call this immediately
        if (wasInit) {
            if (!hasExternalLayout) ($parcel$interopDefault($cw6c3$kalendlayout))({
                events: events,
                selectedView: $e4750b0ebeed8e48$export$ec9758e21af63072.AGENDA,
                height: height,
                width: width,
                calendarDays: [],
                config: store.config
            }).then(function(res) {
                setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);
                var content = $ae9d5d34ac1cc52f$var$renderAgendaEvents(res.events, calendarDays);
                setCalendarContent(content);
            });
        }
    }, [
        JSON.stringify(events)
    ]);
    $cw6c3$react.useEffect(function() {
        if (hasExternalLayout && $bf7b38bce41ca3dd$export$e3e4ea182aca355e(props.eventLayouts.selectedView) === $e4750b0ebeed8e48$export$ec9758e21af63072.AGENDA) {
            var ref;
            setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);
            var content = $ae9d5d34ac1cc52f$var$renderAgendaEvents((ref = props.eventLayouts) === null || ref === void 0 ? void 0 : ref.events, calendarDays);
            setCalendarContent(content);
        }
    }, [
        JSON.stringify(props.eventLayouts)
    ]);
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        className: 'Kalend__Agenda__container',
        style: {
            height: '100%'
        },
        children: calendarContent
    });
};
var $ae9d5d34ac1cc52f$export$2e2bcd8739ae039 = $ae9d5d34ac1cc52f$var$AgendaView;









var $cea2a6b325f4edcd$var$CalendarIcon = function(props) {
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        className: props.className,
        fill: props.fill,
        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("g", {
            "data-name": "Layer 2",
            children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("g", {
                "data-name": "calendar",
                children: [
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("rect", {
                        width: "24",
                        height: "24",
                        opacity: "0"
                    }),
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("path", {
                        d: "M18 4h-1V3a1 1 0 0 0-2 0v1H9V3a1 1 0 0 0-2 0v1H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zM6 6h1v1a1 1 0 0 0 2 0V6h6v1a1 1 0 0 0 2 0V6h1a1 1 0 0 1 1 1v4H5V7a1 1 0 0 1 1-1zm12 14H6a1 1 0 0 1-1-1v-6h14v6a1 1 0 0 1-1 1z"
                    }),
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("circle", {
                        cx: "8",
                        cy: "16",
                        r: "1"
                    }),
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("path", {
                        d: "M16 15h-4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2z"
                    })
                ]
            })
        })
    });
};
var $cea2a6b325f4edcd$export$2e2bcd8739ae039 = $cea2a6b325f4edcd$var$CalendarIcon;



var $de758c447aa9231a$var$ChevronDown = function(props) {
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        className: props.className,
        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("g", {
            "data-name": "Layer 2",
            children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("g", {
                "data-name": "chevron-down",
                children: [
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("rect", {
                        width: "24",
                        height: "24",
                        opacity: "0"
                    }),
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("path", {
                        d: "M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"
                    })
                ]
            })
        })
    });
};
var $de758c447aa9231a$export$2e2bcd8739ae039 = $de758c447aa9231a$var$ChevronDown;



var $2764ed95df1a4c11$var$ChevronLeft = function(props) {
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        className: props.className,
        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("g", {
            "data-name": "Layer 2",
            children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("g", {
                "data-name": "chevron-left",
                children: [
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("rect", {
                        width: "24",
                        height: "24",
                        transform: "rotate(90 12 12)",
                        opacity: "0"
                    }),
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("path", {
                        d: "M13.36 17a1 1 0 0 1-.72-.31l-3.86-4a1 1 0 0 1 0-1.4l4-4a1 1 0 1 1 1.42 1.42L10.9 12l3.18 3.3a1 1 0 0 1 0 1.41 1 1 0 0 1-.72.29z"
                    })
                ]
            })
        })
    });
};
var $2764ed95df1a4c11$export$2e2bcd8739ae039 = $2764ed95df1a4c11$var$ChevronLeft;



var $ddaf3c6577962ab4$var$ChevronRight = function(props) {
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        className: props.className,
        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("g", {
            "data-name": "Layer 2",
            children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("g", {
                "data-name": "chevron-right",
                children: [
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("rect", {
                        width: "24",
                        height: "24",
                        transform: "rotate(-90 12 12)",
                        opacity: "0"
                    }),
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("path", {
                        d: "M10.5 17a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42L13.1 12 9.92 8.69a1 1 0 0 1 0-1.41 1 1 0 0 1 1.42 0l3.86 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-.7.32z"
                    })
                ]
            })
        })
    });
};
var $ddaf3c6577962ab4$export$2e2bcd8739ae039 = $ddaf3c6577962ab4$var$ChevronRight;



var $e5981d21af543faf$var$MenuIcon = function(props) {
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("svg", {
        className: props.className,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("g", {
            "data-name": "Layer 2",
            children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("g", {
                "data-name": "more-vertical",
                children: [
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("rect", {
                        width: "24",
                        height: "24",
                        transform: "rotate(-90 12 12)",
                        opacity: "0"
                    }),
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("circle", {
                        cx: "12",
                        cy: "12",
                        r: "2"
                    }),
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("circle", {
                        cx: "12",
                        cy: "5",
                        r: "2"
                    }),
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("circle", {
                        cx: "12",
                        cy: "19",
                        r: "2"
                    })
                ]
            })
        })
    });
};
var $e5981d21af543faf$export$2e2bcd8739ae039 = $e5981d21af543faf$var$MenuIcon;


var $1c7a61445362ebf7$export$a9676248d3e54baf = {
    ChevronDown: $de758c447aa9231a$export$2e2bcd8739ae039,
    ChevronLeft: $2764ed95df1a4c11$export$2e2bcd8739ae039,
    ChevronRight: $ddaf3c6577962ab4$export$2e2bcd8739ae039,
    Calendar: $cea2a6b325f4edcd$export$2e2bcd8739ae039,
    More: $e5981d21af543faf$export$2e2bcd8739ae039
};










var $224cea852abf103b$var$ButtonIcon = function(props) {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(false), 2), isPressed = ref[0], setIsPressed = ref[1];
    var children = props.children, onClick = props.onClick, size = props.size, disabled = props.disabled, isDark = props.isDark, iconSize = props.iconSize, noActive = props.noActive, backdropClassName = props.backdropClassName, style = props.style;
    var handleTouchStart = function() {
        return setIsPressed(true);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var handleTouchOff = function(e) {
        return setIsPressed(false);
    };
    var containerClassName = !size ? 'Kalend__ButtonIcon__container' : "Kalend__ButtonIcon__container-".concat(size);
    var backdropClassNameString = backdropClassName ? backdropClassName : 'Kalend__ButtonIcon__backdrop';
    var buttonClassName = noActive ? "".concat(disabled ? 'Kalend__ButtonIcon__disabled ' : '', "Kalend__ButtonIcon-inactive") : "".concat(disabled ? 'Kalend__ButtonIcon__disabled ' : '', "Kalend__ButtonIcon");
    var IconElement = /*#__PURE__*/ ($parcel$interopDefault($cw6c3$react)).cloneElement(children, {
        className: "Kalend__ButtonIcon__svg".concat(iconSize ? "-".concat(iconSize) : '-normal')
    });
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        className: containerClassName,
        style: style,
        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("button", {
            className: $bf7b38bce41ca3dd$export$b7a9dbebc395fc65(buttonClassName, isDark),
            onClick: onClick,
            disabled: disabled,
            onTouchStart: handleTouchStart,
            onTouchEnd: handleTouchOff,
            children: [
                IconElement,
                isPressed ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                    className: backdropClassNameString
                }) : null
            ]
        })
    });
};
var $224cea852abf103b$export$2e2bcd8739ae039 = $224cea852abf103b$var$ButtonIcon;

















var $6188babcb8da6286$var$HeaderCalendarButton = function(props) {
    var buttonData = props.buttonData, setViewChanged = props.setViewChanged, handleClose = props.handleClose, isForcedMobile = props.isForcedMobile;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var isDark = store.isDark, selectedView = store.selectedView, isMobile = store.isMobile;
    var isSelected = buttonData.value === selectedView;
    var buttonClassName = "Kalend__header_calendar_button".concat(isSelected ? '-selected' : '');
    var textClassName = "Kalend__text Kalend__header_calendar_button-text".concat(isSelected ? '-selected' : '');
    var navigateFunction = function() {
        if (handleClose) handleClose();
        setViewChanged(buttonData.value);
    };
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($f7dc25aaa4235907$export$2e2bcd8739ae039, {
        className: $bf7b38bce41ca3dd$export$cf733e3bd5432c08(buttonClassName, isMobile || isForcedMobile),
        isDark: isDark,
        onClick: navigateFunction,
        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("p", {
            className: $bf7b38bce41ca3dd$export$cf733e3bd5432c08(textClassName, isMobile, isDark),
            children: buttonData.label
        })
    });
};
var $6188babcb8da6286$export$72c130881ba16236 = function(disabledViews) {
    if (!disabledViews || disabledViews && (disabledViews === null || disabledViews === void 0 ? void 0 : disabledViews.length) + 1 !== Object.values($e4750b0ebeed8e48$export$ec9758e21af63072).length) return false;
    return true;
};
/**
 * Buttons for switching calendar view in desktop layout
 * @constructor
 */ var $6188babcb8da6286$var$HeaderCalendarButtons = function(props) {
    var disabledViews = props.disabledViews, setViewChanged = props.setViewChanged, handleClose = props.handleClose, isForcedMobile = props.isForcedMobile;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var isDark = store.isDark, isMobile = store.isMobile, translations = store.translations;
    return $6188babcb8da6286$export$72c130881ba16236(disabledViews) ? null : /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
        className: $bf7b38bce41ca3dd$export$cf733e3bd5432c08('Kalend__header_calendar_buttons__container', !!(isMobile || isForcedMobile), isDark),
        children: [
            !(disabledViews === null || disabledViews === void 0 ? void 0 : disabledViews.includes($e4750b0ebeed8e48$export$ec9758e21af63072.AGENDA)) ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($6188babcb8da6286$var$HeaderCalendarButton, {
                buttonData: {
                    label: translations['buttons']['agenda'],
                    value: $e4750b0ebeed8e48$export$ec9758e21af63072.AGENDA
                },
                setViewChanged: setViewChanged,
                handleClose: handleClose,
                isForcedMobile: isForcedMobile
            }) : null,
            !(disabledViews === null || disabledViews === void 0 ? void 0 : disabledViews.includes($e4750b0ebeed8e48$export$ec9758e21af63072.DAY)) ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($6188babcb8da6286$var$HeaderCalendarButton, {
                buttonData: {
                    label: translations['buttons']['day'],
                    value: $e4750b0ebeed8e48$export$ec9758e21af63072.DAY
                },
                setViewChanged: setViewChanged,
                handleClose: handleClose,
                isForcedMobile: isForcedMobile
            }) : null,
            !(disabledViews === null || disabledViews === void 0 ? void 0 : disabledViews.includes($e4750b0ebeed8e48$export$ec9758e21af63072.THREE_DAYS)) ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($6188babcb8da6286$var$HeaderCalendarButton, {
                buttonData: {
                    label: translations['buttons']['threeDays'],
                    value: $e4750b0ebeed8e48$export$ec9758e21af63072.THREE_DAYS
                },
                setViewChanged: setViewChanged,
                handleClose: handleClose,
                isForcedMobile: isForcedMobile
            }) : null,
            !(disabledViews === null || disabledViews === void 0 ? void 0 : disabledViews.includes($e4750b0ebeed8e48$export$ec9758e21af63072.WEEK)) ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($6188babcb8da6286$var$HeaderCalendarButton, {
                buttonData: {
                    label: translations['buttons']['week'],
                    value: $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK
                },
                setViewChanged: setViewChanged,
                handleClose: handleClose,
                isForcedMobile: isForcedMobile
            }) : null,
            !(disabledViews === null || disabledViews === void 0 ? void 0 : disabledViews.includes($e4750b0ebeed8e48$export$ec9758e21af63072.MONTH)) ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($6188babcb8da6286$var$HeaderCalendarButton, {
                buttonData: {
                    label: translations['buttons']['month'],
                    value: $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH
                },
                setViewChanged: setViewChanged,
                handleClose: handleClose,
                isForcedMobile: isForcedMobile
            }) : null
        ]
    });
};
var $6188babcb8da6286$export$2e2bcd8739ae039 = $6188babcb8da6286$var$HeaderCalendarButtons;


var $95f304efc96ef4c9$var$CalendarViewDropdown = function(props) {
    var setViewChanged = props.setViewChanged;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(false), 2), isOpen = ref[0], setOpen = ref[1];
    var ref1 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref1[0];
    var config = store.config, isMobile = store.isMobile, selectedView = store.selectedView, translations = store.translations;
    var isDark = config.isDark, disabledViews = config.disabledViews, disableMobileDropdown = config.disableMobileDropdown;
    var handleOpen = function() {
        return setOpen(true);
    };
    var handleClose = function() {
        return setOpen(false);
    };
    var preventDefault = function(e) {
        e.preventDefault();
        e.stopPropagation();
    };
    return isMobile && (disableMobileDropdown || $6188babcb8da6286$export$72c130881ba16236(disabledViews)) || $6188babcb8da6286$export$72c130881ba16236(disabledViews) ? null : /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($cw6c3$reactjsxruntime.Fragment, {
        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
            className: 'Kalend__CalendarViewDropdown__wrapper',
            children: [
                isMobile ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($224cea852abf103b$export$2e2bcd8739ae039, {
                    isDark: isDark,
                    onClick: handleOpen,
                    children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($1c7a61445362ebf7$export$a9676248d3e54baf.More, {
                        className: $bf7b38bce41ca3dd$export$b7a9dbebc395fc65('icon-svg', isDark)
                    })
                }, 'calendar') : /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($f7dc25aaa4235907$export$2e2bcd8739ae039, {
                    isDark: isDark,
                    className: 'Kalend__ButtonBase-border',
                    onClick: handleOpen,
                    text: $bf7b38bce41ca3dd$export$205aaf06acb1c5fc(selectedView, translations)
                }),
                isOpen ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                    className: 'Kalend__CalendarViewDropdown__backdrop',
                    onClick: handleClose
                }) : null,
                isOpen ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                    className: 'Kalend__CalendarViewDropdown__container',
                    children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                        className: 'Kalend__CalendarViewDropdown__container-content',
                        onClick: preventDefault,
                        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($6188babcb8da6286$export$2e2bcd8739ae039, {
                            disabledViews: disabledViews,
                            setViewChanged: setViewChanged,
                            handleClose: handleClose,
                            isForcedMobile: true
                        })
                    })
                }) : null
            ]
        })
    });
};
var $95f304efc96ef4c9$export$2e2bcd8739ae039 = $95f304efc96ef4c9$var$CalendarViewDropdown;






var $d2b46716a1f3a2a1$var$DesktopLayout = function(props) {
    var children = props.children;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var isMobile = store.isMobile;
    return !isMobile ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        className: 'Kalend__DesktopLayout',
        children: children
    }) : null;
};
var $d2b46716a1f3a2a1$export$2e2bcd8739ae039 = $d2b46716a1f3a2a1$var$DesktopLayout;








/**
 * Calendar title in header in month date format
 * @param props
 * @constructor
 */ var $e8a58db0b7f8e0e1$var$HeaderCalendarTitle = function(props) {
    var title = props.title;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var isDark = store.isDark, isMobile = store.isMobile;
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        className: $bf7b38bce41ca3dd$export$cf733e3bd5432c08("Kalend__HeaderCalendarTitle__container", isMobile),
        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("p", {
            className: $bf7b38bce41ca3dd$export$cf733e3bd5432c08('Kalend__text Kalend__HeaderCalendarTitle', isMobile, isDark),
            children: title
        })
    });
};
var $e8a58db0b7f8e0e1$export$2e2bcd8739ae039 = $e8a58db0b7f8e0e1$var$HeaderCalendarTitle;






var $60dd5ae4676e5d2e$var$MobileLayout = function(props) {
    var children = props.children, style = props.style;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var isMobile = store.isMobile;
    return isMobile ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        className: 'Kalend__MobileLayout',
        style: style,
        children: children
    }) : null;
};
var $60dd5ae4676e5d2e$export$2e2bcd8739ae039 = $60dd5ae4676e5d2e$var$MobileLayout;


/**
 * Title with calendar navigation buttons for desktop layout
 * @param props
 * @constructor
 */ var $21db0de5ba63f204$var$CalendarDesktopNavigation = function(props) {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 2), store = ref[0], dispatch = ref[1];
    var setContext = function(type, payload) {
        dispatch({
            type: type,
            payload: payload
        });
    };
    var config = store.config, calendarDays = store.calendarDays, selectedView = store.selectedView, selectedDate = store.selectedDate, isMobile = store.isMobile, width = store.width, translations = store.translations;
    var weekDayStart = config.weekDayStart, isDark = config.isDark;
    var ref1 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(true), 2), isFullNavigationHidden = ref1[0], setIsFullNavigationHidden = ref1[1];
    var titleDate = $cw6c3$luxon.DateTime.fromISO(selectedDate);
    var title = "".concat(translations['months']["".concat(titleDate.toFormat('MMMM').toLowerCase())], " ").concat(titleDate.toFormat('yyyy'));
    var navigateBackwards = function() {
        var _ref = $cw6c3$swchelpers.asyncToGenerator(($parcel$interopDefault($cw6c3$regeneratorruntime)).mark(function _callee() {
            return ($parcel$interopDefault($cw6c3$regeneratorruntime)).wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        setContext('calendarContent', null);
                        setContext('direction', $e4750b0ebeed8e48$export$c2bed76d77ee7287.BACKWARDS);
                        $63103f0ef67d319d$export$3d0db7ed812b6b3f(calendarDays, selectedView, $e4750b0ebeed8e48$export$c2bed76d77ee7287.BACKWARDS, weekDayStart, setContext);
                    case 3:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
        return function navigateBackwards() {
            return _ref.apply(this, arguments);
        };
    }();
    var navigateForward = function() {
        var _ref = $cw6c3$swchelpers.asyncToGenerator(($parcel$interopDefault($cw6c3$regeneratorruntime)).mark(function _callee() {
            return ($parcel$interopDefault($cw6c3$regeneratorruntime)).wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        setContext('calendarContent', null);
                        setContext('direction', $e4750b0ebeed8e48$export$c2bed76d77ee7287.FORWARD);
                        $63103f0ef67d319d$export$3d0db7ed812b6b3f(calendarDays, selectedView, $e4750b0ebeed8e48$export$c2bed76d77ee7287.FORWARD, weekDayStart, setContext);
                    case 3:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
        return function navigateForward() {
            return _ref.apply(this, arguments);
        };
    }();
    var navigateToTodayDate = function() {
        var _ref = $cw6c3$swchelpers.asyncToGenerator(($parcel$interopDefault($cw6c3$regeneratorruntime)).mark(function _callee() {
            return ($parcel$interopDefault($cw6c3$regeneratorruntime)).wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        setContext('calendarContent', null);
                        setContext('direction', $e4750b0ebeed8e48$export$c2bed76d77ee7287.TODAY);
                        _ctx.next = 4;
                        return $63103f0ef67d319d$export$28b655052872eb26(selectedView, setContext, weekDayStart, $cw6c3$luxon.DateTime.now());
                    case 4:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
        return function navigateToTodayDate() {
            return _ref.apply(this, arguments);
        };
    }();
    // handle showing  full desktop navigation panel or dropdown for
    // different screen size
    $cw6c3$react.useEffect(function() {
        var element = document.querySelector('.Kalend__CalendarDesktopNavigation__container');
        if (element) {
            if (element) {
                if (element.getBoundingClientRect().width <= 950) setIsFullNavigationHidden(true);
                else setIsFullNavigationHidden(false);
            }
        }
    }, [
        width
    ]);
    // add funcs to ref
    $cw6c3$react.useEffect(function() {
        if (props.kalendRef) props.kalendRef.current = {
            navigateToTodayDate: navigateToTodayDate,
            navigateForward: navigateForward,
            navigateBackwards: navigateBackwards
        };
    }, []);
    $cw6c3$react.useEffect(function() {
        if (props.kalendRef) props.kalendRef.current = {
            navigateToTodayDate: navigateToTodayDate,
            navigateForward: navigateForward,
            navigateBackwards: navigateBackwards
        };
    }, [
        selectedView,
        calendarDays[0].toString()
    ]);
    return props.kalendRef ? null : /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
        className: $bf7b38bce41ca3dd$export$cf733e3bd5432c08('Kalend__CalendarDesktopNavigation__container', isMobile, isDark),
        children: [
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'row',
                    width: isMobile ? '100%' : 'auto'
                },
                children: [
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($d2b46716a1f3a2a1$export$2e2bcd8739ae039, {
                        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                            className: 'Kalend__CalendarDesktopNavigation__buttons',
                            children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs($cw6c3$reactjsxruntime.Fragment, {
                                children: [
                                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($f7dc25aaa4235907$export$2e2bcd8739ae039, {
                                        className: 'Kalend__ButtonBase-border',
                                        isDark: isDark,
                                        onClick: navigateToTodayDate,
                                        children: translations['buttons']['today']
                                    }),
                                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($224cea852abf103b$export$2e2bcd8739ae039, {
                                        isDark: isDark,
                                        onClick: navigateBackwards,
                                        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($1c7a61445362ebf7$export$a9676248d3e54baf.ChevronLeft, {
                                            className: $bf7b38bce41ca3dd$export$b7a9dbebc395fc65('Kalend__icon-svg', isDark)
                                        })
                                    }, 'left'),
                                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($224cea852abf103b$export$2e2bcd8739ae039, {
                                        isDark: isDark,
                                        onClick: navigateForward,
                                        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($1c7a61445362ebf7$export$a9676248d3e54baf.ChevronRight, {
                                            className: $bf7b38bce41ca3dd$export$b7a9dbebc395fc65('Kalend__icon-svg', isDark)
                                        })
                                    }, 'right')
                                ]
                            })
                        })
                    }),
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($e8a58db0b7f8e0e1$export$2e2bcd8739ae039, {
                        title: title
                    }),
                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($60dd5ae4676e5d2e$export$2e2bcd8739ae039, {
                        style: {
                            width: '100%'
                        },
                        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                            className: 'Kalend__CalendarDesktopNavigation__buttons',
                            children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs($cw6c3$reactjsxruntime.Fragment, {
                                children: [
                                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($224cea852abf103b$export$2e2bcd8739ae039, {
                                        isDark: isDark,
                                        onClick: navigateBackwards,
                                        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($1c7a61445362ebf7$export$a9676248d3e54baf.ChevronLeft, {
                                            className: $bf7b38bce41ca3dd$export$b7a9dbebc395fc65('Kalend__icon-svg', isDark)
                                        })
                                    }, 'left'),
                                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($224cea852abf103b$export$2e2bcd8739ae039, {
                                        isDark: isDark,
                                        onClick: navigateForward,
                                        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($1c7a61445362ebf7$export$a9676248d3e54baf.ChevronRight, {
                                            className: $bf7b38bce41ca3dd$export$b7a9dbebc395fc65('Kalend__icon-svg', isDark)
                                        })
                                    }, 'right'),
                                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($224cea852abf103b$export$2e2bcd8739ae039, {
                                        isDark: isDark,
                                        onClick: navigateToTodayDate,
                                        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($1c7a61445362ebf7$export$a9676248d3e54baf.Calendar, {
                                            className: $bf7b38bce41ca3dd$export$b7a9dbebc395fc65('Kalend__icon-svg', isDark)
                                        })
                                    }, 'calendar'),
                                    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($95f304efc96ef4c9$export$2e2bcd8739ae039, {
                                        disabledViews: props.disabledViews,
                                        setViewChanged: props.setViewChanged,
                                        disableMobileDropdown: props.disableMobileDropdown
                                    })
                                ]
                            })
                        })
                    })
                ]
            }),
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'row',
                    marginRight: 12,
                    justifyContent: 'flex-end',
                    flex: 'auto'
                },
                children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($d2b46716a1f3a2a1$export$2e2bcd8739ae039, {
                    children: isFullNavigationHidden ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($95f304efc96ef4c9$export$2e2bcd8739ae039, {
                        disabledViews: props.disabledViews,
                        setViewChanged: props.setViewChanged,
                        disableMobileDropdown: props.disableMobileDropdown
                    }) : /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($6188babcb8da6286$export$2e2bcd8739ae039, {
                        disabledViews: props.disabledViews,
                        setViewChanged: props.setViewChanged
                    })
                })
            })
        ]
    });
};
var $21db0de5ba63f204$export$2e2bcd8739ae039 = $21db0de5ba63f204$var$CalendarDesktopNavigation;












var $9a525da4604d3f07$var$CalendarHeaderColText = function(props) {
    var children = props.children;
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        className: 'Kalend__CalendarHeaderColText__container',
        children: children
    });
};
var $9a525da4604d3f07$export$2e2bcd8739ae039 = $9a525da4604d3f07$var$CalendarHeaderColText;












var $2a3380b4418c18d4$var$CalendarHeaderCol = function(props) {
    var children = props.children;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var isDark = store.isDark;
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        className: $bf7b38bce41ca3dd$export$b7a9dbebc395fc65('Kalend__CalendarHeaderCol', isDark),
        children: children
    });
};
var $2a3380b4418c18d4$export$2e2bcd8739ae039 = $2a3380b4418c18d4$var$CalendarHeaderCol;




/**
 * Get numeric representation of days
 *
 * @param props
 * @constructor
 */ var $0c3afbe9f694dbf0$var$CalendarHeaderDates = function(props) {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var width = store.width, isMobile = store.isMobile, selectedView = store.selectedView;
    var daysNum = props.daysNum, calendarDays = props.calendarDays;
    var colWidth = $bf7b38bce41ca3dd$export$b32ccbc1ca23891(width, isMobile, selectedView) / daysNum;
    var renderNumericDays = function() {
        return calendarDays.map(function(calendarDay) {
            return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($ecf585202d453fcb$export$2e2bcd8739ae039, {
                width: colWidth,
                day: calendarDay
            }, calendarDay.toString());
        });
    };
    var numericDays = renderNumericDays();
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($2a3380b4418c18d4$export$2e2bcd8739ae039, {
        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($9a525da4604d3f07$export$2e2bcd8739ae039, {
            children: numericDays
        })
    });
};
var $0c3afbe9f694dbf0$export$2e2bcd8739ae039 = $0c3afbe9f694dbf0$var$CalendarHeaderDates;










/**
 * Render text representation of days
 *
 * @param props
 * @constructor
 */ var $386a7bec00aa15a1$var$CalendarHeaderWeekDays = function(props) {
    var daysNum = props.daysNum, days = props.days;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var width = store.width, selectedView = store.selectedView, isMobile = store.isMobile, config = store.config, translations = store.translations;
    var weekDayStart = config.weekDayStart;
    var isMonthView = selectedView === $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH;
    var colWidth = isMonthView ? width / daysNum : $bf7b38bce41ca3dd$export$b32ccbc1ca23891(width, isMobile, selectedView) / daysNum;
    var weekDays = weekDayStart === $e4750b0ebeed8e48$export$5a05f7ffc0500403.SUNDAY ? $1500da26cef85c66$export$88e7cb308ec58e48 : $1500da26cef85c66$export$933d53aed74a6ef0;
    var renderDaysText = function() {
        var dayTextColumnWidth = {
            width: colWidth
        };
        if (isMonthView) return weekDays.map(function(day) {
            return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                className: 'Kalend__CalendarHeaderWeekDays__col',
                style: dayTextColumnWidth,
                children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("p", {
                    className: 'Kalend__text Kalend__CalendarHeaderWeekDays__text',
                    children: translations['weekDays']["".concat(day)]
                })
            }, day);
        });
        return days.map(function(calendarDay) {
            return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($0689dc746d054cae$export$2e2bcd8739ae039, {
                day: calendarDay,
                width: colWidth
            }, calendarDay.toString());
        });
    };
    var namesForDays = renderDaysText();
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        className: 'Kalend__CalendarHeaderWeekDays__wrapper',
        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
            className: 'Kalend__CalendarHeaderWeekDays__container',
            children: namesForDays
        })
    });
};
var $386a7bec00aa15a1$export$2e2bcd8739ae039 = $386a7bec00aa15a1$var$CalendarHeaderWeekDays;








var $a214409a8fa5f760$var$CalendarHeaderWrapper = function(props) {
    var children = props.children, isMonthView = props.isMonthView;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var width = store.width, isDark = store.isDark;
    var headerStyle = {
        paddingLeft: isMonthView ? 0 : $88a08af890f49243$export$447c5938f45c45a5,
        width: width
    };
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        className: $bf7b38bce41ca3dd$export$b7a9dbebc395fc65('Kalend__CalendarHeaderCol', isDark),
        style: headerStyle,
        children: children
    });
};
var $a214409a8fa5f760$export$2e2bcd8739ae039 = $a214409a8fa5f760$var$CalendarHeaderWrapper;


var $2d4e959c42b07254$var$CalendarHeaderDays = function(props) {
    var isMonthView = props.isMonthView;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var calendarDays = store.calendarDays;
    var daysNum = isMonthView ? 7 : calendarDays.length;
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs($a214409a8fa5f760$export$2e2bcd8739ae039, {
        isMonthView: isMonthView,
        children: [
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($9a525da4604d3f07$export$2e2bcd8739ae039, {
                children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($386a7bec00aa15a1$export$2e2bcd8739ae039, {
                    daysNum: daysNum,
                    days: calendarDays
                })
            }),
            !isMonthView ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($9a525da4604d3f07$export$2e2bcd8739ae039, {
                children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($0c3afbe9f694dbf0$export$2e2bcd8739ae039, {
                    calendarDays: calendarDays,
                    daysNum: daysNum
                })
            }) : null
        ]
    });
};
var $2d4e959c42b07254$export$2e2bcd8739ae039 = $2d4e959c42b07254$var$CalendarHeaderDays;










var $89f45f2bf33757e0$var$CalendarHeaderEvents = function() {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 2), store = ref[0], dispatch = ref[1];
    var selectedView = store.selectedView, width = store.width, calendarDays = store.calendarDays;
    var setContext = function(type, payload) {
        dispatch({
            type: type,
            payload: payload
        });
    };
    var renderEvents = function(data, sequence) {
        return data === null || data === void 0 ? void 0 : data.map(function(item) {
            // const item: any = keyValue[1];
            return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($b852c5f3008abacb$export$2e2bcd8739ae039, {
                item: item,
                type: $e4750b0ebeed8e48$export$76a2e4c433c23bb9.HEADER
            }, "".concat(item.event.id).concat(item.event.internalID ? item.event.internalID : '') + sequence);
        });
    };
    var column = width / $1500da26cef85c66$export$f16d393a3268e3f3(selectedView);
    var colWidthStyle = {
        width: column
    };
    var daysNumbers = calendarDays.map(function(calendarDay) {
        return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
            className: 'Kalend__CalendarHeaderEvents__col-wrapper',
            style: colWidthStyle
        }, calendarDay.toString());
    });
    var ref1 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(null), 2), headerEvents = ref1[0], setHeaderEvents = ref1[1];
    var headerStyle = {
        // paddingLeft: CALENDAR_OFFSET_LEFT,
        height: store.headerEventRowsCount + 20
    };
    $cw6c3$react.useEffect(function() {
        // setTimeout(() => {
        setContext('height', $2c4fe1f6b84a6784$export$c08559766941f856());
    // }, 600);
    }, [
        store.headerEventRowsCount
    ]);
    // useEffect(() => {
    //   // set animation
    //   setAnimation('Kalend__CalendarHeaderEvents_animationExpand');
    //   // clean animation
    //   setTimeout(() => {
    //     setAnimation('');
    //   }, 600);
    // }, [store.headerEventRowsCount]);
    $cw6c3$react.useEffect(function() {
        var headerEventsRaw = renderEvents(store.headerLayout, store.layoutUpdateSequence + 1);
        setHeaderEvents(headerEventsRaw);
    }, [
        JSON.stringify(store.headerLayout)
    ]);
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
        className: "Kalend__CalendarHeaderEvents__container",
        // className={`Kalend__CalendarHeaderEvents__container ${animation}`}
        style: headerStyle,
        children: [
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                className: 'Kalend__CalendarHeaderEvents__row',
                children: daysNumbers
            }),
            headerEvents
        ]
    });
};
var $89f45f2bf33757e0$export$2e2bcd8739ae039 = $89f45f2bf33757e0$var$CalendarHeaderEvents;


var $58f20473f1f0067a$var$CalendarHeader = function() {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var isDark = store.isDark, width = store.width, selectedView = store.selectedView;
    var isDayView = selectedView === $e4750b0ebeed8e48$export$ec9758e21af63072.DAY;
    var isMonthView = selectedView === $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH;
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
        className: "Kalend__CalendarHeader".concat(!isMonthView ? '-tall' : '').concat(isDayView ? '-day' : '').concat(isMonthView ? '-small' : '').concat(isDark ? '-dark' : ''),
        children: [
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($2d4e959c42b07254$export$2e2bcd8739ae039, {
                width: width,
                isMonthView: isMonthView
            }),
            !isMonthView && store.headerLayout ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($89f45f2bf33757e0$export$2e2bcd8739ae039, {}) : null
        ]
    });
};
var $58f20473f1f0067a$export$2e2bcd8739ae039 = $58f20473f1f0067a$var$CalendarHeader;






var $f89b7b16d8022e68$var$CalendarTableLayoutLayer = function(props) {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var calendarDays = store.calendarDays, selectedView = store.selectedView, callbacks = store.callbacks, config = store.config, width = store.width, direction = store.direction;
    var ref1 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(false), 2), isMounted = ref1[0], setIsMounted = ref1[1];
    $cw6c3$react.useEffect(function() {
        var rootEl = document.querySelector('.Kalend__Calendar__table');
        if (rootEl) setIsMounted(true);
    }, [
        document.querySelector('.Kalend__Calendar__table')
    ]);
    // Expose basic state to outside
    $cw6c3$react.useLayoutEffect(function() {
        if (callbacks.onStateChange && isMounted) {
            var data = {
                selectedView: selectedView,
                calendarDays: calendarDays,
                range: $cw6c3$swchelpers.objectSpread({}, $1500da26cef85c66$export$fef151b94550e9f5(calendarDays), {
                    direction: direction
                }),
                width: width,
                config: config,
                isMobile: store.isMobile,
                height: store.height,
                selectedDate: store.selectedDate.toUTC().toString()
            };
            callbacks.onStateChange(data);
        }
    }, [
        selectedView,
        JSON.stringify(calendarDays),
        width,
        JSON.stringify(config),
        store.isMobile,
        isMounted,
        direction, 
    ]);
    $cw6c3$react.useEffect(function() {
        if (callbacks.onStateChange && isMounted) {
            var data = {
                selectedView: selectedView,
                calendarDays: calendarDays,
                range: $cw6c3$swchelpers.objectSpread({}, $1500da26cef85c66$export$fef151b94550e9f5(calendarDays), {
                    direction: direction
                }),
                width: width,
                config: config,
                isMobile: store.isMobile,
                height: store.height,
                selectedDate: store.selectedDate.toUTC().toString()
            };
            callbacks.onStateChange(data);
        }
    }, []);
    return isMounted ? props.children : null;
};
var $f89b7b16d8022e68$export$2e2bcd8739ae039 = $f89b7b16d8022e68$var$CalendarTableLayoutLayer;


















var $db9a28e0bd6328b4$var$renderHours = function(width, hourHeight, isDark, timeFormat) {
    return $bf7b38bce41ca3dd$export$d9b78e6f3f437c1f(timeFormat).map(function(hour) {
        return hour === '00' || hour === '24' ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
            className: 'Kalend__CalendarBodyHours__container',
            style: {
                minHeight: hourHeight
            }
        }, hour) : /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
            className: 'Kalend__CalendarBodyHours__container',
            style: {
                minHeight: hourHeight
            },
            children: [
                /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("p", {
                    className: $bf7b38bce41ca3dd$export$b7a9dbebc395fc65('Kalend__text Kalend__CalendarBodyHours__text', isDark),
                    children: hour
                }),
                /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                    className: $bf7b38bce41ca3dd$export$b7a9dbebc395fc65('Kalend__text Kalend__CalendarBodyHours__line', isDark),
                    style: {
                        width: width - $88a08af890f49243$export$447c5938f45c45a5
                    }
                })
            ]
        }, hour);
    });
};
var $db9a28e0bd6328b4$var$CalendarBodyHours = function() {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var width = store.width, config = store.config, isDark = store.isDark;
    var hourHeight = config.hourHeight, timeFormat = config.timeFormat;
    var height = $2c4fe1f6b84a6784$export$30dc190df7e420c4();
    var hours = $db9a28e0bd6328b4$var$renderHours(width, hourHeight, isDark, timeFormat);
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        className: 'Kalend__CalendarBodyHours__wrapper',
        style: {
            height: height
        },
        children: hours
    });
};
var $db9a28e0bd6328b4$export$2e2bcd8739ae039 = $db9a28e0bd6328b4$var$CalendarBodyHours;


















var $1a47dae3ce368d80$var$CurrentHourLine = function() {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var config = store.config, colors = store.colors;
    var currentTime = $cw6c3$luxon.DateTime.now();
    var wrapperStyle = {
        top: currentTime.hour * config.hourHeight + currentTime.minute / 60 * config.hourHeight
    };
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
        style: wrapperStyle,
        className: 'Kalend__CurrentHourLine',
        children: [
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                className: $bf7b38bce41ca3dd$export$b7a9dbebc395fc65('Kalend__CurrentHourLine__circle', false),
                style: {
                    background: store.style.primaryColor
                }
            }),
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                style: {
                    background: store.style.primaryColor
                },
                className: $bf7b38bce41ca3dd$export$b7a9dbebc395fc65('Kalend__CurrentHourLine__line', false)
            })
        ]
    });
};
var $1a47dae3ce368d80$export$2e2bcd8739ae039 = $1a47dae3ce368d80$var$CurrentHourLine;


var $17d79b7922eec8b8$var$renderEvents = function(dataset, day) {
    return dataset.map(function(eventRaw) {
        var item = eventRaw.event;
        return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($b852c5f3008abacb$export$2e2bcd8739ae039, {
            item: eventRaw,
            type: $e4750b0ebeed8e48$export$76a2e4c433c23bb9.NORMAL,
            meta: item.meta,
            day: day
        }, "".concat(item.id).concat(item.internalID ? item.internalID : ''));
    });
};
var $17d79b7922eec8b8$var$DaysViewOneDay = function(props) {
    var ref;
    var day = props.day, index = props.index, data = props.data;
    var ref1 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref1[0];
    var width = store.width, selectedView = store.selectedView, config = store.config, callbacks = store.callbacks;
    var onNewEventClick = callbacks.onNewEventClick;
    var isDark = config.isDark, hourHeight = config.hourHeight, showTimeLine = config.showTimeLine;
    var oneDayStyle = {
        width: width / $1500da26cef85c66$export$f16d393a3268e3f3(selectedView),
        height: hourHeight * 24
    };
    var isToday = $d49542164c9bae14$export$2e2bcd8739ae039.isToday(day);
    var isFirstDay = index === 0;
    var dataForDay = data;
    var dateNow = $cw6c3$luxon.DateTime.local();
    var nowPosition = dateNow.diff($cw6c3$luxon.DateTime.local().set({
        hour: 0,
        minute: 0,
        second: 0
    }), 'minutes').toObject().minutes / (60 / hourHeight);
    $cw6c3$react.useEffect(function() {
        if (isToday) {
            var elements = document.querySelectorAll('.calendar-body__wrapper');
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var element = _step.value;
                    element.scrollTo({
                        top: nowPosition - 40,
                        behavior: 'smooth'
                    });
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, []);
    var handleEventClickInternal = function(event) {
        if (onNewEventClick) {
            var rect = event.target.getBoundingClientRect();
            var y = event.clientY - rect.top;
            // Get hour from click event
            var hour = y / hourHeight;
            onNewEventClick({
                day: day.toJSDate(),
                hour: hour,
                event: event
            });
        }
    };
    return ((ref = store.daysViewLayout) === null || ref === void 0 ? void 0 : ref[$bf7b38bce41ca3dd$export$6a8d31c8b7f17aa5(day)]) ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
        id: "Kalend__day__".concat(day.toString()),
        style: oneDayStyle,
        className: !isFirstDay ? $bf7b38bce41ca3dd$export$b7a9dbebc395fc65('Kalend__DayViewOneDay', isDark) : 'Kalend__DayViewOneDay',
        onClick: handleEventClickInternal,
        children: [
            isToday && showTimeLine ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($1a47dae3ce368d80$export$2e2bcd8739ae039, {}) : null,
            dataForDay && dataForDay.length > 0 ? $17d79b7922eec8b8$var$renderEvents(dataForDay, day) : null
        ]
    }, day.toString()) : /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        id: "Kalend__day__".concat(day.toString()),
        style: oneDayStyle,
        className: !isFirstDay ? $bf7b38bce41ca3dd$export$b7a9dbebc395fc65('Kalend__DayViewOneDay', isDark) : 'Kalend__DayViewOneDay',
        onClick: handleEventClickInternal
    }, day.toString());
};
var $17d79b7922eec8b8$export$2e2bcd8739ae039 = $17d79b7922eec8b8$var$DaysViewOneDay;









var $b867b3e906676344$var$renderVerticalLines = function(calendarDays, width, height, hourHeight, isDark, isMobile, selectedView) {
    var columnWidth = $bf7b38bce41ca3dd$export$b32ccbc1ca23891(width, isMobile, selectedView) / calendarDays.length;
    return calendarDays.map(function(calendarDay, index) {
        var style = {
            left: columnWidth * index + (selectedView === $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH ? 0 : $88a08af890f49243$export$447c5938f45c45a5),
            height: hourHeight * 24
        };
        if (index > 0) return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
            style: style,
            className: $bf7b38bce41ca3dd$export$b7a9dbebc395fc65('Kalend__DaysViewVerticalLine__line', isDark)
        }, index);
    });
};
var $b867b3e906676344$var$DaysViewVerticalLines = function() {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var calendarDays = store.calendarDays, width = store.width, isDark = store.isDark, height = store.height, config = store.config, isMobile = store.isMobile, selectedView = store.selectedView;
    var verticalLines = $b867b3e906676344$var$renderVerticalLines(selectedView === $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH ? calendarDays.slice(0, 7) : calendarDays, width, height, config.hourHeight, isDark, isMobile, selectedView);
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($cw6c3$reactjsxruntime.Fragment, {
        children: verticalLines
    });
};
var $b867b3e906676344$export$2e2bcd8739ae039 = $b867b3e906676344$var$DaysViewVerticalLines;



var $be26fc4a0d3aa4a6$var$renderOneDay = function(calendarDays, events, sequence) {
    return calendarDays.map(function(calendarDay, index) {
        var formattedDayString = $bf7b38bce41ca3dd$export$6a8d31c8b7f17aa5(calendarDay);
        return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($17d79b7922eec8b8$export$2e2bcd8739ae039, {
            day: calendarDay,
            index: index,
            data: events ? events[formattedDayString] : []
        }, formattedDayString + sequence);
    });
};
var $be26fc4a0d3aa4a6$var$DaysViewTable = function(props) {
    var events = props.events;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(false), 2), wasInit = ref[0], setWasInit = ref[1];
    var ref1 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(null), 2), calendarContent = ref1[0], setCalendarContent = ref1[1];
    var ref2 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 2), store = ref2[0], dispatch = ref2[1];
    var setContext = function(type, payload) {
        dispatch({
            type: type,
            payload: payload
        });
    };
    var isMobile = store.isMobile, calendarDays = store.calendarDays, width = store.width, selectedView = store.selectedView;
    var height = $2c4fe1f6b84a6784$export$30dc190df7e420c4();
    var widthHook = $2c4fe1f6b84a6784$export$3aee49006f13db09();
    var style = {
        paddingLeft: $88a08af890f49243$export$447c5938f45c45a5,
        // width: '100%',
        height: '100%'
    };
    var adjustScrollPosition = function() {
        var currentElement = document.getElementById("Kalend__timetable");
        currentElement.scrollTop = $cw6c3$luxon.DateTime.now().hour * 60;
    };
    $cw6c3$react.useEffect(function() {
        adjustScrollPosition();
    }, []);
    // const onPageChange = async (isGoingForward?: boolean) => {
    //   await getNewCalendarDays(calendarDays, selectedView, isGoingForward);
    // };
    var hasExternalLayout = props.eventLayouts !== undefined;
    // recalculate event positions on calendarDays change
    $cw6c3$react.useLayoutEffect(function() {
        if (wasInit) {
            if (!hasExternalLayout) ($parcel$interopDefault($cw6c3$kalendlayout))({
                events: events,
                width: width,
                height: height,
                calendarDays: calendarDays,
                config: store.config,
                isMobile: isMobile,
                selectedView: selectedView
            }).then(function(res) {
                setContext('headerLayout', res.headerPositions);
                setContext('headerEventRowsCount', res.headerOffsetTop);
                setContext('daysViewLayout', res.normalPositions);
                setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);
                var days = $be26fc4a0d3aa4a6$var$renderOneDay(store.calendarDays, res.normalPositions, undefined);
                setCalendarContent(days);
            });
        }
    }, [
        calendarDays[0]
    ]);
    $cw6c3$react.useLayoutEffect(function() {
        if (wasInit) {
            if (!hasExternalLayout) ($parcel$interopDefault($cw6c3$kalendlayout))({
                events: events,
                width: widthHook - $bf7b38bce41ca3dd$export$76c69f043295405f(selectedView),
                height: height,
                calendarDays: calendarDays,
                config: store.config,
                isMobile: isMobile,
                selectedView: selectedView
            }).then(function(res) {
                setContext('headerLayout', res.headerPositions);
                setContext('headerEventRowsCount', res.headerOffsetTop);
                setContext('daysViewLayout', res.normalPositions);
                setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);
                var days = $be26fc4a0d3aa4a6$var$renderOneDay(store.calendarDays, res.normalPositions, store.layoutUpdateSequence + 1);
                setCalendarContent(days);
            });
        }
    }, [
        widthHook
    ]);
    $cw6c3$react.useLayoutEffect(function() {
        if (!hasExternalLayout) ($parcel$interopDefault($cw6c3$kalendlayout))({
            events: events,
            width: width,
            height: height,
            calendarDays: calendarDays,
            config: store.config,
            isMobile: isMobile,
            selectedView: selectedView
        }).then(function(res) {
            setContext('headerLayout', res.headerPositions);
            setContext('headerEventRowsCount', res.headerOffsetTop);
            setContext('daysViewLayout', res.normalPositions);
            setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);
            var days = $be26fc4a0d3aa4a6$var$renderOneDay(store.calendarDays, res.normalPositions, store.layoutUpdateSequence + 1);
            setCalendarContent(days);
        });
    }, [
        JSON.stringify(events)
    ]);
    $cw6c3$react.useLayoutEffect(function() {
        if (!hasExternalLayout) ($parcel$interopDefault($cw6c3$kalendlayout))({
            events: events,
            width: width,
            height: height,
            calendarDays: calendarDays,
            config: store.config,
            isMobile: isMobile,
            selectedView: selectedView
        }).then(function(res) {
            setContext('headerLayout', res.headerPositions);
            setContext('headerEventRowsCount', res.headerOffsetTop);
            setContext('daysViewLayout', res.normalPositions);
            setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);
            var days = $be26fc4a0d3aa4a6$var$renderOneDay(store.calendarDays, res.normalPositions, store.layoutUpdateSequence + 1);
            setCalendarContent(days);
        });
        setWasInit(true);
    }, []);
    $cw6c3$react.useLayoutEffect(function() {
        if (hasExternalLayout && $bf7b38bce41ca3dd$export$e3e4ea182aca355e(props.eventLayouts.selectedView) === $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK) {
            setContext('headerLayout', props.eventLayouts.headerPositions);
            setContext('headerEventRowsCount', props.eventLayouts.headerOffsetTop);
            setContext('daysViewLayout', props.eventLayouts.normalPositions);
            setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);
            var days = $be26fc4a0d3aa4a6$var$renderOneDay(store.calendarDays, props.eventLayouts.normalPositions, store.layoutUpdateSequence + 1);
            setCalendarContent(days);
        }
    }, [
        props.eventLayouts,
        JSON.stringify(props.eventLayouts)
    ]);
    return(// <Carousel onPageChange={onPageChange}>
    /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
        style: style,
        className: 'Kalend__CalendarBody',
        id: "Kalend__timetable",
        children: [
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($db9a28e0bd6328b4$export$2e2bcd8739ae039, {}),
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($b867b3e906676344$export$2e2bcd8739ae039, {}),
            calendarContent
        ]
    }));
};
var $be26fc4a0d3aa4a6$export$2e2bcd8739ae039 = $be26fc4a0d3aa4a6$var$DaysViewTable;



















var $c57d36d3233524f5$export$ca41440b93b2a001 = function(event, timezone) {
    return $cw6c3$swchelpers.objectSpread({}, event, {
        startAt: $28306200f69a6328$export$6c2618c4afcf6cfb(event.startAt, event.timezoneStartAt || timezone).set({
            hour: 0,
            minute: 0,
            second: 1
        }).toString(),
        endAt: $28306200f69a6328$export$6c2618c4afcf6cfb(event.endAt, event.timezoneStartAt || timezone).set({
            hour: 23,
            minute: 59,
            second: 59
        }).toString()
    });
};
var $c57d36d3233524f5$export$ebf0f5b49a0a9e59 = function(events1, width, calendarDays, timezone, setContext) {
    var // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ref;
    // TODO prefilter only relevant events
    // TODO remove used events from main array
    // const formattedDayString: string = formatTimestampToDate(day);
    //
    // const dataForDay: any = events ? events[formattedDayString] : [];
    //
    // const headerEvents: any = renderEvents(calendarBodyWidth, dataForDay);
    //
    // compare each event and find those which can be placed next to each
    // other and are not overlapping
    // form them to row
    var tableSpace = (width + $88a08af890f49243$export$447c5938f45c45a5) / 100 * $88a08af890f49243$export$b4e2ba6756dec2c;
    var result = [];
    var usedEvents = [];
    // filter only header events
    var headerEventsFiltered = [];
    if (!events1) return [
        []
    ];
    (ref = Object.entries(events1)) === null || ref === void 0 ? void 0 : ref.map(function(param) {
        var _param = $cw6c3$swchelpers.slicedToArray(param, 2), key = _param[0], items = _param[1];
        // @ts-ignore
        items.forEach(function(item) {
            // filter only relevant events
            if (item.allDay || $bf7b38bce41ca3dd$export$23783ea7bfe28abd(item)) {
                var isInRange = $585762b051d85803$export$3a6eb9efca632dee(item, calendarDays, timezone);
                if (isInRange) // correct position when external event ends in next day
                headerEventsFiltered.push(item);
            }
        });
    });
    // find all matching events to fit in one row
    headerEventsFiltered === null || headerEventsFiltered === void 0 ? void 0 : headerEventsFiltered.forEach(function(event) {
        var eventPositionResult = [];
        // check if event was used already
        // skip iteration if event was already resolved
        if (usedEvents.includes(event.id)) return true;
        // set event to row
        var rowWithNotOverlappingEvents = [
            event
        ];
        usedEvents.push(event.id);
        // compare to rest of the events
        headerEventsFiltered.forEach(function(eventToCompare) {
            // check if event was used already
            // skip iteration if event was already resolved
            if (usedEvents.includes(eventToCompare.id)) return true;
            // don't compare to self // maybe remove?
            if (event.id === eventToCompare.id) return true;
            // check if events are not overlapping
            var isOverlapping = $585762b051d85803$export$c212dd23f1f0a1e3($c57d36d3233524f5$export$ca41440b93b2a001(event, timezone), $c57d36d3233524f5$export$ca41440b93b2a001(eventToCompare, timezone), timezone);
            // found not overlapping matching event
            if (!isOverlapping) {
                var isMatchingAll = true;
                // compare match with other stored events for same row
                rowWithNotOverlappingEvents.forEach(function(itemFromRow) {
                    var isOverlappingAll = $585762b051d85803$export$c212dd23f1f0a1e3($c57d36d3233524f5$export$ca41440b93b2a001(itemFromRow, timezone), $c57d36d3233524f5$export$ca41440b93b2a001(eventToCompare, timezone), timezone);
                    // prevent merging if only one conflict exists
                    if (isOverlappingAll) isMatchingAll = false;
                });
                if (isMatchingAll) {
                    // store compared event in used array and add to row
                    usedEvents.push(eventToCompare.id);
                    rowWithNotOverlappingEvents.push(eventToCompare);
                }
            }
        });
        // now we have row with only not overlapping events
        // sort events in row by start date
        var sortedResult = rowWithNotOverlappingEvents.sort(function(a, b) {
            return $cw6c3$luxon.DateTime.fromISO(a.startAt).toMillis() - $cw6c3$luxon.DateTime.fromISO(b.startAt).toMillis();
        });
        // place events accordingly in row next to each other
        sortedResult.forEach(function(item) {
            var offset = 0;
            var eventWidth = 0;
            var hasMatchingDay = false;
            calendarDays.forEach(function(day) {
                if ($585762b051d85803$export$f917769c218c90fd(item, day, timezone)) {
                    // set base offset only for first item
                    eventWidth += width;
                    hasMatchingDay = true;
                }
                // increment offset only till we have matching day
                if (!hasMatchingDay) offset += width;
            });
            // create event position data
            var eventPositionData = {
                event: item,
                width: Math.round(eventWidth - tableSpace),
                offsetLeft: offset + $88a08af890f49243$export$447c5938f45c45a5,
                offsetTop: 0,
                height: 20,
                zIndex: 2
            };
            eventPositionResult.push(eventPositionData);
        });
        // save row to result
        result.push(eventPositionResult);
    });
    var formattedResult = {};
    result.forEach(function(events, index) {
        events.forEach(function(item) {
            formattedResult[item.event.id] = $cw6c3$swchelpers.objectSpread({}, item, {
                offsetTop: index * 26
            });
        });
    });
    if (setContext) setContext('headerEventRowsCount', result.length);
    return formattedResult;
};


var $0491e7111fa05a9f$var$formatOverflowingEvents = function(events, timezone) {
    var result = {};
    if (!events || events.length === 0) return null;
    events.forEach(function(event) {
        var dateTimeStartAt = $28306200f69a6328$export$6c2618c4afcf6cfb(event.startAt, event.timezoneStartAt || timezone);
        var dateTimeEndAt = $28306200f69a6328$export$6c2618c4afcf6cfb(event.endAt, event.timezoneStartAt || timezone);
        // get each day for multi day events
        // @ts-ignore
        var differenceInDays = dateTimeEndAt.diff(dateTimeStartAt).days;
        for(var i = 0; i <= differenceInDays; i++){
            var dateKey = $bf7b38bce41ca3dd$export$6a8d31c8b7f17aa5(dateTimeStartAt.plus({
                days: i
            }));
            if (!result[dateKey]) result[dateKey] = [
                event
            ];
            else result[dateKey] = $cw6c3$swchelpers.toConsumableArray(result[dateKey]).concat([
                event
            ]);
        }
    });
    return result;
};
var $0491e7111fa05a9f$export$89831913a243f8ab = function(calendarDays) {
    var calendarDaysRows = [];
    var tempArray = [];
    calendarDays.forEach(function(item, i) {
        var index = i + 1;
        if (index % 7 === 0) {
            tempArray.push(item);
            calendarDaysRows.push(tempArray);
            tempArray = [];
        } else tempArray.push(item);
    });
    return calendarDaysRows;
};
var $0491e7111fa05a9f$export$d27f846d3c4971c6 = function(events) {
    return events.sort(function(a, b) {
        var diffA = $cw6c3$luxon.DateTime.fromISO(a.endAt).toMillis() - $cw6c3$luxon.DateTime.fromISO(a.startAt).toMillis();
        var diffB = $cw6c3$luxon.DateTime.fromISO(b.endAt).toMillis() - $cw6c3$luxon.DateTime.fromISO(b.startAt).toMillis();
        if (diffB > diffA) return 1;
        else if (diffB < diffA) return -1;
        return 0;
    });
};
var $0491e7111fa05a9f$var$getMonthRowPosition = function(events1, width, calendarDays, timezone, maxEventsVisible) {
    var // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ref;
    var overflowEvents = [];
    var tableSpace = width / 100 * $88a08af890f49243$export$b4e2ba6756dec2c;
    var result = [];
    var usedEvents = [];
    // filter only header events
    var eventsFiltered = [];
    if (!events1) return {
        positions: [],
        overflowingEvents: []
    };
    (ref = Object.entries(events1)) === null || ref === void 0 ? void 0 : ref.map(function(param) {
        var _param = $cw6c3$swchelpers.slicedToArray(param, 2), key = _param[0], items = _param[1];
        // @ts-ignore
        items.forEach(function(item) {
            // filter only relevant events
            var isInRange = $585762b051d85803$export$3a6eb9efca632dee(item, calendarDays, timezone);
            if (isInRange) // correct position when external event ends in next day
            eventsFiltered.push(item);
        });
    });
    // sort by length to fit more items in limited space
    var sortedByLength = $0491e7111fa05a9f$export$d27f846d3c4971c6(eventsFiltered);
    // find all matching events to fit in one row
    sortedByLength === null || sortedByLength === void 0 ? void 0 : sortedByLength.forEach(function(event) {
        var eventPositionResult = [];
        // check if event was used already
        // skip iteration if event was already resolved
        if (usedEvents.includes(event.id)) return true;
        // set event to row
        var rowWithNotOverlappingEvents = [
            event
        ];
        usedEvents.push(event.id);
        // compare to rest of the events
        sortedByLength.forEach(function(eventToCompare) {
            // check if event was used already
            // skip iteration if event was already resolved
            if (usedEvents.includes(eventToCompare.id)) return true;
            // don't compare to self // maybe remove?
            if (event.id === eventToCompare.id) return true;
            // check if events are not overlapping
            var isOverlapping = $585762b051d85803$export$c212dd23f1f0a1e3($c57d36d3233524f5$export$ca41440b93b2a001(event, timezone), $c57d36d3233524f5$export$ca41440b93b2a001(eventToCompare, timezone), timezone);
            // found not overlapping matching event
            if (!isOverlapping) {
                var isMatchingAll = true;
                // compare match with other stored events for same row
                rowWithNotOverlappingEvents.forEach(function(itemFromRow) {
                    var isOverlappingAll = $585762b051d85803$export$c212dd23f1f0a1e3($c57d36d3233524f5$export$ca41440b93b2a001(itemFromRow, timezone), $c57d36d3233524f5$export$ca41440b93b2a001(eventToCompare, timezone), timezone);
                    // prevent merging if only one conflict exists
                    if (isOverlappingAll) isMatchingAll = false;
                });
                if (isMatchingAll) {
                    // store compared event in used array and add to row
                    usedEvents.push(eventToCompare.id);
                    rowWithNotOverlappingEvents.push(eventToCompare);
                }
            }
        });
        // now we have row with only not overlapping events
        // sort events in row by duration to fit more events in row
        // const sortedResult: CalendarEvent[] = rowWithNotOverlappingEvents.sort(
        //   (a, b) =>
        //     DateTime.fromISO(a.endAt).toMillis() -
        //     DateTime.fromISO(a.startAt).toMillis() -
        //     (DateTime.fromISO(b.endAt).toMillis() -
        //       DateTime.fromISO(b.startAt).toMillis())
        // );
        // const sortedResult = sortByLength(rowWithNotOverlappingEvents);
        // place events accordingly in row next to each other
        rowWithNotOverlappingEvents.forEach(function(item) {
            var offset = 0;
            var eventWidth = 0;
            var hasMatchingDay = false;
            calendarDays.forEach(function(day) {
                if ($585762b051d85803$export$f917769c218c90fd(item, day, timezone)) {
                    // set base offset only for first item
                    eventWidth += width;
                    hasMatchingDay = true;
                }
                // increment offset only till we have matching day
                if (!hasMatchingDay) offset += width;
            });
            var isOverflowing = result.length > maxEventsVisible;
            if (!isOverflowing) {
                // create event position data
                var eventPositionData = {
                    event: item,
                    width: Math.round(eventWidth - tableSpace),
                    offsetLeft: offset,
                    offsetTop: 0,
                    height: 20,
                    zIndex: 2
                };
                eventPositionResult.push(eventPositionData);
            } else overflowEvents.push(item);
        });
        // save row to result
        result.push(eventPositionResult);
    });
    var formattedResult = {};
    result.forEach(function(events, index) {
        events.forEach(function(item) {
            formattedResult[item.event.id] = $cw6c3$swchelpers.objectSpread({}, item, {
                offsetTop: index * 25
            });
        });
    });
    return {
        positions: formattedResult,
        overflowingEvents: overflowEvents
    };
};
var $0491e7111fa05a9f$export$ac592545eadc1037 = function(events, width, calendarDays, config, maxEventsVisible, // eslint-disable-next-line @typescript-eslint/no-unused-vars
setContext) {
    var result = [];
    var overflowingEvents = [];
    // TODO prefilter events for each row
    // split calendar days to rows
    var calendarDaysRows = $0491e7111fa05a9f$export$89831913a243f8ab(calendarDays);
    // get layout for each row
    calendarDaysRows.forEach(function(row) {
        var rowResult = $0491e7111fa05a9f$var$getMonthRowPosition(events, width / 7, row, config.timezone, maxEventsVisible);
        result.push(rowResult.positions);
        overflowingEvents = $cw6c3$swchelpers.toConsumableArray(overflowingEvents).concat($cw6c3$swchelpers.toConsumableArray(rowResult.overflowingEvents));
    });
    //
    // setContext(
    //   'monthOverflowEvents',
    //   formatOverflowingEvents(overflowingEvents, config.timezone)
    // );
    return {
        result: result,
        overflowingEvents: $0491e7111fa05a9f$var$formatOverflowingEvents(overflowingEvents, config.timezone)
    };
};



























var $b1f96b393fd4bbd3$var$Dropdown = function(props) {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var translations = store.translations;
    var ref1 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(false), 2), isVisible = ref1[0], setVisible = ref1[1];
    var ref2 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState({
        x: null,
        y: null
    }), 2), layout = ref2[0], setLayout = ref2[1];
    var height = $2c4fe1f6b84a6784$export$30dc190df7e420c4();
    var handleClick = function(e) {
        var _nativeEvent = e.nativeEvent, x = _nativeEvent.x, y = _nativeEvent.y;
        setLayout({
            x: x,
            y: y
        });
        setVisible(true);
    };
    var getStyle = function() {
        if (layout.x) return {
            left: layout.x,
            top: layout.y,
            maxWidth: 300,
            maxHeight: height - 24,
            minWidth: 120,
            height: 'auto',
            overflowX: 'hidden',
            overflowY: 'auto'
        };
    };
    // Correct layout
    $cw6c3$react.useLayoutEffect(function() {
        if (isVisible) {
            var element = document.getElementById('Kalend__Dropdown__container');
            if (element) {
                var newX = layout.x;
                var newY = layout.y;
                if (element.offsetHeight + layout.y > window.innerHeight) newY = layout.y - element.offsetHeight;
                if (element.offsetWidth + layout.x > window.innerWidth) newX = layout.x - element.offsetWidth;
                setLayout({
                    x: newX,
                    y: newY
                });
            }
        }
    }, [
        isVisible,
        document.getElementsByClassName('Kalend__Dropdown__container'), 
    ]);
    var style = getStyle();
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs($cw6c3$reactjsxruntime.Fragment, {
        children: [
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($f7dc25aaa4235907$export$2e2bcd8739ae039, {
                className: 'Kalend__Monthview_Event',
                style: {
                    width: props.width,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 20
                },
                onClick: handleClick,
                isDark: false,
                children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("p", {
                    className: 'Kalend__text',
                    style: {
                        fontSize: 11
                    },
                    children: translations['buttons']['showMore']
                })
            }),
            isVisible ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                className: 'Kalend__Dropdown__backdrop',
                onClick: function() {
                    return setVisible(false);
                },
                children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                    className: 'Kalend__Dropdown__container',
                    id: "Kalend__Dropdown__container",
                    style: style,
                    children: props.children
                })
            }) : null
        ]
    });
};
var $b1f96b393fd4bbd3$export$2e2bcd8739ae039 = $b1f96b393fd4bbd3$var$Dropdown;



var $05ef8620e2e948fa$var$MonthViewButtonMore = function(props) {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 2), store = ref[0], dispatch = ref[1];
    var setContext = function(type, payload) {
        dispatch({
            type: type,
            payload: payload
        });
    };
    var width = store.width, monthOverflowEvents = store.monthOverflowEvents;
    var calendarDays = props.calendarDays;
    var colWidth = width / 7;
    var handleClick = function(day, events) {
        setContext('showMoreEvents', {
            day: day,
            events: events
        });
    };
    var renderShowMoreButtons = function() {
        if (!monthOverflowEvents || !calendarDays || calendarDays.length === 0) return [];
        return calendarDays.map(function(calendarDay) {
            var dateKey = $bf7b38bce41ca3dd$export$6a8d31c8b7f17aa5(calendarDay);
            var events = monthOverflowEvents[dateKey];
            if (events) return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($b1f96b393fd4bbd3$export$2e2bcd8739ae039, {
                onClick: function() {
                    return handleClick(calendarDay, events);
                },
                width: colWidth,
                children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs($cw6c3$reactjsxruntime.Fragment, {
                    children: [
                        /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("h6", {
                            style: {
                                fontSize: 16,
                                padding: 0,
                                margin: 4,
                                marginBottom: 8,
                                textAlign: 'center'
                            },
                            children: calendarDay.toFormat('dd. MMM')
                        }),
                        events === null || events === void 0 ? void 0 : events.map(function(event) {
                            return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($b852c5f3008abacb$export$2e2bcd8739ae039, {
                                item: {
                                    event: event
                                },
                                type: $e4750b0ebeed8e48$export$76a2e4c433c23bb9.SHOW_MORE_MONTH
                            }, "".concat(event.id).concat(event.internalID ? event.internalID : ''));
                        })
                    ]
                })
            }, calendarDay.toString());
            else return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                style: {
                    width: colWidth,
                    visibility: 'hidden'
                }
            }, calendarDay.toString());
        });
    };
    var showMoreButtons = renderShowMoreButtons();
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        style: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
            bottom: 3,
            left: 0
        },
        children: showMoreButtons
    });
};
var $05ef8620e2e948fa$export$2e2bcd8739ae039 = $05ef8620e2e948fa$var$MonthViewButtonMore;


var $c4cfd121d9d256dd$var$MonthWeekRow = function(props) {
    var days = props.days, index = props.index, itemRows = props.itemRows;
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 1), store = ref[0];
    var monthLayout = store.monthLayout;
    var height = $2c4fe1f6b84a6784$export$30dc190df7e420c4();
    var renderEvents = function(data, i) {
        if (!data || !(data === null || data === void 0 ? void 0 : data[i])) return [];
        return itemRows.map(function(item) {
            return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($b852c5f3008abacb$export$2e2bcd8739ae039, {
                item: $cw6c3$swchelpers.objectSpread({}, item),
                meta: item.meta,
                type: $e4750b0ebeed8e48$export$76a2e4c433c23bb9.MONTH,
                index: i
            }, "".concat(item.event.id).concat(item.event.internalID ? item.event.internalID : ''));
        });
    };
    var events = renderEvents(monthLayout, index);
    var style = {
        height: height / 6 - 25
    };
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
        className: 'Kalend__MonthWeekRow__container',
        children: [
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                className: 'Kalend__MonthWeekRow__day',
                children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($0c3afbe9f694dbf0$export$2e2bcd8739ae039, {
                    calendarDays: days,
                    daysNum: 7
                })
            }),
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                className: 'Kalend__MonthWeekRow__container-events',
                style: style,
                children: events
            }),
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($05ef8620e2e948fa$export$2e2bcd8739ae039, {
                calendarDays: days
            })
        ]
    });
};
var $c4cfd121d9d256dd$export$2e2bcd8739ae039 = $c4cfd121d9d256dd$var$MonthWeekRow;


var $4e630ae36e00686b$var$renderOneRow = function(days, eventRows, sequence) {
    var rows = $0491e7111fa05a9f$export$89831913a243f8ab(days);
    return rows.map(function(row, index) {
        return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($c4cfd121d9d256dd$export$2e2bcd8739ae039, {
            days: row,
            index: index,
            itemRows: eventRows ? eventRows[index] : [],
            sequence: sequence
        }, row[0].toString() + sequence);
    });
};
var $4e630ae36e00686b$var$MonthView = function(props) {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(false), 2), wasInit = ref[0], setWasInit = ref[1];
    var ref1 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(null), 2), calendarContent = ref1[0], setCalendarContent = ref1[1];
    var events = props.events;
    var ref2 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 2), store = ref2[0], dispatch = ref2[1];
    var setContext = function(type, payload) {
        dispatch({
            type: type,
            payload: payload
        });
    };
    var width = store.width, calendarDays = store.calendarDays;
    var height = $2c4fe1f6b84a6784$export$30dc190df7e420c4();
    var style = {
        width: width,
        height: '100%'
    };
    var hasExternalLayout = props.eventLayouts !== undefined;
    $cw6c3$react.useEffect(function() {
        if (wasInit && height !== 0) {
            if (!hasExternalLayout) ($parcel$interopDefault($cw6c3$kalendlayout))({
                events: events,
                width: width,
                height: height,
                calendarDays: calendarDays,
                config: store.config,
                selectedView: $3f7b2fe5d2c34f8f$export$b573856c46cc9357.MONTH
            }).then(function(res) {
                setContext('monthLayout', res.positions);
                setContext('monthOverflowEvents', res.overflowingEvents);
                setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);
                var content = $4e630ae36e00686b$var$renderOneRow(calendarDays, res.positions, store.layoutUpdateSequence);
                setCalendarContent(content);
            });
        }
    }, [
        height,
        width
    ]);
    $cw6c3$react.useEffect(function() {
        if (height !== 0) {
            if (!hasExternalLayout) ($parcel$interopDefault($cw6c3$kalendlayout))({
                events: events,
                width: width,
                height: height,
                calendarDays: calendarDays,
                config: store.config,
                selectedView: $3f7b2fe5d2c34f8f$export$b573856c46cc9357.MONTH
            }).then(function(res) {
                setContext('monthLayout', res.positions);
                setContext('monthOverflowEvents', res.overflowingEvents);
                setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);
                var content = $4e630ae36e00686b$var$renderOneRow(calendarDays, res.positions, store.layoutUpdateSequence);
                setCalendarContent(content);
            });
            setWasInit(true);
        }
    }, [
        calendarDays[0],
        JSON.stringify(events)
    ]);
    $cw6c3$react.useEffect(function() {
        if (hasExternalLayout && $bf7b38bce41ca3dd$export$e3e4ea182aca355e(props.eventLayouts.selectedView) === $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH) {
            setContext('monthLayout', props.eventLayouts.positions);
            setContext('monthOverflowEvents', props.eventLayouts.overflowingEvents);
            setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);
            var content = $4e630ae36e00686b$var$renderOneRow(calendarDays, props.eventLayouts.positions, store.layoutUpdateSequence);
            setCalendarContent(content);
        }
    }, [
        JSON.stringify(props.eventLayouts)
    ]);
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs("div", {
        className: 'Kalend__MonthView__container',
        style: style,
        children: [
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($b867b3e906676344$export$2e2bcd8739ae039, {}),
            calendarContent
        ]
    });
};
var $4e630ae36e00686b$export$2e2bcd8739ae039 = $4e630ae36e00686b$var$MonthView;


var $2c06f9532bb9aaf9$var$Calendar = function(props) {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 2), store = ref[0], dispatch = ref[1];
    var setContext = function(type, payload) {
        dispatch({
            type: type,
            payload: payload
        });
    };
    var selectedDate = store.selectedDate, calendarDays = store.calendarDays, selectedView = store.selectedView, callbacks = store.callbacks, config = store.config;
    var width = $2c4fe1f6b84a6784$export$3aee49006f13db09();
    var ref1 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(''), 2), prevView = ref1[0], setPrevView = ref1[1];
    var ref2 = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(null), 2), viewChanged = ref2[0], setViewChanged = ref2[1];
    $cw6c3$react.useEffect(function() {
        if (selectedView) {
            var calendarDaysInitial = $1500da26cef85c66$export$e75d169fad6edf5f(selectedView, selectedDate, config.weekDayStart);
            setContext('calendarDays', calendarDaysInitial);
        }
    }, []);
    // // init context
    // useEffect(() => {
    //   // handle timezone and events
    //   const eventsResult = parseAllDayEvents(props.events, timezone);
    //   setContext('events', eventsResult);
    // }, []);
    $cw6c3$react.useEffect(function() {
        var viewChangedValue = props.selectedView || viewChanged;
        // if (props.selectedView && props.selectedView === selectedView) {
        //   return;
        // }
        if (prevView === viewChangedValue) return;
        // prevent infinit loop
        if (!selectedView && callbacks.onSelectView) {
            callbacks.onSelectView(viewChangedValue);
            return;
        }
        if (!viewChangedValue) return;
        setContext('calendarDays', calendarDays[0]);
        setContext('selectedView', viewChangedValue);
        // use either passed value or internal state
        var setSelectedDate = function(date) {
            setContext('selectedDate', date);
        };
        var calendarDaysNew = $1500da26cef85c66$export$e75d169fad6edf5f(viewChangedValue, $cw6c3$luxon.DateTime.now(), config.weekDayStart, setSelectedDate);
        setContext('calendarDays', calendarDaysNew);
        setContext('width', width - $bf7b38bce41ca3dd$export$76c69f043295405f(viewChanged));
        setPrevView(viewChangedValue);
        setViewChanged(null);
    }, [
        viewChanged,
        props.selectedView
    ]);
    $cw6c3$react.useEffect(function() {
        var selectedViewValue = props.selectedView || selectedView;
        if (prevView === selectedViewValue) return;
        if (selectedViewValue && selectedViewValue !== selectedViewValue) {
            setContext('calendarDays', calendarDays[0]);
            setContext('selectedView', selectedViewValue);
            setPrevView(selectedViewValue);
            var setSelectedDate = function(date) {
                return setContext('selectedDate', date);
            };
            var calendarDaysNew = $1500da26cef85c66$export$e75d169fad6edf5f(selectedViewValue, $cw6c3$luxon.DateTime.now(), config.weekDayStart, setSelectedDate);
            setContext('calendarDays', calendarDaysNew);
            setContext('width', width - $bf7b38bce41ca3dd$export$76c69f043295405f(selectedViewValue));
        }
    }, [
        selectedView
    ]);
    $cw6c3$react.useLayoutEffect(function() {
        setContext('events', props.events);
    }, [
        JSON.stringify(props.events)
    ]);
    $cw6c3$react.useLayoutEffect(function() {
        if (callbacks.onPageChange && calendarDays && calendarDays[0] && calendarDays.length > 0) callbacks.onPageChange($cw6c3$swchelpers.objectSpread({}, $1500da26cef85c66$export$fef151b94550e9f5(calendarDays), {
            direction: store.direction
        }));
    }, [
        selectedView,
        calendarDays === null || calendarDays === void 0 ? void 0 : calendarDays[0],
        calendarDays === null || calendarDays === void 0 ? void 0 : calendarDays[(calendarDays === null || calendarDays === void 0 ? void 0 : calendarDays.length) - 1], 
    ]);
    return selectedView && (calendarDays === null || calendarDays === void 0 ? void 0 : calendarDays.length) > 0 && selectedDate ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs($cw6c3$reactjsxruntime.Fragment, {
        children: [
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($21db0de5ba63f204$export$2e2bcd8739ae039, {
                setViewChanged: setViewChanged,
                kalendRef: props.kalendRef
            }),
            selectedView !== $e4750b0ebeed8e48$export$ec9758e21af63072.AGENDA ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($58f20473f1f0067a$export$2e2bcd8739ae039, {}) : null,
            /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
                className: 'Kalend__Calendar__table',
                children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsxs($f89b7b16d8022e68$export$2e2bcd8739ae039, {
                    children: [
                        selectedView === $e4750b0ebeed8e48$export$ec9758e21af63072.MONTH ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($4e630ae36e00686b$export$2e2bcd8739ae039, {
                            events: props.events ? props.events : [],
                            eventLayouts: props.eventLayouts
                        }) : null,
                        selectedView === $e4750b0ebeed8e48$export$ec9758e21af63072.DAY || selectedView === $e4750b0ebeed8e48$export$ec9758e21af63072.THREE_DAYS || selectedView === $e4750b0ebeed8e48$export$ec9758e21af63072.WEEK ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($be26fc4a0d3aa4a6$export$2e2bcd8739ae039, {
                            events: props.events ? props.events : [],
                            eventLayouts: props.eventLayouts
                        }) : null,
                        selectedView === $e4750b0ebeed8e48$export$ec9758e21af63072.AGENDA ? /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($ae9d5d34ac1cc52f$export$2e2bcd8739ae039, {
                            events: props.events ? props.events : [],
                            eventLayouts: props.eventLayouts
                        }) : null
                    ]
                })
            })
        ]
    }) : null;
};
var $2c06f9532bb9aaf9$export$2e2bcd8739ae039 = $2c06f9532bb9aaf9$var$Calendar;








var $f101c73fee185a96$var$DimensionsLayoutLayer = function(props) {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 2), store = ref[0], dispatch = ref[1];
    var setContext = function(type, payload) {
        dispatch({
            type: type,
            payload: payload
        });
    };
    var selectedView = store.selectedView;
    var width = $2c4fe1f6b84a6784$export$3aee49006f13db09();
    // init context
    $cw6c3$react.useEffect(function() {
        setContext('width', width - $bf7b38bce41ca3dd$export$76c69f043295405f(selectedView));
        if (width < 750) setContext('isMobile', true);
        else setContext('isMobile', false);
    }, []);
    $cw6c3$react.useEffect(function() {
        setContext('width', $2c4fe1f6b84a6784$export$3c49c185de0c2bfc() - $bf7b38bce41ca3dd$export$76c69f043295405f(selectedView));
        if (width < 750) setContext('isMobile', true);
        else setContext('isMobile', false);
    }, [
        width
    ]);
    return props.children;
};
var $f101c73fee185a96$export$2e2bcd8739ae039 = $f101c73fee185a96$var$DimensionsLayoutLayer;





var $4f8fac8212b1a05e$exports = {};
$4f8fac8212b1a05e$exports = JSON.parse("{\"buttons\":{\"today\":\"Heute\",\"agenda\":\"Agenda\",\"day\":\"Tag\",\"threeDays\":\"3 Tags\",\"week\":\"Woche\",\"month\":\"Monat\",\"showMore\":\"Mehr\"},\"months\":{\"january\":\"Januar\",\"february\":\"Februar\",\"march\":\"März\",\"april\":\"April\",\"may\":\"Mai\",\"june\":\"Juni\",\"july\":\"Juli\",\"august\":\"August\",\"september\":\"September\",\"october\":\"Oktober\",\"november\":\"November\",\"december\":\"Dezember\"},\"weekDays\":{\"Mon\":\"Mon\",\"Tue\":\"Die\",\"Wed\":\"Mit\",\"Thu\":\"Don\",\"Fri\":\"Fre\",\"Sat\":\"Sam\",\"Sun\":\"Son\"}}");



var $9ac065e100f212f5$exports = {};
$9ac065e100f212f5$exports = JSON.parse("{\"buttons\":{\"today\":\"Hoy\",\"agenda\":\"Diario\",\"day\":\"Día\",\"threeDays\":\"3 Días\",\"week\":\"Semana\",\"month\":\"Mes\",\"showMore\":\"Más\"},\"months\":{\"january\":\"Enero\",\"february\":\"Febrero\",\"march\":\"Marzo\",\"april\":\"Abril\",\"may\":\"Mayo\",\"june\":\"Junio\",\"july\":\"Julio\",\"august\":\"Agosto\",\"september\":\"Septiembre\",\"october\":\"Octubre\",\"november\":\"Noviembre\",\"december\":\"Diciembre\"},\"weekDays\":{\"Mon\":\"Lun\",\"Tue\":\"Mar\",\"Wed\":\"Mié\",\"Thu\":\"Jue\",\"Fri\":\"Vie\",\"Sat\":\"Sáb\",\"Sun\":\"Dom\"}}");


var $8afa7629b855c8cd$exports = {};
$8afa7629b855c8cd$exports = JSON.parse("{\"buttons\":{\"today\":\"Aujourd\",\"agenda\":\"Jour\",\"day\":\"Journée\",\"threeDays\":\"3 Jours\",\"week\":\"Semaine\",\"month\":\"Mois\",\"showMore\":\"Plus\"},\"months\":{\"january\":\"Janvier\",\"february\":\"Février\",\"march\":\"Mars\",\"april\":\"Avril\",\"may\":\"Mai\",\"june\":\"Juin\",\"july\":\"Juillet\",\"august\":\"Août\",\"september\":\"Septembre\",\"october\":\"Octobre\",\"november\":\"Novembre\",\"december\":\"Décembre\"},\"weekDays\":{\"Mon\":\"Lun\",\"Tue\":\"Mar\",\"Wed\":\"Mer\",\"Thu\":\"Jeu\",\"Fri\":\"Ven\",\"Sat\":\"Sam\",\"Sun\":\"Dim\"}}");


var $8d153bee865ba9a1$exports = {};
$8d153bee865ba9a1$exports = JSON.parse("{\"buttons\":{\"today\":\"Сегодня\",\"agenda\":\"Агенда\",\"day\":\"День\",\"threeDays\":\"3 дня\",\"week\":\"Неделя\",\"month\":\"Месяц\",\"showMore\":\"Еще...\"},\"months\":{\"january\":\"Январь\",\"february\":\"Февраль\",\"march\":\"Март\",\"april\":\"Апрель\",\"may\":\"Май\",\"june\":\"Июнь\",\"july\":\"Июль\",\"august\":\"Август\",\"september\":\"Сентябрь\",\"october\":\"Октябрь\",\"november\":\"Ноябрь\",\"december\":\"Декабрь\"},\"weekDays\":{\"Mon\":\"Пн\",\"Tue\":\"Вт\",\"Wed\":\"Ср\",\"Thu\":\"Чт\",\"Fri\":\"Пт\",\"Sat\":\"Сб\",\"Sun\":\"Вс\"}}");


var $6d7cb4bf3385b3b5$exports = {};
$6d7cb4bf3385b3b5$exports = JSON.parse("{\"buttons\":{\"today\":\"今天\",\"agenda\":\"议程\",\"day\":\"日\",\"threeDays\":\"3天\",\"week\":\"星期\",\"month\":\"月\",\"showMore\":\"显示更多\"},\"months\":{\"january\":\"一月\",\"february\":\"二月\",\"march\":\"三月\",\"april\":\"四月\",\"may\":\"可能\",\"june\":\"六月\",\"july\":\"七月\",\"august\":\"八月\",\"september\":\"九月\",\"october\":\"十月\",\"november\":\"十一月\",\"december\":\"十二月\"},\"weekDays\":{\"Mon\":\"周一\",\"Tue\":\"周二\",\"Wed\":\"周三\",\"Thu\":\"周四\",\"Fri\":\"星期五\",\"Sat\":\"周六\",\"Sun\":\"星期日\"}}");


var $36362bd2dc53dd73$var$getKnownLanguage = function(language) {
    switch(language){
        case 'en':
            return (/*@__PURE__*/$parcel$interopDefault($073ad6afefbd1c74$exports));
        case 'de':
            return (/*@__PURE__*/$parcel$interopDefault($4f8fac8212b1a05e$exports));
        case 'es':
            return (/*@__PURE__*/$parcel$interopDefault($9ac065e100f212f5$exports));
        case 'fr':
            return (/*@__PURE__*/$parcel$interopDefault($8afa7629b855c8cd$exports));
        case 'ru':
            return (/*@__PURE__*/$parcel$interopDefault($8d153bee865ba9a1$exports));
        case 'zh':
            return (/*@__PURE__*/$parcel$interopDefault($6d7cb4bf3385b3b5$exports));
        default:
            return 'en';
    }
};
var $36362bd2dc53dd73$var$LanguageLayer = function(props) {
    var language = props.language, customLanguage = props.customLanguage;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useContext($65553fbba1d6d65b$export$841858b892ce1f4c), 2), store = ref[0], dispatch = ref[1];
    var setContext = function(type, payload) {
        dispatch({
            type: type,
            payload: payload
        });
    };
    var translations = store.translations;
    $cw6c3$react.useEffect(function() {
        if (customLanguage) setContext('translations', customLanguage);
        else if (language) setContext('translations', $36362bd2dc53dd73$var$getKnownLanguage(language));
    }, []);
    $cw6c3$react.useEffect(function() {
        if (customLanguage) setContext('translations', customLanguage);
        else if (language) setContext('translations', $36362bd2dc53dd73$var$getKnownLanguage(language));
    }, [
        customLanguage,
        language
    ]);
    return translations ? props.children : null;
};
var $36362bd2dc53dd73$export$2e2bcd8739ae039 = $36362bd2dc53dd73$var$LanguageLayer;




var $7d02895a6af4de33$var$RootLayoutLayer = function(props) {
    var ref = $cw6c3$swchelpers.slicedToArray($cw6c3$react.useState(false), 2), isMounted = ref[0], setIsMounted = ref[1];
    $cw6c3$react.useEffect(function() {
        var rootEl = document.querySelector('.Kalend__Calendar__root');
        if (rootEl) setIsMounted(true);
    }, [
        document.querySelector('.Kalend__Calendar__root')
    ]);
    return isMounted ? props.children : null;
};
var $7d02895a6af4de33$export$2e2bcd8739ae039 = $7d02895a6af4de33$var$RootLayoutLayer;



var $3f7b2fe5d2c34f8f$export$b573856c46cc9357 = $e4750b0ebeed8e48$export$ec9758e21af63072;
var $3f7b2fe5d2c34f8f$export$b6e764c50c031f2a = $63103f0ef67d319d$export$3d0db7ed812b6b3f;
var $3f7b2fe5d2c34f8f$var$Kalend = function(props) {
    // basic validation
    $cw6c3$react.useEffect(function() {
        $078907888c55a58c$export$45855e0dd982478b(props);
        $078907888c55a58c$export$fbb8247b2e46a70a();
    }, []);
    return /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx("div", {
        className: 'Kalend__Calendar__root Kalend__main',
        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($65553fbba1d6d65b$export$2e2bcd8739ae039, {
            children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($36362bd2dc53dd73$export$2e2bcd8739ae039, {
                language: props.language || 'en',
                customLanguage: props.customLanguage,
                children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($7d02895a6af4de33$export$2e2bcd8739ae039, {
                    children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($3886b97a1526edd3$export$2e2bcd8739ae039, $cw6c3$swchelpers.objectSpread({}, props, {
                        children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($f101c73fee185a96$export$2e2bcd8739ae039, {
                            children: /*#__PURE__*/ $cw6c3$reactjsxruntime.jsx($2c06f9532bb9aaf9$export$2e2bcd8739ae039, {
                                kalendRef: props.kalendRef,
                                events: props.events,
                                eventLayouts: props.eventLayouts,
                                selectedView: props.selectedView
                            })
                        })
                    }))
                })
            })
        })
    });
};
var $3f7b2fe5d2c34f8f$export$2e2bcd8739ae039 = $3f7b2fe5d2c34f8f$var$Kalend;


//# sourceMappingURL=main.js.map
