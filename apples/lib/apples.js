'use babel';

import ApplesView from './apples-view';
import { CompositeDisposable } from 'atom';

export default {

  activate(state) {
    this.applesView = new ApplesView(state.applesViewState);

    //the current timer running
    this.currentTimer = null

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    //The number of working units the user has completed
    this.pomo = 0;

    //whether or not the user is currently on a break
    this.currentlyOnBreak = true;

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'apples:start': () => this.start()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'apples:stop': () => this.stop()
    }));
  },

  deactivate() {
    this.statusTile.destroy();
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.applesView.destroy();
  },

  serialize() {
    return {
      applesViewState: this.applesView.serialize()
    };
  },

  /**
   * Stops the looping of pomodoros
   */
   stop() {
      clearInterval( this.currentTimer );
      this.currentTimer = null;
      this.currentlyOnBreak = true;
      this.minutesRemaining = 0;
   },

  /**
   * Starts a loop of podomoros
   */
  start( ){
     //clear the current interval
     if( this.currentTimer ){
      clearInterval( this.currentTimer );
     }

     if( this.currentlyOnBreak ){
        //start a pomodoro
        atom.beep();
        atom.notifications.addWarning(
           `Starting the ${this.pomo+1}th pomodoro, work hard for 25 minutes!` ); //todo add code to make suffix correct
        this.activateTimer(  25, 1 );
     } else {
        this.pomo ++;
        let breakLength;
        if( this.pomo % 4 == 0 ){ //every 4 pomos, long break
           breakLength = 10;
        } else {
           breakLength = 5;
        }

        this.activateTimer( breakLength, 1 );
        atom.notifications.addSuccess(`Take a ${breakLength} minute break! You deserve it :)`)
     }
     this.currentlyOnBreak = !this.currentlyOnBreak;
  },

  /*
   * adds a status bar tile
   */
  consumeStatusBar( statusBar ){
    this.applesView.addStatusBar( statusBar )
  },

   /*
    * Starts a timer that waits m minutes
    * Updates view every tickLength minutes
    */
   activateTimer( m, tickLength ){
      if( m % tickLength != 0 ){ console.error( "Something is wrong with the intervals" )}

      this.minutesRemaining = m;
      this.tickLength = tickLength;
      this.updateView();
      this.currentTimer = setInterval( () =>{
         this.minutesRemaining -= this.tickLength;
         this.updateView();
         if( this.minutesRemaining == 0 ){
            this.start();
         }
      }, tickLength * 60 * 1000 );
   },

   updateView() {
      this.applesView.update( this.minutesRemaining );
   }
};
