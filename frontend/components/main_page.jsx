import React from 'react';
import ChannelIndexContainer from './channel/channel_index_container';
import ServerIndexContainer from './server/server_index_container';
import ChannelShowContainer from './channel/channel_show_container';

import UserSettingsContainer from './user/user_settings/user_settings_container';
import ServerAddContainer from './server/server_add_container';
import ServerDropdownContainer from './server/server_dropdown_container';
import ServerSettingsContainer from './server/server_settings/server_settings_container';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      overlay: ""
    };
    this.showComponent = this.showComponent.bind(this);
    this.closeComponent = this.closeComponent.bind(this);
  }

  showComponent(key) {
    return () => {
      this.setState({ overlay: key });
    }
  }

  closeComponent() {
    this.setState({ overlay: "" });
  }

  getComponent() {
    switch (this.state.overlay) {
      case "User Settings":
        return <UserSettingsContainer closeComponent={this.closeComponent} />
      case "Add Server":
        return <ServerAddContainer closeComponent={this.closeComponent}/>
      case "Server Dropdown":
        return (
          <ServerDropdownContainer
            closeComponent={this.closeComponent}
            showInvitePeople={this.showComponent("Invite People")}
            showChangeNickname={this.showComponent("Change Nickname")}
            showServerSettings={this.showComponent("Server Settings")}
          />
        )
      case "Server Settings":
        return <ServerSettingsContainer closeComponent={this.closeComponent}/>
    }
  }

  render() {
    return (
      <section id="main-page">
        <ServerIndexContainer showAddServer={this.showComponent("Add Server")}/>
        <ChannelIndexContainer
          showUserSettings={this.showComponent("User Settings")}
          showServerDropdown={this.showComponent("Server Dropdown")}
        />
        <ChannelShowContainer />
        {this.getComponent()}
      </section>
    )
  }
}

export default MainPage;