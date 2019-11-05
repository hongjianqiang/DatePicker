import './DatePicker.less';

const win = window;
const doc = document;
const createElement = doc.createElement.bind(doc);
const defer = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.setTimeout;

class DatePicker {
    headerTpl = [
    '<div class="header">',
        '<div class="last-year" @click="this.onLastYear()">',
            '<span class="i-arrow"></span>',
            '<span class="i-arrow"></span>',
        '</div>',
        '<div class="last-month" @click="this.onLastMonth()">',
            '<span class="i-arrow"></span>',
        '</div>',
        '<div class="year-month">',
            '<span><% this.year %>年 </span>',
            '<span><% this.month+1 %>月</span>',
        '</div>',
        '<div class="next-year" @click="this.onNextYear()">',
            '<span class="i-arrow"></span>',
            '<span class="i-arrow"></span>',
        '</div>',
        '<div class="next-month" @click="this.onNextMonth()">',
            '<span class="i-arrow"></span>',
        '</div>',
    '</div>',
    ].join('');

    contentTpl = [
    '<div class="content">',
        '<table cellspacing="0" class="calendar">',
            '<tbody>',
                '<tr>',
                    '<% for (let day of this.days) { %>',
                    '<th><% day %></th>',
                    '<% } %>',
                '</tr>',
                '<% for (let i = 0; i < this.dates.length;) { %>',
                '<tr>',
                    '<% for (let j = 0; j < 7; j++, i++) { %>',
                    '<% if ( new Date().getFullYear()==this.dates[i].year && this.dates[i].month==new Date().getMonth() && this.dates[i].date==new Date().getDate() ) { %>',
                    '<td class="today" @click="this.onTD(e, <% this.dates[i].year %>, <% this.dates[i].month %>, <% this.dates[i].date %>)"><% this.dates[i].date %></td>',
                    '<% } else if ( this.year==this.dates[i].year && this.dates[i].month==this.month) { %>',
                    '<td @click="this.onTD(e, <% this.dates[i].year %>, <% this.dates[i].month %>, <% this.dates[i].date %>)"><% this.dates[i].date %></td>',
                    '<% } else { %>',
                    '<td class="other-month" @click="this.onTD(e, <% this.dates[i].year %>, <% this.dates[i].month %>, <% this.dates[i].date %>)"><% this.dates[i].date %></td>',
                    '<% } %>',
                    '<% } %>',
                '</tr>',
                '<% } %>',
            '</tbody>',
        '</table>',
    '</div>',
    ].join('');

    bottomTpl = [
    '<div class="bottom">',
        '<span class="label">时间</span>',
        '<span class="time">',
            '<input value="<% this.hh %>" type="number" maxlength="2" min="0" max="23" class="tm" @click="this.onFocusT(\'hh\')">',
            '<input value=":" readonly="" class="seq">',
            '<input value="<% this.mm %>" type="number" maxlength="2" min="0" max="59" class="tm" @click="this.onFocusT(\'mm\')">',
            '<input value=":" readonly="" class="seq">',
            '<input value="<% this.ss %>" type="number" maxlength="2" min="0" max="59" class="tm" @click="this.onFocusT(\'ss\')">',
        '</span>',
        '<span class="set-time">',
            '<div class="btn add" @click="this.onUp()"><div class="i-arrow"></div></div>',
            '<div class="btn sub" @click="this.onDown()"><div class="i-arrow"></div></div>',
        '</span>',
        '<div class="control">',
            '<div class="btn" @click="this.onClear()">清空</div>',
            '<div class="btn" @click="this.onToday()">今天</div>',
            '<div class="btn" @click="this.onConfirm()">确定</div>',
        '</div>',
    '</div>',
    ].join('');

    templates = [this.headerTpl, this.contentTpl, this.bottomTpl].join('');

    data = (() => {
        const fmtDate = (obj) => {
            let curr = new Date();

            if ( obj instanceof Date ) {
                curr = obj;
            } else if ( obj instanceof Object ) {
                const { year, month, date, hh, mm, ss } = obj;

                if(undefined !== year) curr.setFullYear(year);
                if(undefined !== month) curr.setMonth(month);
                if(undefined !== date) curr.setDate(date);
                if(undefined !== hh) curr.setHours(hh);
                if(undefined !== mm) curr.setMinutes(mm);
                if(undefined !== ss) curr.setSeconds(ss);
            }

            return {
                year: curr.getFullYear(),
                month: curr.getMonth(),
                date: curr.getDate(),
                hh: (''+curr.getHours()).padStart(2, '0'),
                mm: (''+curr.getMinutes()).padStart(2, '0'),
                ss: (''+curr.getSeconds()).padStart(2, '0'),
                dates: this.getDates(curr.getFullYear(), curr.getMonth())
            };
        };

        return {
            ...fmtDate(new Date()),

            days: ['日', '一', '二', '三', '四', '五', '六'],
            foucsT: 'hh',

            onTD: (e, year, month, date) => {
                const td = Array.from(this.datePicker.querySelectorAll('td'));

                td.map(el => el.classList.remove('active'));

                if ( this.data.year==year && month==this.data.month ) {
                    e.target.classList.toggle('active');
                } else {
                    this.setData({ 
                        year, month, date, 
                        dates: this.getDates(year, month),
                    });
                }
            },
            onLastYear: () => {
                const year = +this.data.year;

                this.setData({
                    ...fmtDate({
                        ...this.data,
                        year: year - 1
                    })
                });
            },
            onLastMonth: () => {
                const month = +this.data.month;

                this.setData({
                    ...fmtDate({
                        ...this.data,
                        month: month - 1
                    })
                });
            },
            onNextMonth: () => {
                const month = +this.data.month;

                this.setData({
                    ...fmtDate({
                        ...this.data,
                        month: month + 1
                    })
                });
            },
            onNextYear: () => {
                const year = +this.data.year;

                this.setData({
                    ...fmtDate({
                        ...this.data,
                        year: year + 1
                    })
                });
            },
            onFocusT: (foucsT) => {
                this.setData({ foucsT });
            },
            onUp: () => {
                const foucsT = this.data.foucsT;
                const oldVal = +this.data[foucsT];
                const newVal = oldVal + 1;

                if ( 'hh'===foucsT && newVal < 24 ) {
                } else if ( ('mm'===foucsT||foucsT==='ss') && newVal < 60 ) {
                } else {
                    return false;
                }

                this.setData({
                    [foucsT]: (''+newVal).padStart(2, '0')
                });

                return false;
            },
            onDown: () => {
                const foucsT = this.data.foucsT;
                const oldVal = +this.data[foucsT];
                const newVal = oldVal - 1;

                if ( newVal > -1 ) {
                    this.setData({
                        [foucsT]: (''+newVal).padStart(2, '0')
                    });
                }

                return false;
            },
            onClear: () => {
                console.log('清空');
            },
            onToday: () => {
                this.setData({
                    ...fmtDate(new Date())
                });

                return false;
            },
            onConfirm: () => {
                console.log('确认');
            }
        };
    })(); 

    constructor() {
        this.datePicker = createElement('div');

        this.datePicker.classList.add('date-picker');
        this.datePicker.innerHTML = this.compiler(this.templates, this.data);

        this.datePicker.onclick = (e) => {
            for (let target = e.target; target !== this.datePicker; target = target.parentElement) {
                // 事件冒泡
                const exec = target.getAttribute('@click');
                const fn = new Function('e', ';return '+exec+';');
                
                if ( false === fn.apply(this.data, [e]) ) break;  // 如果函数执行结果返回为 false 则事件不再往上冒泡
            }
        };

        doc.body.append(this.datePicker);
    }

    /**
     * 
     * @param {Object} data 
     */
    setData(data) {
        const options = {
            ...this.data,
            ...data
        };

        this.data = options;

        defer(() => {
            this.datePicker.innerHTML = this.compiler(this.templates, this.data);
        });
    }

    /**
     * HTML模板编译器
     * @param {String} html 
     * @param {Object} options 
     */
    compiler(html, options) {
        const re = /<%([^%>]+)?%>/g;
        const reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
        
        let code = 'var r=[];\n';
        let cursor = 0;
    
        function add (line, js) {
            js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        }
    
        let match;
        while (match = re.exec(html)) {
            add(html.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
        }
        add(html.substr(cursor, html.length - cursor));
        code += 'return r.join("");';

        return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
    }

    /**
     * 获取当月的所有日期
     * @param {Number} year 
     * @param {Number} month 
     */
    getDates(year, month) {
        const dates = [];
        const thisMonth = new Date(year, month);
        const first = thisMonth.getDay();
    
        thisMonth.setDate(1-first);

        while ( +thisMonth < +new Date(year, month+1) ) {
            dates.push({
                year: thisMonth.getFullYear(),  // 年
                month: thisMonth.getMonth(),    // 月
                date: thisMonth.getDate(),      // 日
                day: thisMonth.getDay(),        // 星期
            });
    
            thisMonth.setDate( thisMonth.getDate() + 1 );
        }
    
        const len = dates.length;
    
        for (let i = 6 - dates[len-1].day; i>0; i-- ) {
            dates.push({
                year: thisMonth.getFullYear(),  // 年
                month: thisMonth.getMonth(),    // 月
                date: thisMonth.getDate(),      // 日
                day: thisMonth.getDay(),        // 星期
            });
    
            thisMonth.setDate( thisMonth.getDate() + 1 );
        }
    
        return dates;
    }
}

window.addEventListener('load', ()=>{
    new DatePicker();
});
