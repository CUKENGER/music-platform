import { FC,ReactNode } from "react"
import styles from './StepWrapper.module.css'

interface StepWrapperProps {
    activeStep?: number;
    children?: ReactNode;
    setActiveStep: (step: number)=>void;
    nameInput?: string;
    artistInput?: string;
}

const StepWrapper:FC<StepWrapperProps> = ({activeStep, children, setActiveStep, nameInput, artistInput}) => {


    const handleChangeStep = (step:number) => {
        if (nameInput && artistInput) {
            if (nameInput.trim() !== '' && artistInput.trim() !== '') {
                setActiveStep(step)
            }
        }
    }

    return (
        <> 
            <div className={styles.steper}>
            
                <div className={activeStep == 1 ? styles.step : styles.step_inactive} onClick={() => handleChangeStep(1)}>
                    <p className={activeStep == 1 ? styles.step_name_active : styles.step__name}>1</p>
                </div>

                <div className={activeStep == 2 ? styles.step : styles.step_inactive}  onClick={()=> handleChangeStep(2)}>
                    <p className={activeStep == 2 ? styles.step_name_active : styles.step__name}>2</p>
                </div>

                <div className={activeStep == 3 ? styles.step : styles.step_inactive}  onClick={()=> handleChangeStep(3)}>
                    <p className={activeStep == 3 ? styles.step_name_active : styles.step__name}>3</p>
                </div>
               
                
            </div>
            
            {children}
            
        </>
    )
}

export default StepWrapper