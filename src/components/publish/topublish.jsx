import { useState, useContext } from 'react';
import UserContext from '../../contexts/usercontext';
import dotenv from 'dotenv';

import Form from './style';
import axios from 'axios';

dotenv.config()

export default function Publish(props) {
   const {publish: publishVisible, user} = props;
  
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  
  const { token, setIsLoading, isLoading } = useContext(UserContext);
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


  let publishDisplay = 'block';

  if(!publishVisible) {
    publishDisplay = 'none';
  } else {
    publishDisplay = 'block';
  }

  function publish(e) {
    e.preventDefault();
    setIsLoading(true);
    setDescription('');
    setUrl('');

    const data = {
      url: url,
      description: description,
    };
    const promise = axios.post( process.env.REACT_APP_API_URL + '/timeline', data, config);

    promise.then((response) => {
      setIsLoading(false);
      console.log('publicado com sucesso', response);
    });

    promise.catch((error) => {
      setIsLoading(false);
      alert('Houve um erro ao publicar seu link');
    });
  }

  return (
    <Form onSubmit={publish} display = {publishDisplay}>
      <div>
        <img src={user.image} alt={user.name} />
        <p>What are you going to share today?</p>
      </div>
      <div className="inputs">
        <input
          type="text"
          placeholder="http://..."
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
        />
        <input
          className="hashtag"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Awesome article about #javascript"
          disabled={isLoading}
        />
      </div>
      <div className="button">
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Publishing..." : "Publish"}
        </button>
      </div>
    </Form>
  );
}
