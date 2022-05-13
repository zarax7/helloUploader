import React from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import SignUpForm from "../../components/SignUpForm/SignUpForm";

export default class AuthPage extends React.Component {
  state = {
    showLogin: true,
    active: true,
  };

  render() {
    return (
      <main>
        <div>
          <h3
            onClick={() =>
              this.setState({
                showLogin: !this.state.showLogin,
                active: !this.state.active,
              })
            }
          >
            {/* {this.state.showLogin ? ( */}
            <ul className="nav nav-pills nav-justified mb-3" id="ex1">
              <li className="nav-item">
                <a
                  className={this.state.active ? "nav-link active" : "nav-link"}
                  id="tab-login"
                  data-mdb-toggle="pill"
                  href="#pills-login"
                  aria-controls="pills-login"
                  aria-selected="true"
                >
                  Register
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className={this.state.active ? "nav-link" : "nav-link active"}
                  id="tab-register"
                  data-mdb-toggle="pill"
                  href="#pills-register"
                  aria-controls="pills-register"
                  aria-selected="false"
                >
                  Login
                </a>
              </li>
            </ul>
          </h3>
        </div>

        {this.state.showLogin ? (
          <LoginForm setUserInState={this.props.setUserInState} />
        ) : (
          <SignUpForm setUserInState={this.props.setUserInState} />
        )}
      </main>
    );
  }
}
