// Set up vars
const myBirthDay = '1988-11-01';
const myLifeExpectancy = 80;
const totalWeeksInLife = myLifeExpectancy * 52.1429; // As per the modern Gregorian calendar, one year is equal to 365 days whic is 52.1429 weeks in total

/*
  Calculate your life expectency

  Specific enough: https://www.blueprintincome.com/tools/life-expectancy-calculator-how-long-will-i-live/
  More specific (needs an account): https://livingto100.com/calculator/age
*/

// Weeks left in life
function returnWeeks(birthday) {
  bday = new Date(birthday);
  var ageDifMs = Date.now() - bday.getTime();
  yearOfBirth = bday.getFullYear();
  birthdayDate = bday;

  return Math.ceil(totalWeeksInLife - ageDifMs / (1000 * 60 * 60 * 24 * 7));
}

// Get how many weeks are left
weeksLeft = returnWeeks(myBirthDay);
progress = weeksLeft + ' weeks left of all total ' + Math.ceil(totalWeeksInLife) + ' weeks available.';

// Fill calendar with year cells
function populate_calendar(birthday, numYears) {
    const root = document.getElementById('calendar');

    // Remove every existing child first, just in case
    while(root.children.length > 0) {
        root.children[0].remove();
    }

    let baseYear = birthday.getFullYear();
    // Spawn years
    for (let i = 0; i < numYears; i++) {
        root.appendChild(spawn_year(baseYear + i, birthday));
    }
}

// Stats
var weeksleft_label = document.createElement('p');
weeksleft_label.classList.add('weeksleft-label');
weeksleft_label.innerHTML = progress;
document.getElementById('stats').appendChild(weeksleft_label);

function spawn_year(_year, birthday) {
    let year_div = document.createElement('div');
    year_div.classList.add('year-wrapper');

    let title = document.createElement('h2');
    title.classList.add('year-label');
    title.innerHTML = _year;
    year_div.appendChild(title);

    let year_cell = document.createElement('div');
    year_cell.classList.add('year-cell');
    year_div.appendChild(year_cell);

    for(let i = 0; i < 12; i++) {
        let month_div = document.createElement('div');
        month_div.classList.add('month-cell');
        let num_days_per_square = days_in_month(i+1, _year) / 4
        for(let j = 0; j < 4; j++) {
            week_div = document.createElement('div');
            week_div.id = `${_year}-${i+1}-${j+1}`;
            week_div.classList.add('week-cell');
            week_date_epoch = new Date(`${_year}-${i+1}-${j+1}`).getTime();
            today_epoch = new Date().getTime();

            if(week_date_epoch < today_epoch) {
              week_div.classList.add('filled');
            }

            let _ = new Date(_year, i, Math.floor((j+1)*num_days_per_square));

            if(new Date(_year, i, Math.floor((j+1)*num_days_per_square)) < birthday) {
                week_div.classList.add('invisible');
            }

            month_div.appendChild(week_div);
        }
        year_cell.appendChild(month_div);
    }

    return year_div;
}

// from https://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript
// Month in JavaScript is 0-indexed (January is 0, February is 1, etc),
// but by using 0 as the day it will give us the last day of the prior
// month. So passing in 1 as the month number will return the last day
// of January, not February
function days_in_month (month, year) {
    return new Date(year, month, 0).getDate();
}

function get_week_id_from_date(date) {
    let n_days = days_in_month(date.getMonth() + 1, date.getFullYear())
    let week_number = Math.floor((date.getDate()-1) / (n_days / 4));
    return `${date.getFullYear()}-${date.getMonth()+1}-${week_number + 1}`;
}

function write_life_event(life_event) {
    let id = get_week_id_from_date(life_event['date']);
    week_div = document.getElementById(id);

    if(week_div == null || week_div.classList.contains('invisible')) {
        let y = life_event['date'].getFullYear();
        let m = life_event['date'].getMonth() + 1;
        let d = life_event['date'].getDate();
        console.error(`Event '${life_event['description']}' has an invalid date (${y}-${m}-${d})`);
        return;
    }

    week_div.style.color = life_event['color'];
    week_div.style.borderColor = life_event['color'];
    week_div.style.backgroundColor = life_event['color'];

    if(week_div.style.backgroundColor) {
      week_div.classList.add('has-tooltip');

      week_div.dataset.tooltip = life_event['description'];
    }

    if('icon' in life_event) {
        week_div.classList.add('has-tooltip');

        week_div.dataset.tooltip = life_event['description'];
        week_div.insertAdjacentHTML('beforeend', life_event['icon']);
    }
}

events = [
  {
    'date': new Date('2009-03-30'),
    'description': 'Lotan syntymä',
    'color': '#3ef806',
  },
  {
    'date': new Date('2010-03-30'),
    'description': 'Muutto Kangaslammelle',
    'color': '#f8f806',
  },
  {
    'date': new Date('2013-05-02'),
    'description': 'Muutto Rasinrinteelle',
    'color': '#f8f806',
  },
  {
    'date': new Date('2013-05-02'),
    'description': 'Muutto Rasinrinteelle',
    'color': '#f8f806',
  },
  {
    'date': new Date('2013-08-26'),
    'description': 'Manun syntymä',
    'color': '#3ef806',
  },
  {
    'date': new Date('2013-05-22'),
    'description': 'Digitoimisto Dude Oy',
    'color': '#7effe1',
  },
  {
    'date': new Date('2015-08-01'),
    'description': 'Muutto Vapaudenkadulle',
    'color': '#f8f806',
  },
  {
    'date': new Date('2008-03-28'),
    'description': 'Kihloihin Veeran kanssa',
    'color': '#f806cc',
  },
  {
    'date': new Date('2008-07-02'),
    'description': 'Naimisiin Veeran kanssa',
    'color': '#f806cc',
  },
  {
    'date': new Date('2019-01-15'),
    'description': 'Isän kuolema',
    'color': '#362222',
  },
  {
    'date': new Date('2022-08-01'),
    'description': 'Muutto Vaihdekujalle',
    'color': '#f8f806',
  },
]

let calendar = document.getElementById('calendar');
populate_calendar(new Date(myBirthDay), myLifeExpectancy);

events.forEach(e => {
    write_life_event(e);
});
