let socket;

export function connect(room, onMessage, onPresence) {
  socket = new WebSocket("wss://relay.websocket.in");

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: "join", room }));
    onPresence(true);
  };

  socket.onclose = () => onPresence(false);

  socket.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.room === room && msg.data) onMessage(msg.data);
  };
}

export function send(room, data) {
  socket.send(JSON.stringify({ room, data }));
}
