'use babel';

import { sendScript } from './fabri-script--editor-websocket'

export default class FabriScriptRunView {

  constructor() {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('fabri-script--editor');

    // Create the content of the panel.
    const message = document.createElement('div');

    const panel = document.createElement('atom-panel');

    const inset = document.createElement('div');
    inset.classList.add('inset-panel');

    const heading = document.createElement('div');
    heading.classList.add('panel-heading');
    heading.textContent = 'Configure run target:';
    inset.appendChild(heading);

    const body = document.createElement('div');
    body.classList.add('panel-body');
    body.classList.add('padded');

    const inputHolder = document.createElement('div');
    inputHolder.classList.add('block');

    const serverAddrInput = document.createElement('input');
    serverAddrInput.classList.add('input-text');
    serverAddrInput.classList.add('inline-block');
    serverAddrInput.type = 'text';
    serverAddrInput.placeholder = 'Enter server address.';
    inputHolder.appendChild(serverAddrInput);

    const button = this.createButton(serverAddrInput);

    body.appendChild(inputHolder);
    body.appendChild(button);
    inset.appendChild(body);
    panel.appendChild(inset);

    /*message.innerHTML = `
    <atom-panel class='padded'>
      <div class="inset-panel">
        <div class="panel-heading">Configure run target</div>
        <div class="panel-body padded">
          <input class='input-text inline-block' type='text' placeholder='Enter server address.'>
          <div class='block'>
            <button class='btn btn-lg' onclick="this.send();">Run!</button>
          </div>
        </div>
      </div>
    </atom-panel>
    `;*/

    message.classList.add('message');
    message.appendChild(panel);

    this.element.appendChild(message);
  }

  createButton(serverAddrBox) {
    const holder = document.createElement('div');
    holder.classList.add('block');

    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.classList.add('btn-success');
    btn.classList.add('icon');
    btn.classList.add('icon-rocket');
    btn.classList.add('btn-lg');
    btn.textContent = 'Run!';
    btn.onclick = () => {
      this.send(serverAddrBox.value);
    };
    holder.appendChild(btn);
    return holder;
  }

  send(message) {
    atom.notifications.addInfo("Sending script to server: " + message);
    const editor = atom.workspace.getCenter().getActiveTextEditor();
    if (editor !== undefined) {
      if (editor.isModified()) {
        editor.save();
      }
      var scriptContent = editor.getText();
      sendScript("ws://" + message + "/", scriptContent, editor.getTitle(), true);
      atom.notifications.addInfo("Sending script to server...");
    } else {
      atom.notifications.addWarning("No editor open to send!");
      return;
    }
  }

  serialize() {
    return {
      deserializer: 'fabriscript/FabriScriptRunView'
    };
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    // Used by Atom for tab text
    return 'FabriScript Run Settings';
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://fabriscript-run';
  }

  getDefaultLocation() {
    return 'right';
  }

  getAllowedLocations() {
    return ['left', 'right', 'bottom']
  }
}
