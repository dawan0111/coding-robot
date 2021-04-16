import styled from 'styled-components'
import useBluetooth from '../../hooks/useBluetooth'

const Button = styled.button<{ connect: boolean }>`
  border: none;
  background: none;

  color: ${props => props.connect ? "#0983fe" : "#000"};
  opacity: ${props => props.connect ? 1 : 0.2};

  &:focus {
    outline: none;
  }
`

export default function BluetoothButton() {
  const { bluetoothConnect, setBluetoothDevice } = useBluetooth()
  return (
    <Button connect={bluetoothConnect} onClick={() => setBluetoothDevice()}>
      <span className="material-icons">bluetooth</span>
    </Button>
  )
}