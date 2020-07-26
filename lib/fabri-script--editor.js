'use babel';

import FabriScriptRunView from './fabri-script-editor-run-view';
import { CompositeDisposable, Disposable } from 'atom';

export default {

  modalPanelSettings: null,

  subscriptions: null,

  activate(state) {
    console.log('FabriScript activated!');

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register a command that toggles the run dialog
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'fabri-script--editor:toggle': () => this.runscript()
    }));

    // Register a workspace view for the run settings.
    this.subscriptions.add(atom.workspace.addOpener(uri => {
      if (uri === 'atom://fabriscript-run') {
        return new FabriScriptRunView();
      }
    }));

    // Cleanup.
    this.subscriptions.add(new Disposable(() => {
      atom.workspace.getPaneItems().forEach((item) => {
        if (item instanceof FabriScriptRunView) {
          item.destroy();
        }
      });
    }));
  },

  deactivate() {
    this.modalPanelSettings.destroy();
    this.subscriptions.dispose();
  },

  serialize() {
    return {
    };
  },

  toggle() {
    return (
      this.modalPanelSettings.isVisible() ?
      this.modalPanelSettings.hide() :
      this.modalPanelSettings.show()
    );
  },

  runscript() {
    atom.workspace.toggle('atom://fabriscript-run');
    console.log('Open run dialog!');
  },

  deserializeFabriScriptRunView(serialized) {
    return new FabriScriptRunView();
  }
};
