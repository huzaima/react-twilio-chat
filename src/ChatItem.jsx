import React from "react";
import "./App.css";
import { ListItem } from "@material-ui/core";
import { PureComponent } from "react";

class ChatItem extends PureComponent {
  render() {
    const { message, email } = this.props;

    return (
      <ListItem
        style={{
          flexDirection: "column",
          alignItems: message.author === email ? "flex-end" : "flex-start",
        }}
      >
        <div style={{ fontSize: 10, color: "gray" }}>{message.author}</div>
        <div
          style={{
            maxWidth: "75%",
            borderRadius: 12,
            padding: 16,
            color: "white",
            fontSize: 12,
            backgroundColor:
              message.author === email ? "rgb(5, 71, 64)" : "rgb(38, 45, 49)",
          }}
        >
          {message.body}
          <div
            style={{
              fontSize: 8,
              color: "white",
              textAlign: "right",
              paddingTop: 4,
            }}
          >
            {new Date(message.dateCreated.toISOString()).toLocaleString()}
          </div>
        </div>
      </ListItem>
    );
  }
}

export default ChatItem;
