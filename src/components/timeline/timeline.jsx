import Header from '../header/header';
import Publish from '../publish/topublish';
import Posts from '../posts/posts';
import { Main, MainWrapper, TrendingWrapper, ContentWrapper } from './style';
import Trending from '../Trending/Trending';

export default function Timeline(props) {
  const {text} = props;
  return (
    <>
      <Header />
      <Main>
        <MainWrapper >
          <h1>{text}</h1>
          <TrendingWrapper >
            <ContentWrapper >
              <Publish />
              <Posts />
            </ContentWrapper>
            <Trending />
          </TrendingWrapper>
        </MainWrapper>
      </Main>
    </>
  );
}
