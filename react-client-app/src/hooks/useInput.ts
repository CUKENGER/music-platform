import { ChangeEvent, useState } from "react"
import useValidation, { validTerms } from "./useValidation"


export const useInput = (initialValue:string, validations: validTerms) => {
    const [value, setValue] = useState(initialValue)
    const [isDirty, setIsDirty] = useState(false)
    const valid = useValidation(value, validations)

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(e.target.value)
    }

    const onBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsDirty(true)
    }

    return {
        value, 
        onChange, 
        setValue, 
        onBlur,
        isDirty,
        ...valid
    }
}