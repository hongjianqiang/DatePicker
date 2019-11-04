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
    }

    Content() {
        const HTML = `
            <table cellspacing="0">
                <tbody>
                    <tr>
                        <th>日</th>
                        <th>一</th>
                        <th>二</th>
                        <th>三</th>
                        <th>四</th>
                        <th>五</th>
                        <th>六</th>
                    </tr>
                    <tr>
                        <td>27</td>
                        <td>28</td>
                        <td>29</td>
                        <td>30</td>
                        <td>31</td>
                        <td>1</td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                        <td>6</td>
                        <td>7</td>
                        <td>8</td>
                        <td>9</td>
                    </tr>
                    <tr>
                        <td>10</td>
                        <td>11</td>
                        <td>12</td>
                        <td>13</td>
                        <td>14</td>
                        <td>15</td>
                        <td>16</td>
                    </tr>
                    <tr>
                        <td>17</td>
                        <td>18</td>
                        <td>19</td>
                        <td>20</td>
                        <td>21</td>
                        <td>22</td>
                        <td>23</td>
                    </tr>
                    <tr>
                        <td>24</td>
                        <td>25</td>
                        <td>26</td>
                        <td>27</td>
                        <td>28</td>
                        <td>29</td>
                        <td>30</td>
                    </tr>
                </tbody>
            </table>
        `.trim();

        this.content = createElement('div');
        this.content.innerHTML = HTML;
        this.content.classList.add('content');
    }

    Bottom() {
        const HTML = `
            <span class="label">时间</span>
            <span class="time">
                <input value="12" type="number" maxlength="2" min="0" max="23" class="tm"
                ><input value=":" readonly class="seq"
                ><input value="34" type="number" maxlength="2" min="0" max="59" class="tm"
                ><input value=":" readonly class="seq"
                ><input value="56" type="number" maxlength="2" min="0" max="59" class="tm">
            </span>
            <span class="set-time">
                <div class="add"><div class="i-arrow"></div></div>
                <div class="sub"><div class="i-arrow"></div></div>
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
    }
}

window.addEventListener('load', ()=>{
    new DatePicker();
});
