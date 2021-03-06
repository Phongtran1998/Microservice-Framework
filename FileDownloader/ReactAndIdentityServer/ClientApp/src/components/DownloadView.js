import React, { Component } from "react";
import axios from "axios";
import authService from "./api-authorization/AuthorizeService";

export default class DownloadView extends Component {
  state = { token: null, link: "", error: "", message: "" };
  async componentDidMount() {
    const token = await authService.getAccessToken();
    this.setState({ token });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.message !== this.props.message) {
      this.setState({ message: "" });
    }
  }
  onHandleClick = async e => {
    console.log(this.state.token);
    e.preventDefault();
    if (!this.state.link) {
      return this.setState({ error: "Must add link" });
    }
    try {
      await axios.post(
        "http://localhost:1200/values",
        {
          value: this.state.link
        },
        { headers: { Authorization: `Bearer ${this.state.token}` } }
      );
      this.setState({
        error: "",
        link: "",
        message: "Download is being process"
      });
    } catch (e) {
      this.setState({ error: "Cannot download link", link: "", message: "" });
    }
  };
  renderMessage = () => {
    if (this.props.message) {
      return <h4>{this.props.message}</h4>;
    }
    return <h4>{this.state.message}</h4>;
  };
  render() {
    return (
      <div>
        {this.state.token ? (
          <form onSubmit={this.onHandleClick}>
            <label>Download Link</label>
            <input
              value={this.state.link}
              onChange={e => this.setState({ link: e.target.value })}
            />

            <button>Download file</button>
          </form>
        ) : (
          ""
        )}
        {this.renderMessage()}
        <h4 style={{ color: "red" }}>{this.state.error}</h4>
      </div>
    );
  }
}
