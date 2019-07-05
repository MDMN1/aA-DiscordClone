import React from 'react';
import { connect } from "react-redux";
import { updateMessage, destroyMessage } from '../../actions/messages_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.session.id,
    server: ownProps.server,
    channel: ownProps.channel,
    messages: ownProps.messages
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateMessage: (id, msg) => dispatch(updateMessage(id, msg)),
    destroyMessage: (msgId) => dispatch(destroyMessage(msgId))
  }
}

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMsg: "",
      body: ""
    };
    this.showMessageButtons = this.showMessageButtons.bind(this);
    this.showMessageDropdown = this.showMessageDropdown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openEditor = this.openEditor.bind(this);
    this.cancelEditor = this.cancelEditor.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.delMessage = this.delMessage.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.inside && !this.inside.contains(event.target)) {
      this.hideMessageDropdown();
    }
  }

  changeInput(key) {
    return (event) => {
      this.setState({ [key]: event.target.value });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.updateMessage(this.state.editMsg, this.state.body);
    this.setState({editMsg: "", body: ""});
  }

  delMessage(event) {
    event.preventDefault();
    this.props.destroyMessage(event.target.id);
  }
  openEditor(event) {
    event.preventDefault();
    this.setState({editMsg: event.target.id, body: "" });
  }
  openEditor(body) {
    return (event) => {
      event.preventDefault();
      this.setState({editMsg: event.target.id, body});
    }
  }
  cancelEditor(event) {
    event.preventDefault();
    this.setState({editMsg: "", body: ""});
  }

  convertDate(date) {
    const diff = new Date() - new Date(date);
    if (diff > (60 * 60 * 24 * 1000)) {
      return new Date(date).toLocaleDateString()
    } else {
      return new Date(date).toLocaleTimeString()
    }
  }

  showMessageDropdown(event) {
    const id = event.target.id;
    const node = document.getElementById(`opt-${id}`);
    node.classList.add("show-message-dropdown");
    this.inside = node;
    document.addEventListener("mousedown", this.handleClickOutside);
  };

  hideMessageDropdown(event) {
    this.inside.classList.remove("show-message-dropdown");
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  showMessageButtons (show) {
    return function (event) {
      const id = event.target.id;
      const el = document.getElementById(`ml${id}`);
      if (show && el) {
        el.classList.add("show-hidden");
      } else if (el) {
        el.classList.remove("show-hidden");
      }
    }.bind(this)
  };

  render() {
    const users = this.props.users;
    let myId = this.props.user;
    const ownerId = this.props.server.owner_id;
    return (
      <ul id="message-center" className="scrollable">

        <li id="first-message">
          {this.props.server.id != "@me" ? (
            <span>Welcome to the beginning of #{this.props.channel.name} channel</span>
          ) : (
              <span>Welcome to conflict</span>
            )}
          <div id="logo-overlay">
            <img src="https://discordapp.com/assets/5eed3f20bc3c75fd5ff63c60df8f679d.png" />
            <img src="https://discordapp.com/assets/129bf63f677720a34bc7ffeb74468a0e.png" />
          </div>
        </li>
        {this.props.messages.map(message => {
          const user = users[message.user_id];
          const isOwner = myId == ownerId;
          myId = myId;
          return (        
            <li key={message.id}>
 
              <img id="user-pic"
                src={user.image_url}
              // put click left and right-click events in the future to show profile, dropdown options
              />
              <div>
                <p id="user-username"
                //put left and right-click events inthe future to show profile, dropdown options
                >
                  {user.username}
                </p> &nbsp;
                <span id="message-date">{this.convertDate(message.created_at)}</span>

                {this.state.editMsg == message.id ? (
                  <form key={message.id}
                    onSubmit={this.submitForm}
                  >
                    <textarea
                      value={this.state.body}
                      onChange={this.changeInput("body")}
                    />
                    <div>
                      <button onClick={this.cancelEditor}>cancel</button>
                      <button onClick={this.handleSubmit}>save</button>
                    </div>
                    
                  </form>
                ) : (
                  <section>
                    <div
                      id={`${message.id}`}
                      className="revealer message-body"
                      onMouseEnter={this.showMessageButtons(true)}
                      onMouseLeave={this.showMessageButtons(false)}
                    >
                      {message.body}
                      {message.created_at != message.updated_at ? (
                        <span id="edited-txt">&nbsp;(edited)</span>
                      ):""}
                      <i
                        id={`ml${message.id}`}
                        className="fas fa-ellipsis-v hidden"
                        onClick={this.showMessageDropdown}
                      >

                      </i>
                    </div>
                    
                    <div id={`opt-ml${message.id}`} className="message-dropdown hidden">
                        {myId == message.user_id && (

                          <button
                            id={message.id}
                            onClick={this.openEditor(message.body)}
                          >
                            Edit
                          </button>
                        )}
                        {(isOwner || myId == message.user_id) && (
                          <button
                            id={message.id}
                            onClick={this.delMessage}
                          >
                            Delete
                          </button>
                        )}

                      
                    </div>
                  </section>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageList)