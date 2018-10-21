import * as React from "react";
import { Grid } from "semantic-ui-react";
import { AppMenuButton } from "./AppMenuButton";
import { AppMenuSearchInput } from "./AppMenuSearchInput";
import { IAppMenuProps } from "../../../types";
import { Help } from "../Help/Help";

const AppMenu = ({ search, apps, ...otherProps }: IAppMenuProps) => (
  <>
    <Help
      {...search.help}
      trigger={
        <AppMenuSearchInput
          action={{
            icon: search.icon,
            onClick: search.onSearch,
            disabled: search.disabled
          }}
          placeholder={search.text}
          onChange={search.onSearch}
          value={search.value}
          disabled={search.disabled}
          fluid
        />
      }
    />
    <Grid columns={5} doubling stackable {...otherProps}>
      <Grid.Row>
        {apps.map((app, index) => (
          <Grid.Column>
            <AppMenuButton {...app} key={index} />
          </Grid.Column>
        ))}
      </Grid.Row>
    </Grid>
  </>
);

export { AppMenu, IAppMenuProps };
