import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Header from "../header/header";
import Posts from "../posts/posts";
import UserContext from "../../contexts/usercontext";
import { ContentWrapper, Main, MainWrapper, TrendingWrapper } from "../timeline/style";
import { Follow, Unfollow } from "./style";
import Trending from "../Trending/Trending";
import 'dotenv/config';

export default function UserPage() {
    const {id} = useParams();
    const [name,setName] = useState('');
    const [image,setImg] = useState('');
    const [following, setFollowing] = useState(false);
    const [isLoadingFollow, setIsLoadingFollow] = useState(false);
    const { token } = useContext(UserContext);
     const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    useEffect(()=> {
      const promise = axios.get(process.env.REACT_APP_API_URL+'/user/'+id, config);
      promise.then(response => {
        const user = response.data[0];
        setName(user.user_name)
        setImg(user.url)
        const userIsFollowing = parseInt(user.is_following);
        setFollowing(!!userIsFollowing);
      })
    })
    
    function insertFollow(){
      
      const promise = axios.post(process.env.REACT_APP_API_URL + '/follows/' + id, {}, config);
        promise.then((response) => {
        setFollowing(true); //true
        console.log("sucesso ao seguir", !following);
      })

      promise.catch((error) => {
        setIsLoadingFollow(false);
        console.log('erro ao seguir', error);
        alert("Não foi possível executar a operação");
      })
    }

    function removeFollow(){ 
      const promise = axios.delete(process.env.REACT_APP_API_URL + '/follows/' + id, config);
      promise.then((response) => {
        setFollowing(false); //false
        console.log("sucesso ao parar de seguir", !following);
      })

      promise.catch((error) => {
        setIsLoadingFollow(false);
        console.log('erro ao deixar de seguir', config);
        alert("Não foi possível executar a operação");
      })
    }

    return (
      <>
      <Header />
      <Main>
        <MainWrapper>
          <div className="user-timeline">
          <h1> <img src={image} alt={`${name} profile.`}/> {`${name}'s timeline`}</h1>
          {following ? <Unfollow disabled={isLoadingFollow} onClick={removeFollow}>Unfollow</Unfollow> :
          <Follow disabled={isLoadingFollow} onClick={insertFollow}>Follow</Follow> }
          </div>
          <TrendingWrapper>
            <ContentWrapper>
              <Posts url={`/users/${id}`} />
            </ContentWrapper>
            <Trending />
          </TrendingWrapper>
        </MainWrapper>
      </Main>
      </>
    )
}

