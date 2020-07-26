'use babel'

exports.sendScript = function (serverUrl, script, scriptName, runAfterSend) {
  websocket = new WebSocket(serverUrl);
  websocket.onopen = (event) => {
    websocket.send(JSON.stringify(createScriptPayload(script, scriptName)));
  }

  websocket.onmessage = (event) => {
    msg = JSON.parse(event.data);
    switch (msg.command) {
      case 'sendScript':
        if (runAfterSend) {
          websocket.send(JSON.stringify(createRunPayload(scriptName)));
        } else {
          websocket.close();
        }
        break;
      case 'runScript':
        var res = msg.result;
        if (res === 'success') {
          atom.notifications.addSuccess("Script executed successfully!");
        } else if (res === 'failed') {
          atom.notifications.addError("Script failed to execute!");
        }
        websocket.close();
        break;
    }
  }

  websocket.onerror = (event) => {
    atom.notifications.addError("An error occurred while sending the script! Did you misspell the server address?");
  }
};

function createRunPayload(scriptName) {
  return {
    command: 'runScript',
    content: {
      name: scriptName
    }
  }
}

function createScriptPayload(script, scriptName) {
  return {
    command: 'sendScript',
    content: {
      name: scriptName,
      data: script.split('\n')
    }
  };
}
