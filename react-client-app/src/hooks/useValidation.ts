import { useEffect, useState } from "react"

export interface validTerms{
  isEmpty:boolean
}

const useValidation = (value: string, validations: validTerms) => {

  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    for (const validation in validations) {
      switch(validation) {
        case 'isEmpty':
          value.trim() ? setIsEmpty(false) : setIsEmpty(true)
          break
      }
    }
  }, [value])

  return {
    isEmpty
  }
}

export default useValidation