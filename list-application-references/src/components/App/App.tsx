import * as React from 'react';
import styles from './App.scss';
import requester from '@sitevision/api/client/requester';
import router from '@sitevision/api/common/router';
import Spinner from '../Spinner/Spinner';
import toasts from '@sitevision/api/client/toasts';

const App: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [references, setReferences] = React.useState('');

  const getReferences = () => {
    setLoading(true);
    requester.doPost({
      url: router.getStandaloneUrl("/getReferences"),
    }).then((response: any) => {
      setReferences(response.html)
      setLoading(false);
      toasts.publish({
        message: "Skriptet har sökt igenom alla sidor!",
        type: 'primary'
      })

    }).catch((response) => {
      alert(response.responseJSON.errorMsg);
    });
  }

  return (
    <div className={styles.container} >
      <p>Lista alla referenser för ett Tillägg (Utifrån inställningar)</p>
      {loading ?
        <Spinner></Spinner>
        :
        <button className={styles.button} onClick={getReferences}>Starta skript</button>
      }
      {references !== '' &&
        <ul dangerouslySetInnerHTML={{ __html: references }}></ul>
      }
    </div>
  );
};

export default App;
