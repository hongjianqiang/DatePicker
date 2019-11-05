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
                    '<td class="today"><% this.dates[i].date %></td>',
                    '<% } else if ( this.year==this.dates[i].year && this.dates[i].month==this.month) { %>',
                    '<td><% this.dates[i].date %></td>',
                    '<% } else { %>',
                    '<td class="other-month"><% this.dates[i].date %></td>',
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

    events = {};

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

        // this.viewModel();

        // this.Header();
        // this.Content();
        // this.Bottom();

        // this.datePicker = createElement('div');
        // this.datePicker.classList.add('date-picker');

        // this.datePicker.append(this.header, this.content, this.bottom);
        // doc.body.append(this.datePicker);
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
     * 订阅事件
     * @param {String} eventName 
     * @param {Function} callback 
     */
    subscribe(eventName, callback) {
        if( !this.events.hasOwnProperty(eventName) ) this.events[eventName] = [];
        this.events[eventName].push(callback);
    }

    /**
     * 取消订阅
     * @param {String} eventName 
     * @param {Function} callback 
     */
    unsubscribe(eventName, callback) {
        let index = 0, length = 0;

        if( this.events.hasOwnProperty(eventName) ) {
            length = this.events[eventName].length;
            for(; index<length; index++) {
                if(this.events[eventName][index] === callback) {
                    this.events[eventName].splice(index, 1);
                    break;
                }
            }
        }
    }

    /**
     * 发布事件
     * @param {String} eventName 
     * @param {...any} data 
     */
    public(eventName, ...data) {
        if(this.events.hasOwnProperty(eventName)) {
            this.events[eventName].map(event => event.apply(this, data));
        }
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

    onTdClick(e) {
        const target = e.target;

        if (target.classList.contains('other-month')) {
            this.current.month( target.dataset.month );
            this.current.date( target.dataset.date );

        } else {
            this.current.date(target.textContent);
        }
    }

    viewModel() {
        const curr = new Date();
        const render = () => {
            this.renderHeader();
            this.renderCalendar();
        };

        this.current = {
            year: (year) => {
                if(undefined !== year) {
                    curr.setFullYear(year);
                    render();
                    return year;
                } else {
                    return curr.getFullYear();
                }
            },
            month: (month) => {
                if(undefined !== month) {
                    curr.setMonth(month);
                    render();
                    return month;
                } else {
                    return curr.getMonth();
                }
            },
            date: (date) => {
                if(undefined !== date) {
                    curr.setDate(date);
                    render();
                    return date;
                } else {
                    return curr.getDate();
                }
            },
            hh: (hh) => {
                if(undefined !== hh) {
                    curr.setHours(hh);
                    render();
                    return hh;
                } else {
                    return curr.getHours();
                }
            },
            mm: (mm) => {
                if(undefined !== mm) {
                    curr.setMinutes(mm);
                    render();
                    return mm;
                } else {
                    return curr.getMinutes();
                }
            },
            ss: (ss) => {
                if(undefined !== ss) {
                    curr.setSeconds(ss);
                    render();
                    return ss;
                } else {
                    return curr.getSeconds();
                }
            }
        };
    }

    renderHeader() {
        const HTML = `
            <div class="last-year">
                <span class="i-arrow"></span>
                <span class="i-arrow"></span>
            </div>
            <div class="last-month">
                <span class="i-arrow"></span>
            </div>
            <div class="year-month">
                <span>2019年</span> <span>11月</span>
            </div>
            <div class="next-year">
                <span class="i-arrow"></span>
                <span class="i-arrow"></span>
            </div>
            <div class="next-month">
                <span class="i-arrow"></span>
            </div>
        `.trim();

        this.header.innerHTML = HTML;

        const [lastYear, lastMonth, yearMonth, nextYear, nextMonth] = this.header.querySelectorAll('div');
        const [year, month] = yearMonth.querySelectorAll('.year-month span');

        year.textContent  = `${this.current.year()}年`;
        month.textContent = `${this.current.month()+1}月`;

        lastYear.onclick = () => {
            this.current.year( this.current.year() - 1 );
        };

        lastMonth.onclick = () => {
            this.current.month( this.current.month() - 1 );
        };

        nextMonth.onclick = () => {
            this.current.month( this.current.month() + 1 );
        };

        nextYear.onclick = () => {
            this.current.year( this.current.year() + 1 );
        };
    }

    renderCalendar({
        year = this.current.year(), 
        month = this.current.month(), 
        selectDate = []
    } = {}) {
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        const HTML = `
            <table cellspacing="0">
                <tbody>
                    <tr>
                        ${days.map(day => '<th>'+day+'</th>').join('\n')}
                    </tr>
                </tbody>
            </table>
        `.trim();

        this.content.innerHTML = HTML;

        const now = new Date();
        const tbody = this.content.querySelector('tbody');
        const dates = this.getDates(year, month);

        let tr = createElement('tr');
        
        for (const {year:_year, month:_month, date:_date, day:_day} of dates) {
            const td = createElement('td');

            td.textContent = _date; 
            td.dataset.year = _year;
            td.dataset.month = _month;
            td.dataset.date = _date;
            td.dataset.day = _day;
            td.onclick = this.onTdClick.bind(this);

            if ( month !== _month ) td.classList.add('other-month');
            if ( now.getFullYear() === _year && now.getMonth() === _month && now.getDate() === _date) {
                td.classList.add('today');
            }
            if ( month === _month && selectDate.includes(_date) ) {
                td.classList.add('active');
            } else if ( month === _month && _date === this.current.date() ) {
                td.classList.add('active');
            }

            if (0 === _day) tr = createElement('tr')
            tr.append(td);
            if (6 === _day) tbody.append(tr);
        }
    }

    Header() {
        this.header = createElement('div');
        this.header.classList.add('header');

        this.renderHeader();
    }

    Content() {
        this.content = createElement('div');
        this.content.classList.add('content');

        this.renderCalendar({
            selectDate: [(new Date()).getDate()]
        });
    }

    Bottom() {
        const HTML = `
            <span class="label">时间</span>
            <span class="time">
                <input value="" type="number" maxlength="2" min="0" max="23" class="tm"
                ><input value=":" readonly class="seq"
                ><input value="" type="number" maxlength="2" min="0" max="59" class="tm"
                ><input value=":" readonly class="seq"
                ><input value="" type="number" maxlength="2" min="0" max="59" class="tm">
            </span>
            <span class="set-time">
                <div class="btn add"><div class="i-arrow"></div></div>
                <div class="btn sub"><div class="i-arrow"></div></div>
            </span>
            <span class="control">
                <div class="btn">清空</div>
                <div class="btn">今天</div>
                <div class="btn">确定</div>
            </span>
        `.trim();

        this.bottom = createElement('div');
        this.bottom.innerHTML = HTML;
        this.bottom.classList.add('bottom');

        const [hh, mm, ss] = this.bottom.querySelectorAll('.time [type="number"]');
        const [add, sub] = this.bottom.querySelectorAll('.set-time .btn');
        const [clear, today, confirm] = this.bottom.querySelectorAll('.control .btn');

        let focus = hh;

        hh.onfocus = () => { focus = hh };
        mm.onfocus = () => { focus = mm };
        ss.onfocus = () => { focus = ss };

        add.onclick = () => {
            const value = (+focus.value < focus.max)?(+focus.value+1):(focus.value);
            focus.value = (''+value).padStart(2, '0');
        };

        sub.onclick = () => {
            const value = (+focus.value > focus.min)?(+focus.value-1):(focus.value);
            focus.value = (''+value).padStart(2, '0');
        };

        clear.onclick = () => {
            console.log('清空');
        };

        today.onclick = () => {
            const now = new Date();

            this.current.year( now.getFullYear() );
            this.current.month( now.getMonth() );
            this.current.date( now.getDate() );
            
            hh.value = (''+now.getHours()).padStart(2, '0');
            mm.value = (''+now.getMinutes()).padStart(2, '0');
            ss.value = (''+now.getSeconds()).padStart(2, '0');
        };

        confirm.onclick = () => {
            console.log('确定');
        };

        today.onclick();
    }
}

window.addEventListener('load', ()=>{
    new DatePicker();
});
