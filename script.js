particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 355,
            "density": {
                "enable": true,
                "value_area": 789.1476416322727
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            },
            "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 0.48927153781200905,
            "random": false,
            "anim": {
                "enable": true,
                "speed": 0.2,
                "opacity_min": 0,
                "sync": false
            }
        },
        "size": {
            "value": 2,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 2,
                "size_min": 0,
                "sync": false
            }
        },
        "line_linked": {
            "enable": false,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 0.2,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "bubble"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 400,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 83.91608391608392,
                "size": 1,
                "duration": 3,
                "opacity": 1,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});

//Calendar

! function() {

    var today = moment();

    function Calendar(selector, events, year) {
        this.el = document.querySelector(selector);
        var x = year
        this.events = events;
        if (x != null) {
            x = year + '-01-01'
            this.current = moment(x).date(1);
        } else {
            this.current = moment().date(1);
        }
        this.draw();
        var current = document.querySelector('.today');
        if (current) {
            var self = this;
            window.setTimeout(function() {
                self.openDay(current);
            }, 500);
        }
    }

    Calendar.prototype.draw = function() {
        //Create Header
        this.drawHeader();

        //Draw Month
        this.drawMonth();

        this.drawLegend();
    }

    Calendar.prototype.drawHeader = function() {
        var self = this;
        if (!this.header) {
            //Create the header elements
            this.header = createElement('div', 'header');
            this.header.className = 'header';

            this.title = createElement('h1');

            var right = createElement('div', 'right');
            right.addEventListener('click', function() { self.nextMonth(); });

            var left = createElement('div', 'left');
            left.addEventListener('click', function() { self.prevMonth(); });

            //Append the Elements
            this.header.appendChild(this.title);
            this.header.appendChild(right);
            this.header.appendChild(left);
            this.el.appendChild(this.header);
        }

        this.title.innerHTML = this.current.format('MMMM YYYY');
    }

    Calendar.prototype.drawMonth = function() {
        var self = this;

        this.events.forEach(function(ev) {
            ev.date = moment(ev.date)
        });


        if (this.month) {
            this.oldMonth = this.month;
            this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
            this.oldMonth.addEventListener('webkitAnimationEnd', function() {
                self.oldMonth.parentNode.removeChild(self.oldMonth);
                self.month = createElement('div', 'month');
                self.backFill();
                self.currentMonth();
                self.fowardFill();
                self.el.appendChild(self.month);
                window.setTimeout(function() {
                    self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
                }, 16);
            });
        } else {
            this.month = createElement('div', 'month');
            this.el.appendChild(this.month);
            this.backFill();
            this.currentMonth();
            this.fowardFill();
            this.month.className = 'month new';
        }
    }

    Calendar.prototype.backFill = function() {
        var clone = this.current.clone();
        var dayOfWeek = clone.day();

        if (!dayOfWeek) { return; }

        clone.subtract('days', dayOfWeek + 1);

        for (var i = dayOfWeek; i > 0; i--) {
            this.drawDay(clone.add('days', 1));
        }
    }

    Calendar.prototype.fowardFill = function() {
        var clone = this.current.clone().add('months', 1).subtract('days', 1);
        var dayOfWeek = clone.day();

        if (dayOfWeek === 6) { return; }

        for (var i = dayOfWeek; i < 6; i++) {
            this.drawDay(clone.add('days', 1));
        }
    }

    Calendar.prototype.currentMonth = function() {
        var clone = this.current.clone();

        while (clone.month() === this.current.month()) {
            this.drawDay(clone);
            clone.add('days', 1);
        }
    }

    Calendar.prototype.getWeek = function(day) {
        if (!this.week || day.day() === 0) {
            this.week = createElement('div', 'week');
            this.month.appendChild(this.week);
        }
    }

    Calendar.prototype.drawDay = function(day) {
        var self = this;
        this.getWeek(day);

        //Outer Day
        var outer = createElement('div', this.getDayClass(day));
        outer.addEventListener('click', function() {
            self.openDay(this);
        });

        //Day Name
        var name = createElement('div', 'day-name', day.format('ddd'));

        //Day Number
        var number = createElement('div', 'day-number', day.format('DD'));


        //Events
        var events = createElement('div', 'day-events');
        this.drawEvents(day, events);

        outer.appendChild(name);
        outer.appendChild(number);
        outer.appendChild(events);
        this.week.appendChild(outer);
    }

    Calendar.prototype.drawEvents = function(day, element) {
        if (day.month() === this.current.month()) {
            var todaysEvents = this.events.reduce(function(memo, ev) {
                if (ev.date.isSame(day, 'day')) {
                    memo.push(ev);
                }
                return memo;
            }, []);

            todaysEvents.forEach(function(ev) {
                var evSpan = createElement('span', ev.color);
                element.appendChild(evSpan);
            });
        }
    }

    Calendar.prototype.getDayClass = function(day) {
        classes = ['day'];
        if (day.month() !== this.current.month()) {
            classes.push('other');
        } else if (today.isSame(day, 'day')) {
            classes.push('today');
        }
        return classes.join(' ');
    }

    Calendar.prototype.openDay = function(el) {
        var details, arrow;
        var dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent;
        var day = this.current.clone().date(dayNumber);
        $('#addBtn').empty()
        $("#text-desc").text("No Event");
        $.each(eventData, function(index, value) {
            if (day.format('YYYY-MM-DD') == value.date.format('YYYY-MM-DD')) {
                var start = value.date.format('YYYY-MM-DD')
                var end = moment(value.date).add(1, 'days').format('YYYY-MM-DD')
                $("#text-desc").text(value.desc);
                $('#addBtn').append('<a href="https://calendar.google.com/calendar/r/eventedit?text=' + value.eventName + '&dates=' + start + '/' + end + '&details=' + value.desc + '"><button class="btn btnX">Add to Google Calendar</button></a>')
                return false;
            } else {
                $('#addBtn').empty()
                $("#text-desc").text("No Event");
            }
        });

        var currentOpened = document.querySelector('.details');

        //Check to see if there is an open detais box on the current row
        if (currentOpened && currentOpened.parentNode === el.parentNode) {
            details = currentOpened;
            arrow = document.querySelector('.arrow');
        } else {
            //Close the open events on differnt week row
            //currentOpened && currentOpened.parentNode.removeChild(currentOpened);
            if (currentOpened) {
                currentOpened.addEventListener('webkitAnimationEnd', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.addEventListener('oanimationend', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.addEventListener('msAnimationEnd', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.addEventListener('animationend', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.className = 'details out';
            }

            //Create the Details Container
            details = createElement('div', 'details in');

            //Create the arrow
            var arrow = createElement('div', 'arrow');

            //Create the event wrapper

            details.appendChild(arrow);
            el.parentNode.appendChild(details);
        }

        var todaysEvents = this.events.reduce(function(memo, ev) {
            if (ev.date.isSame(day, 'day')) {
                memo.push(ev);
            }
            return memo;
        }, []);

        this.renderEvents(todaysEvents, details);

        arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + 'px';
    }

    Calendar.prototype.renderEvents = function(events, ele) {
        //Remove any events in the current details element
        var currentWrapper = ele.querySelector('.events');
        var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));

        events.forEach(function(ev) {
            var div = createElement('div', 'event');
            var square = createElement('div', 'event-category ' + ev.color);
            var span = createElement('span', '', ev.eventName);

            div.appendChild(square);
            div.appendChild(span);
            wrapper.appendChild(div);
        });

        if (!events.length) {
            var div = createElement('div', 'event empty');
            var span = createElement('span', '', 'No Events');

            div.appendChild(span);
            wrapper.appendChild(div);
        }

        if (currentWrapper) {
            currentWrapper.className = 'events out';
            currentWrapper.addEventListener('webkitAnimationEnd', function() {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
            currentWrapper.addEventListener('oanimationend', function() {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
            currentWrapper.addEventListener('msAnimationEnd', function() {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
            currentWrapper.addEventListener('animationend', function() {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
        } else {
            ele.appendChild(wrapper);
        }
    }

    Calendar.prototype.drawLegend = function() {
        var legend = createElement('div', 'legend');
        var calendars = this.events.map(function(e) {
            return e.calendar + '|' + e.color;
        }).reduce(function(memo, e) {
            if (memo.indexOf(e) === -1) {
                memo.push(e);
            }
            return memo;
        }, []).forEach(function(e) {
            var parts = e.split('|');
            var entry = createElement('span', 'entry ' + parts[1], parts[0]);
            legend.appendChild(entry);
        });
        this.el.appendChild(legend);
    }

    Calendar.prototype.nextMonth = function() {
        this.current.add('months', 1);
        this.next = true;
        this.draw();
    }

    Calendar.prototype.prevMonth = function() {
        this.current.subtract('months', 1);
        this.next = false;
        this.draw();
    }

    window.Calendar = Calendar;

    function createElement(tagName, className, innerText) {
        var ele = document.createElement(tagName);
        if (className) {
            ele.className = className;
        }
        if (innerText) {
            ele.innderText = ele.textContent = innerText;
        }
        return ele;
    }
}();

$(document).ready(function() {
    var yearList;
    var link = "https://themantomoon.herokuapp.com/getdata/getYearList"
    axios.get(link)
        .then(response => {
            yearList = response.data.data;
            $.each(yearList, function(index, value) {
                if (new Date().getFullYear() <= value) {
                    $('#list-btn').append('<button type="button" class="btn  mr-4" onclick="getYearData(' + value + ')">' + value + '</button>');
                }
            });
        })
        .catch(error => console.error(error));
});
var eventData = []

function getYearData(year, mode) {
    $('#calendar').empty()
    $('#addBtn').empty()
    $("#text-desc").text("No Event");
    var link = "https://themantomoon.herokuapp.com/getdata/" + year
    axios.get(link)
        .then(response => {
            eventData = []
            data = response.data.data;
            year = response.data.year;
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            $.each(data, function(index, value) {
                var dt = value.date;
                dt = dt.split(",").slice(0, 1).toString().split(" ")
                var month = parseInt(monthNames.indexOf(dt[0])) + 1
                var date = dt[1]
                var finalDate = year + "-" + month + "-" + date
                var tag = value.tag
                var desc = value.desc
                eventData.push({ eventName: tag, calendar: 'Events', color: 'orange', date: finalDate, desc: desc })
            });
            console.log(eventData);
            ! function() {
                var data = eventData;
                if (mode) {
                    var calendar = new Calendar('#calendar', data, null);
                } else {
                    var calendar = new Calendar('#calendar', data, year);
                }
            }();
        })
        .catch(error => console.error(error));
}
getYearData(new Date().getFullYear(), true)


//Clock
function startTime() {
    var today = new Date();
    var hr = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    ap = (hr < 12) ? "<span>AM</span>" : "<span>PM</span>";
    hr = (hr == 0) ? 12 : hr;
    hr = (hr > 12) ? hr - 12 : hr;
    //Add a zero in front of numbers<10
    hr = checkTime(hr);
    min = checkTime(min);
    sec = checkTime(sec);
    document.getElementById("clock").innerHTML = hr + ":" + min + ":" + sec + " " + ap;

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var curWeekDay = days[today.getDay()];
    var curDay = today.getDate();
    var curMonth = months[today.getMonth()];
    var curYear = today.getFullYear();
    var date = curWeekDay + ", " + curDay + " " + curMonth + " " + curYear;
    document.getElementById("date").innerHTML = date;

    var time = setTimeout(function() { startTime() }, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}