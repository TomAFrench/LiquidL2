import styled from "styled-components";

export const Header = styled.header`
  background-color: #282c34;
  min-height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  color: white;
`;

export const Body = styled.body`
  align-items: center;
  background-color: #282c34;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  min-height: calc(100vh - 70px);
`;

export const Image = styled.img`
  height: 4vmin;
  margin-bottom: 16px;
  pointer-events: none;
`;

export const Link = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  color: #61dafb;
  margin-top: 10px;
`;

export const Button = styled.button`
  background-color: white;
  border: none;
  border-radius: 8px;
  color: #282c34;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  margin: 0px 20px;
  padding: 12px 24px;

  ${(props: { hidden?: boolean }): string | undefined => (props.hidden ? "hidden" : undefined)}

  &:focus {
    border: none;
    outline: none;
  }
`;

export const Border = styled.div`
  border: solid;
  border-color: white;
  border-radius: 8px;
  border-width: 2px;
  font-size: 16px;
  margin: 0px 20px;
  padding: 12px 24px;
`;
