import { useState, useContext, useEffect } from 'react';
import useInterval from 'use-interval';
import UserContext from '../../contexts/usercontext';

import NewPostButton from '../NewPostButton/NewPostButton';
import Post from '../Post/Post';
import { Article } from './style';

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export default function Posts(props) {
  let { url } = props;
  const { token } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [reload, setReload] = useState(true);

  const [newPosts, setNewPosts] = useState(0);
  const [lastPost, setLastPost] = useState({});

  const isObject = (obj) => {
    return obj && typeof obj === 'object';
  };

  const isEqual = (obj1, obj2) => {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }
    for (let key in obj1) {
      const value1 = obj1[key];
      const value2 = obj2[key];
      const areObjects = isObject(value1) && isObject(value2);

      if (
        (areObjects && !isEqual(value1, value2)) ||
        (!areObjects && value1 !== value2)
      ) {
        return false;
      }
    }

    return true;
  };

  useInterval(() => {
    const getNewPosts = async () => {
      let newPosts = 0;
      const URL = `${process.env.REACT_APP_API_URL}${url}`;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.get(URL, config);
        const updatedPosts = response.data;
        if (isEqual(updatedPosts[0], lastPost)) {
          return newPosts;
        }
        setLastPost(updatedPosts[0]);
        for (const post of updatedPosts) {
          if (!isEqual(post, posts[0])) {
            newPosts++;
          } else {
            return newPosts;
          }
        }
        return newPosts;
      } catch (error) {
        console.log(error);
      }
    };

    getNewPosts().then((newPosts) => {
      if (newPosts > 0) {
        setNewPosts(newPosts);
      }
    });
  }, 15000);

  if (url !== '/timeline' && url[0] + url[1] !== '/u') url = `/hashtag${url}`;

  useEffect(() => {}, [reload]);

  const getPosts = async () => {
    const URL = `${process.env.REACT_APP_API_URL}${url}`;
    console.log(URL);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(URL, config);
      setPosts(response.data);
      console.log(response.data)
      setReload(!reload);
    } catch (error) {
      console.log('erro ao pegar os posts', error);
      alert(
        'An error occured while trying to fetch the posts, please refresh the page',
      );
    }
  };
  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  if (!posts.length) {
    return (
      <div align="center">
        <span
          style={{
            fontFamily: 'Lato',
            fontSize: '25px',
            color: 'white',
          }}
        >
          There are no posts yet
        </span>
      </div>
    );
  }

  return (
    <>
      {newPosts > 0 && (
        <NewPostButton
          handleClick={() => {
            setNewPosts(0);
            getPosts();
          }}
          newPosts={newPosts}
        />
      )}
      <Article>
        {posts.map(
          (
            {
              post_id,
              user_name,
              icon,
              description,
              title_url,
              description_url,
              url,
              image_url,
              tooltipText,
              liked_by_me,
              like_count,
              user_name_repost
            },
            index,
          ) => {
            return (
              <Post
                key={index}
                publishing={{
                  post_id,
                  user_name,
                  icon,
                  description,
                  title_url,
                  description_url,
                  url,
                  image_url,
                  tooltipText,
                  liked_by_me,
                  like_count,
                  user_name_repost
                }}
                getPosts={getPosts}
              />
            );
          },
        )}
      </Article>
    </>
  );
}
