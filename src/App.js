import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Link} from "react-router-dom"
import Main from "./Main.js"


export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Main}/>
        </div>
      </BrowserRouter>
    )
  }
  
}

