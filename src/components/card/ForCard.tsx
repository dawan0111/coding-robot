import styled from 'styled-components'
import forStartImg from '../../images/for-start.png'
import forEndImg from '../../images/for-end.png'
import { SortCardList } from './CardList'

const ForWrapper = styled.div`
  position: relative;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const ForStack = styled.div`
  position: relative;
  z-index: 1000;
  min-width: 2.45rem;
  height: 100%;
  border-top: .25rem solid #ce81fe; 
`

const ForRangeInput = styled.input`
  position: absolute;
  z-index: 101;
  right: .45rem;
  bottom: 5%;

  width: 1.2rem;
  height: .5rem;
  background: #fff;
  border: none;
  border-radius: 300px;
  text-align: center;
  font-size: 0.5rem;

  &:focus {
    outline: none;
  }
`

type Props = {
  cardIndex?: number
  temp: boolean
}

export default function ForCard({ cardIndex, temp }: Props) {

  return (
    <ForWrapper>
      <img src={forStartImg} alt="for문 시작"/>
      <ForStack className="forStack">
        {(cardIndex !== -1 && !temp) && (
          <SortCardList
            parent={cardIndex}
          />
        )}
      </ForStack>
      <img src={forEndImg} alt="for문 끝"/>
      <ForRangeInput defaultValue="2" id={`for-${cardIndex}`} />
    </ForWrapper>
  )
}