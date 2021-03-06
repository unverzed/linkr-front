import styled from "styled-components";

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #333333;
  width: 100%;
  min-height: 100%;

  h1 {
    font-family: "Oswald", Arial;
    color: #ffffff;
    font-weight: 700;
    font-size: 43px;
    line-height: 64px;
    padding-top: 78px;
    margin-bottom: 43px;
    img {
      position: relative;
      top: 10px;
      border-radius: 70%;
      height: 60px;
      width: 60px;
      margin-right: 20px;
    }
  }

  .loading {
    display: flex;
    justify-content: center;
  }

  @media (max-width: 500px) {
    h1 {
      font-size: 33px;
    }
  }
`;

export const MainWrapper = styled.div`
  width: 100%;
  max-width: 940px;
  margin: auto;

  @media (max-width: 400px) {
    overflow-x: hidden;
    width: 100%;
  }

  .user-timeline {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const TrendingWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const ContentWrapper = styled.div`
  width: 66%;
  display: flex;
  flex-direction: column;

  @media (max-width: 500px) {
    width: 100%;
  }
`;
