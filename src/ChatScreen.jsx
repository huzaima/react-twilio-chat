import React from "react";
import "./App.css";
import {
  AppBar,
  Backdrop,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  List,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import { getToken } from "./services/ChatService";
import { Component } from "react";
import ChatItem from "./ChatItem";
const Chat = require("twilio-chat");

class ChatScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      messages: [],
      loading: false,
      channel: null,
    };

    this.scrollDiv = React.createRef();
  }

  componentDidMount = async () => {
    const { location } = this.props;
    const { state } = location || {};
    const { email, room } = state || {};
    let token = "";

    if (!(!!email && !!room)) {
      this.props.history.replace("/");
    }

    this.setState({ loading: true });

    try {
      token = await getToken(email);
    } catch {
      throw new Error("unable to get token, please reload this page");
    }

    const client = await Chat.Client.create(token);

    client.on("tokenAboutToExpire", async () => {
      const token = await getToken(email);
      client.updateToken(token);
    });

    client.on("tokenExpired", async () => {
      const token = await getToken(email);
      client.updateToken(token);
    });

    try {
      const channel = await client.getChannelByUniqueName(room);

      // getting list of all messages since this is an existing channel
      const messages = await channel.getMessages();
      this.setState(
        {
          channel,
          loading: false,
          messages: messages.items || [],
        },
        () => this.joinChannel(channel)
      );
    } catch {
      try {
        const channel = await client.createChannel({
          uniqueName: room,
          friendlyName: room,
        });
        this.joinChannel(channel);
        this.setState({ channel, loading: false });
      } catch {
        throw new Error("unable to create channel, please reload this page");
      }
    }
  };

  joinChannel = (channel) => {
    channel.join();
    channel.on("messageAdded", this.handleMessageAdded);
    this.scrollToBottom();
  };

  handleMessageAdded = (message) => {
    const { messages } = this.state;
    this.setState(
      {
        messages: !!messages ? [...messages, message] : [message],
      },
      this.scrollToBottom
    );
  };

  scrollToBottom = () => {
    const scrollHeight = this.scrollDiv.current.scrollHeight;
    const height = this.scrollDiv.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  sendMessage = () => {
    const { text, channel } = this.state;
    if (!!text && !!String(text).trim()) {
      this.setState({ loading: true });
      channel && channel.sendMessage(text);
      this.setState({ text: "", loading: false });
    }
  };

  render() {
    const { loading, text, messages, channel } = this.state;
    const { location } = this.props;
    const { state } = location || {};
    const { email, room } = state || {};

    return (
      <Container component="main" maxWidth="md">
        <Backdrop open={loading} style={{ zIndex: 99999 }}>
          <CircularProgress style={{ color: "white" }} />
        </Backdrop>
        <AppBar style={styles.header} elevation={10}>
          <Toolbar>
            <Typography variant="h6">
              {`Room: ${room}, User: ${email}`}
            </Typography>
          </Toolbar>
        </AppBar>
        <CssBaseline />
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
          style={{ paddingTop: 100, borderWidth: 1 }}
        >
          <Grid
            item
            style={{ overflow: "auto", height: 400 }}
            ref={this.scrollDiv}
          >
            <List dense={true}>
              {messages &&
                messages.map((message) => (
                  <ChatItem
                    key={message.index}
                    message={message}
                    email={email}
                  />
                ))}
            </List>
          </Grid>
          <Grid item style={{ marginTop: 12 }}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item style={{ flex: 1, marginRight: 12 }}>
                <TextField
                  required
                  style={{ width: "100%" }}
                  placeholder="Enter message"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={text}
                  disabled={!channel}
                  onChange={(event) =>
                    this.setState({ text: event.target.value })
                  }
                />
              </Grid>
              <Grid item>
                <IconButton
                  style={{ backgroundColor: "#3f51b5" }}
                  onClick={this.sendMessage}
                  disabled={!channel}
                >
                  <Send style={{ color: "white" }} />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

const styles = {
  header: {},
  grid: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  card: { padding: 40 },
  textField: { width: 300 },
  gridItem: { paddingTop: 12, paddingBottom: 12 },
  button: { width: 300 },
};

export default ChatScreen;
