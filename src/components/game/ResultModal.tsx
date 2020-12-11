import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'
import GameContext from '../../contexts/GameContext'
import { Modal, ModalPopup } from '../../style'
import { rankingT } from '../../types/ranking'

const Wrapper = styled.div`
  width: 40vw;
  max-height: 80vh;
  overflow: auto;
  padding: 1rem;
`

const Title = styled.div<{ success: boolean }>`
  margin-bottom: 1rem;

  font-size: 2rem;
  font-weight: bold;
  text-align: center;

  color: ${props => props.success ? "#05adff" : "#ff6160"} ;

  p {
    font-size: 40%;
    font-weight: normal;
    color: #666;
  }
`

const ScoreWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;

  border-radius: .5rem;
  background: #ededed;
  font-size: 2.5rem;
  text-align: center;
`

const RankingWrapper = styled.div`
  width: 100%;
  margin-bottom: 1rem;

  border-radius: .5rem;
  background: #ededed;
  overflow: hidden;
`

const RankingList = styled.div`
  width: 100%;
  height: 20vh;
  overflow: auto;
  padding: .5rem 1rem;

  & .ranking-item:nth-child(1) .rank {
    color: #f5d600;
  }
  & .ranking-item:nth-child(2) .rank {
    color: #d3d3d3;
  }
  & .ranking-item:nth-child(3) .rank {
    color: #d75e1f;
  }
`

const RankingItem = styled.div`
  display: flex;
  justify-content: space-between;

  padding: .5rem 0;

  .rank {
    font-weight: bold;
  }
`

const RankingForm = styled.form`
  width: 100%;
  height: 2rem;
`

const RankingInput = styled.input`
  width: 60%;
  height: 100%;

  padding: 0 1rem;

  border: none;
  background: #ddd;
`

const RankingButton = styled.button`
  width: 40%;
  height: 100%;

  background: #00c55a;
  color: #fff;
  border: none;
`

const ActionButton = styled.button`
  width: 100%;
  border: none;
  background: none;

  padding: .5rem 0;

  border-radius: .5rem;

  background: #00c55a;
  color: #fff;
  font-size: 1.4rem;
`

export default function ResultModal() {
  const [name, setName] = React.useState("")
  const [rankingAdd, setRankingAdd] = React.useState(false)
  const { score, map, resultVisible, ranking, updateResultVisible, putMap, addRanking } = React.useContext(GameContext)

  const isSuccess = map.filter(x => x === "carrot").length === 0;
  const mapRanking: Array<rankingT> = _.orderBy(ranking[localStorage.getItem("map") || ""] || [], ['score'], ['desc'])

  return (
    <Modal visible={resultVisible}>
      <ModalPopup>
        <Wrapper>
          <Title success={isSuccess}>
            {
              isSuccess ? (
                <>
                  성공!
                  <p>냠냠~ 모두 다 먹었어요!</p>
                </>
              ) : (
                <>
                  실패
                  <p>아직 당근이 남아있어요 쩝...</p>
                </>
              )
            }
          </Title>
          <ScoreWrapper>{isSuccess ? score : 0} 점</ScoreWrapper>
          {
            isSuccess && (
              <RankingWrapper>
                <RankingList>
                  {
                    mapRanking.map((rank, index) => (
                      <RankingItem key={index} className="ranking-item">
                        <div><span className="rank">{index + 1}위</span> {rank.name}</div>
                        <span>{rank.score}점</span>
                      </RankingItem>
                    ))
                  }
                </RankingList>
                <RankingForm onSubmit={(e) => {
                  e.preventDefault();

                  if (name === "") {
                    alert("이름을 입력해주세요.")
                  } else {
                    addRanking(name)
                    setName("")
                    setRankingAdd(true)
                  }
                }}>
                  <RankingInput
                    value={name}
                    readOnly={rankingAdd}
                    onChange={(e) => {
                      setName(e.target.value)
                    }}
                    placeholder="이름을 입력해주세요."
                  />
                  <RankingButton disabled={rankingAdd}>등록</RankingButton>
                </RankingForm>
              </RankingWrapper>
            )
          }
          <ActionButton onClick={() => {
            setRankingAdd(false)
            updateResultVisible(false)
            putMap(JSON.parse(localStorage.getItem("map") || "[]"));
          }}>확인</ActionButton>
        </Wrapper>
      </ModalPopup>
    </Modal>
  )
}