import React from "react";
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from '../Navbar/Navbar';
import EditAdvert from '../EditAdvert/EditAdvert';
import AdvertDetail from '../AdvertDetail/AdvertDetail';
import Login from '../Login/Login';
import Profile from '../Profile/Profile';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import Home from '../Home/Home';

import UserContext from "../../contexts/UserContext";

import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        firstname: '',
        surname: '',
        tag: '',
      }
    }
  }

  onUserLogin = user => {
    this.setState({ user });
  };

  isUserLogged = () => {
    const userOnLocalStorage = localStorage.getItem('user');

    if ( !userOnLocalStorage) return false;

    const isUserLogged = this.state.user.firstname !== '';
    if(!isUserLogged) {
      console.log(JSON.parse(userOnLocalStorage));
      this.onUserLogin(JSON.parse(userOnLocalStorage));
    }

    return true;
  };

  render() {
    const value = {
      user: this.state.user,
      onSubmit: this.onUserLogin
    };

    return (  
      <div>
        <UserContext.Provider value={value}>        
          <Router>
            {
              !this.isUserLogged()
              &&
              <React.Fragment>
                <p>no estas logueado !!</p>
                <Route component={Login} />
              </React.Fragment>
            }
            {
              this.isUserLogged()
              &&
              <React.Fragment>              
                <Navbar/>

                <Switch>
                  <Route path="/login" component={Login} />
                  <Route path="/profile" component={Profile} />
                  <Route path="/create-advert" component={EditAdvert} /> {/* Create advert */}
                  <Route path="/edit-advert/:id" component={EditAdvert} /> {/* Edit advert */}
                  <Route path="/advert/:id" component={AdvertDetail} />
                  <Route exact path="/" component={Home} />
                  <Route component={NotFoundPage} />
                </Switch>
            </React.Fragment>
            }
          </Router>
        </UserContext.Provider>
      </div>
    );
  }
}
