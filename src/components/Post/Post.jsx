import React, { useState, useContext, useRef } from 'react';
import { MainLink, PostWrapper } from './style';
import ReactHashtag from 'react-hashtag';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import axios from 'axios';

import Likes from '../posts/likes.jsx';
import UserContext from '../../contexts/usercontext';

const Post = ({ publishing, getPosts }) => {
  const { user, token } = useContext(UserContext);
  const textAreaRef = useRef(null);

  const {
    post_id,
    user_name,
    icon,
    description,
    title_url,
    description_url,
    url,
    image_url,
    tooltipText,
    liked,
    like_count,
  } = publishing;

  const [editing, setEditing] = useState(false);
  const [descriptionEdit, setDescriptionEdit] = useState(description);

  const handleEdit = async () => {
    const URL = `${process.env.REACT_APP_API_URL}/timeline/${post_id}`;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const data = {
      description: descriptionEdit,
    };

    try {
      const response = await axios.patch(URL, data, config);
      console.log(response.data);
      setEditing(false);
      getPosts();
    } catch (error) {
      console.log(error);
    }

    setEditing(!editing);
  };

  const growTextArea = (element) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  return (
    <PostWrapper>
      {user_name === user.name && (
        <div className="icons">
          <BsFillPencilFill
            onClick={() => {
              setEditing(!editing);
            }}
            size={15}
            fill={'#FFFFFF'}
          />
          <BsFillTrashFill size={15} fill={'#FFFFFF'} />
        </div>
      )}
      <img src={icon} alt="icon" />
      <div className="col">
        <div className="content">
          <span className="user">{user_name}</span>
        </div>
        {editing ? (
          <textarea
            ref={textAreaRef}
            style={
              textAreaRef.current
                ? { height: textAreaRef.current.scrollHeight }
                : { height: '30px' }
            }
            onFocus={(e) => {
              growTextArea(e.target);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleEdit();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setEditing(false);
              }
            }}
            value={descriptionEdit}
            onChange={(e) => setDescriptionEdit(e.target.value)}
          />
        ) : (
          <div className="descriptionContainer">
            <ReactHashtag
              renderHashtag={(hashtagValue) => (
                <div
                  key={hashtagValue + (Math.random() * 100).toString()}
                  className="hashtag"
                >
                  {hashtagValue}
                </div>
              )}
            >
              {description}
            </ReactHashtag>
          </div>
        )}
        <div className="likeIcon">
          <Likes
            tooltipText={tooltipText}
            liked={liked}
            like_count={like_count}
            post_id={post_id}
          />
        </div>
        <MainLink>
          <a href={url} target="_blank" rel="noreferrer">
            <div className="texts">
              <p>{title_url}</p>
              <span>{description_url}</span>
              <span className="url">{url}</span>
            </div>
            <img src={image_url} className="image-url" alt="icon" />
          </a>
        </MainLink>
      </div>
    </PostWrapper>
  );
};

export default Post;
