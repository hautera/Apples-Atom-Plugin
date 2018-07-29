'use babel';

export default class ApplesView {

  constructor( serializedState ) {

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('apples', 'inline-block');

    // Create message element
    this.message = document.createElement('div');
    this.message.textContent = 'Hello';
    this.element.appendChild( this.message );
    this.minutesRemaining = 0

}

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
}

  getElement() {
    return this.element;
 }

 update( minutes ) {
    this.minutesRemaining = minutes
    this.message.textContent = `${ this.minutesRemaining } min`
    atom.tooltips.add( this.element, {
      title : this.tooltipText(),
      html: false
   })
}

 addStatusBar( statusBar ){
    statusBar.addRightTile({ item : this.element, priority : 100 })
 }

 tooltipText(){
    return `${ this.minutesRemaining } minutes until next break`
 }
}
