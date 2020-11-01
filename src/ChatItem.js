import React from "react";
import { ListItem } from "@material-ui/core";

class ChatItem extends React.Component {
  render() {
    const { message, email } = this.props;
    const isOwnMessage = message.author === email;

    return (
      <ListItem style={styles.listItem(isOwnMessage)}>
        <div style={styles.author}>{message.author}</div>
        <div style={styles.container(isOwnMessage)}>
          {message.body}
          <div style={styles.timestamp}>
            {new Date(message.dateCreated.toISOString()).toLocaleString()}
          </div>
        </div>
      </ListItem>
    );
  }
}

const styles = {
  listItem: (isOwnMessage) => ({
    flexDirection: "column",
    alignItems: isOwnMessage ? "flex-end" : "flex-start",
  }),
  container: (isOwnMessage) => ({
    maxWidth: "75%",
    borderRadius: 12,
    padding: 16,
    color: "white",
    fontSize: 12,
    backgroundColor: isOwnMessage ? "#054740" : "#262d31",
  }),
  author: { fontSize: 10, color: "gray" },
  timestamp: { fontSize: 8, color: "white", textAlign: "right", paddingTop: 4 },
};

export default ChatItem;
