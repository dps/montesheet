import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Link } from "./../util/router.js";

function SettingsNav(props) {
  return (
    <Tabs
      value={props.activeKey}
      indicatorColor="primary"
      textColor="primary"
      centered={true}
    >
      <Tab
        label="General"
        value="general"
        component={Link}
        to="/settings/general"
      ></Tab>

      <Tab
        label="Password"
        value="password"
        component={Link}
        to="/settings/password"
      ></Tab>

      <Tab
        label="Billing"
        value="billing"
        component={Link}
        to="/settings/billing"
      ></Tab>
    </Tabs>
  );
}

export default SettingsNav;
