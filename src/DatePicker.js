import './DatePicker.less';

const doc = document;
const createElement = doc.createElement.bind(doc);

class DatePicker {
    constructor() {
        this.Header();
        this.Content();
        this.Bottom();

        this.datePicker = createElement('div');
        this.datePicker.classList.add('date-picker');

        this.datePicker.append(this.header, this.content, this.bottom);
        doc.body.append(this.datePicker);
    }

    getDates(year, month) {
        const dates = [];
        const thisMonth = new Date(year, month);
        const first = thisMonth.getDay();
    
        thisMonth.setDate(1-first);
    
        while ( thisMonth.getMonth() < month +  1 ) {
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
        const HTML = `
            <div class="last-year">
                <span class="i-arrow"></span>
                <span class="i-arrow"></span>
            </div>
            <div class="yesterday">
                <span class="i-arrow"></span>
            </div>
            <div class="year-month">
                <span>2019年</span> <span>11月</span>
            </div>
            <div class="next-year">
                <span class="i-arrow"></span>
                <span class="i-arrow"></span>
            </div>
            <div class="tomorrow">
                <span class="i-arrow"></span>
            </div>
        `.trim();

        this.header = createElement('div');
        this.header.innerHTML = HTML;
        this.header.classList.add('header');

        const now = new Date();
        const [lastYear, yesterday, yearMonth, nextYear, tomorrow] = this.header.querySelectorAll('div');
        const [year, month] = yearMonth.querySelectorAll('.year-month span');

        year.textContent  = `${now.getFullYear()}年`;
        month.textContent = `${now.getMonth()+1}月`;

        lastYear.onclick = () => {
            console.log('lastYear');
        };

        yesterday.onclick = () => {
            console.log('yesterday');
        };

        tomorrow.onclick = () => {
            console.log('tomorrow');
        };

        nextYear.onclick = () => {
            console.log('nextYear');
        };
    }

    Content() {
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

        this.content = createElement('div');
        this.content.innerHTML = HTML;
        this.content.classList.add('content');

        const now = new Date();
        const tbody = this.content.querySelector('tbody');
        const dates = this.getDates(now.getFullYear(), now.getMonth());

        let tr = createElement('tr');

        for (const {year, month, date, day} of dates) {
            const td = createElement('td');

            td.textContent = date;
            if ( now.getMonth() !== month ) td.classList.add('other-month');
            if ( now.getFullYear() === year && now.getMonth() === month && now.getDate() === date) {
                td.classList.add('active');
                td.classList.add('today');
            }

            if (0 === day) tr = createElement('tr')
            tr.append(td);
            if (6 === day) tbody.append(tr);
        }
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
