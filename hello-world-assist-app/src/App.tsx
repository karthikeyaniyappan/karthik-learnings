import { AgenticFullChat } from '@trimble-agentic-external-npm-local/agentic-chat-react';
import type { ChatUiEvent } from '@trimble-agentic-external-npm-local/agentic-chat-react';
import { AGENT_ID, ENVIRONMENT, THEME } from './assist/config';
import { provideToken } from './assist/provideToken';
import './App.css';

function App() {
  const handleEvent = (event: ChatUiEvent) => {
    console.log('Assist chat event:', event);
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Hello World</h1>
        <p>Trimble Assist is embedded below.</p>
      </header>

      <main className="app__chat">
        <AgenticFullChat
          provideToken={provideToken}
          onEvent={handleEvent}
          environment={ENVIRONMENT}
          theme={THEME}
          agentId={AGENT_ID}
          chatInputConfiguration={{ buttons: [], hideModelSelection: false }}
          className="assist-chat"
        />
      </main>
    </div>
  );
}

export default App;
