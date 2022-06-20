import React, { useState, useContext, useRef, useEffect } from 'react';
import { MainLink, PostWrapper, ModalStyle, OverlayStyle } from './style';
import ReactHashtag from 'react-hashtag';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Likes from '../posts/likes.jsx';
import UserContext from '../../contexts/usercontext';

import Modal from 'react-modal';
Modal.setAppElement('#root');

const Post = ({ publishing, getPosts }) => {
  const { user, token } = useContext(UserContext);
  const textAreaRef = useRef();

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }

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
      setLoading(true);
      const response = await axios.patch(URL, data, config);
      console.log(response.data);
      setLoading(false);
      getPosts();
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
    setEditing(!editing);
  };

  const openEditor = () => {
    setEditing(!editing);
  };

  const growTextArea = (element) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (editing) {
      growTextArea(textAreaRef.current);
      textAreaRef.current.focus();
    }
  }, [editing]);

  return (
    <PostWrapper>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Delete Modal"
        className="_"
        overlayClassName="_"
        contentElement={(props, children) => (
          <ModalStyle {...props}>{children}</ModalStyle>
        )}
        overlayElement={(props, contentElement) => (
          <OverlayStyle {...props}>{contentElement}</OverlayStyle>
        )}
      >
        <h1>Are you sure you want to delete this post?</h1>
        <div className="buttons">
          <button className="white" onClick={closeModal}>
            No, go back
          </button>
          <button
            className="blue"
            onClick={() => {
              closeModal();
            }}
          >
            Yes, delete it
          </button>
        </div>
      </Modal>
      {user_name === user.name && (
        <div className="icons">
          <BsFillPencilFill onClick={openEditor} size={15} fill={'#FFFFFF'} />
          <BsFillTrashFill
            onClick={() => {
              openModal();
            }}
            size={15}
            fill={'#FFFFFF'}
          />
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
              e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length,
              );
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
            disabled={loading}
          />
        ) : (
          <div className="descriptionContainer">
            <ReactHashtag
              renderHashtag={(hashtagValue) => (
                <div
                  key={hashtagValue + (Math.random() * 100).toString()}
                  className="hashtag"
                  onClick={() => {
                    const hashtagArr = hashtagValue.split('#');
                    const hashtagText = hashtagArr[hashtagArr.length - 1];
                    navigate(`/hashtag/${hashtagText}`);
                  }}
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
