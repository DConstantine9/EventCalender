import React, { Component } from 'react';
import * as moment from "moment";
import "moment/locale/ru";
import "./css/style.css"

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dateContext: moment(),
      today: moment(),
      showMonth: false,
      showYear: false,
      dayOn: false
    }
  }

  weekdays = moment.weekdays();
  weekdaysShort = moment.weekdaysShort();
  months = moment.months();

  year = () => {
    return this.state.dateContext.format("Y");
  }

  month = () => {
    return this.state.dateContext.format("MMMM");
  }

  daysInMonth = () => {
    return this.state.dateContext.daysInMonth();
  }

  currentDate = () => {
    return this.state.dateContext.get("date");
  }

  CurrentDay = () => {
    return this.state.dateContext.format("D");
  }

  firstDayOfMonth = () => {
    let dateContext = this.state.dateContext;
    let firstDay = moment(dateContext).startOf("month").format('d');
    return firstDay;
  }
  
  setMonth = (month) => {
    let monthNo = this.months.indexOf(month);
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).set("month", monthNo);
    this.setState({dateContext: dateContext})
  }

  nextMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).add(1, "month");
    this.setState({dateContext: dateContext});
    this.props.onNextMonth && this.props.onNextMonth();
  }

  prevMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).subtract(1, "month");
    this.setState({dateContext: dateContext});
    this.props.onPrevMonth && this.props.onPrevMonth();
  }

  onSelectChange = (e, data) => {
    this.setMonth(data);
    this.props.onMonthChange && this.props.onMonthChange();
  }

  SelectList = (props) => {
    let popup = props.data.map((data) => {
      return (
        <div key={data}>
          <a href="#" onClick={(e) => {this.onSelectChange(e, data)} }>
            {data}
          </a>
        </div>
      )
    })

    return (
      <div className="month-popup">
        {popup}
      </div>
    )
  }

  onChangeMonth = (e, month) => {
    this.setState({showMonthPopup: !this.state.showMonthPopup})
  }

  showYearEditor = () => {
    this.setState({showYearNav:true})
  }

  setYear = (year) => {
   let dateContext = Object.assign({}, this.state.dateContext);
   dateContext = moment(dateContext).set("year", year);
   this.setState({dateContext: dateContext});
  }

  onYearChange = (e) => {
    this.setYear(e.target.value);
    this.props.onYearChange && this.props.onYearChange(e, e.target.value);
  }

  onKeyUpYear = (e) => {
    if (e.which === 13 || e.which === 27) {
      this.setYear(e.target.value);
      this.setState({showYearNav: false})
    }
  }

  YearNav = () => {
    return (
      this.state.showYearNav ? 
      <input 
        defaultValue = {this.year()} className="editor-year" 
        ref={(yearInput) => {this.yearInput = yearInput}} 
        onKeyUp = {(e) => this.onKeyUpYear(e)}
        onChange = {(e) => this.onYearChange(e)}
        type="number"
        placeholder="year"
      /> 
      :
      <span className="label-year" onDoubleClick={(e) => {this.showYearEditor()}}>
        {this.year()}
      </span>
    )
  }

  MonthNav = () => {
    return (
      <span className="label-month" onClick={(e) => {this.onChangeMonth(e, this.month())}}>
        {this.month()}
        {this.state.showMonthPopup && <this.SelectList data={this.months} />}
      </span>
    )
  }

  render() {

    let mon = moment.locale("ru", {
      week: {
        dow: 1
      }
    })
    /*this.weekdaysShort.shift();
    this.weekdaysShort.push("вс");*/
    let weekdays = this.weekdaysShort.map((day) => {
      return (
        <td key={day} className="week-day">{day}</td>
      )     
    });

    let blanks = [];
    for(let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(<td key={i * 80} className="emptySlot">
        {""}
      </td>)
    }

    let daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      let className = (d == this.CurrentDay() ? "day current-day": "day")
      daysInMonth.push(
        <td onClick={} key={d} className={className}>
          <span>{d}</span>
        </td>
      )
    }

    console.log("days: ", daysInMonth);

    var totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if((i % 7) !== 0) {
        cells.push(row)
      } else {
        let insertRow = cells.slice();
        rows.push(insertRow);
        cells = [];
        cells.push(row)
      }
      if (i === totalSlots.length - 1) {
        let insertRow = cells.slice();
        rows.push(insertRow) 
      }
    })

    let trElems = rows.map((d, i) => {
      return (
        <tr key={i * 100}>
          {d}
        </tr>
      )
    })

    return (
      <div className="calender">
        <div className="realHeader">
          <i className="fas fa-angle-left" id="prevMonth" onClick={(e) => {this.prevMonth()}}></i>
          <div className="my"> 
            <this.MonthNav />
            {" "}
            <this.YearNav /> 
          </div>
          <i className="fas fa-angle-right" id="nextMonth" onClick={(e) => {this.nextMonth()}}></i>
        </div>
        <table className="table-calender">
          <thead>
          </thead>
          <tbody>
            <tr>
              {weekdays}
            </tr>
            {trElems}
          </tbody>
        </table>
      </div>
    )
  }
}