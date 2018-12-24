import * as React from 'react';
import './App.css';
import start from './slither/Slither';

class App extends React.Component {

  public startgame() {
    start()
  }

  public render() {
    return (
      <div className="main_page">
        <div className="game_start_block">
          <button className="start_button" /*tslint:disable-next-line:jsx-no-lambda*/ 
          onClick={() => this.startgame() }>
            Start!
          </button>
        </div>
      </div>
    );
  }
}

export default App;
