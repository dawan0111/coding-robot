import styled from "styled-components"

export const Modal = styled.div<{ visible: boolean }>`
  display: ${props => props.visible ? "flex" : "none"};
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1001;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, .5);
`

export const ModalPopup = styled.div`
  border-radius: 1rem;
  background: #fff;
`