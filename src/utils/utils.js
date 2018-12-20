/**
 * Created by jiang on 2017/9/2.
 */
import moment from 'moment';

export const randomStr = () => new Date().getTime() + '' + parseInt(Math.random() * 100);

export const isEmail = s => /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(s);

export const isPhone = s => /^1\d{10}$/.test(s);

export const isIDCard = s => /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/.test(s);

export const deepCopy = o => JSON.parse(JSON.stringify(o));

export const getAreaName = (code, obj) => {
    let name = '';

    const keys = Object.keys(obj);

    for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < obj[keys[i]].length; j++) {
            if (obj[keys[i]][j].areaCode === code) {
                name = obj[keys[i]][j].areaName;
                break;
            }
        }
    }

    return name;
};

export const checkAuth = (id, list) => {
    let auth = false;

    for (let i = 0; i < list.length; i++) {
        if (list[i].substring(0, 1) === id) {
            auth = true;
            break;
        }
    }

    return auth;
};

export const durationDateFormat = (begin, end) => {
    const _begin = moment(begin);
    const _end = moment(end);
    const duration = moment.duration(_end.diff(_begin));
    return `${parseInt(duration.asHours())}时${moment([2000, 1, 1]).add(duration).format('mm分钟ss秒')}`;
};
