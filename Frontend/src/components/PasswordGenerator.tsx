import { useEffect, useState } from 'react'
import Slider from '@mui/material/Slider';
import { Checkbox, FormControlLabel } from '@mui/material';

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const digits = '0123456789'
const specialChars = '!@#$%^&*()_+/\|?<>;:{}[]'

interface PasswordGeneratorProps {
  setPassword: (password: string) => void
  password: string
}

const PasswordGenerator = ({ password, setPassword }: PasswordGeneratorProps) => {
  const [length, setLength] = useState<number>(12)
  const [digitsFlag, setDigitsFlag] = useState<boolean>(true)
  const [specialCharsFlag, setSpecialCharsFlag] = useState<boolean>(true)

  const shuffleString = (str: string) => {
    return str.split('').sort(() => Math.random() - 0.5).join('')
  }

  const generatePassword = () => {
    let password = ''

    let charset = alphabet

    if (digitsFlag) {
      charset += digits
      password += digits[Math.floor(Math.random() * digits.length)]
    }

    if (specialCharsFlag) {
      charset += specialChars
      password += specialChars[Math.floor(Math.random() * specialChars.length)]
    }

    for (let i = 0; i < length - 2; i++) {
      password += charset[Math.floor(Math.random() * charset.length)]
    }

    setPassword(shuffleString(password))
  }

  useEffect(() => {
    generatePassword()
  }, [length, digitsFlag, specialCharsFlag])

  return (
    <div style={{ width: "1000px" }}>
      <h2>Password Generator</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: "20px" }}>
        <div style={{ width: "50%", display: "flex", alignItems: 'center', textWrap: 'nowrap', gap: "1rem" }}>
          <FormControlLabel
            sx={{ width: "100%", gap: "1rem" }}
            control={
              <Slider
                name='lengthSlider'
                aria-label="Restricted values"
                min={8}
                max={50}
                defaultValue={16}
                valueLabelDisplay="on"
                value={length}
                color='secondary'
                onChange={(e, value) => setLength(value as number)}
              />}
            label="Length:"
            labelPlacement='start'

          />
        </div>
        <div style={{ width: "50%" }}>
          <div>
            <FormControlLabel
              sx={{ gap: "1rem" }}
              control={<Checkbox defaultChecked value={digitsFlag} onChange={(e) => setDigitsFlag(e.target.checked)} color="secondary" />}
              label="Digits:"
              labelPlacement='start'
            />
          </div>
          <div>
            <FormControlLabel
              sx={{ gap: "1rem" }}
              control={<Checkbox defaultChecked value={specialCharsFlag} onChange={(e) => setSpecialCharsFlag(e.target.checked)} color="secondary" />}
              label="Special Characters:"
              labelPlacement='start'
            />
          </div>
        </div>
      </div>
      <button onClick={generatePassword} style={{ marginTop: "1rem" }}>Generate Password</button>
      {password && <p>Password: <strong>{password}</strong></p>}
    </div>
  )
}

export default PasswordGenerator