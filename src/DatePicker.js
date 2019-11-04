import './DatePicker.less';

const doc = document;
const createElement = doc.createElement.bind(doc);

class DatePicker {
    constructor() {
        this.viewModel();

        this.Header();
        this.Content();
        this.Bottom();

        this.datePicker = createElement('div');
        this.datePicker.classList.add('date-picker');

        this.datePicker.append(this.header, this.content, this.bottom);
        doc.body.append(this.datePicker);
    }

    onTdClick(e) {
        console.log(e);
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
            td.onclick = this.onTdClick;

            if ( month !== _month ) td.classList.add('other-month');
            if ( now.getFullYear() === _year && now.getMonth() === _month && now.getDate() === _date) {
                td.classList.add('today');
            }
            if( month === _month && selectDate.includes(_date) ) {
                td.classList.add('active');
            }

            if (0 === _day) tr = createElement('tr')
            tr.append(td);
            if (6 === _day) tbody.append(tr);
        }
    }

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
