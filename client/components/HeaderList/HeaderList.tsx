import { FC, memo } from "react";
import styles from './HeaderList.module.css'
import MainInput from "@/UI/MainInput/MainInput";
import Btn from "@/UI/Btn/Btn";
import DropDownMenu from "@/UI/DropdownMenu/DropDownMenu";
import { useRouter } from "next/router";

interface HeaderListProps{
    placeholder:string;
    routerPath: string
}

const HeaderList:FC<HeaderListProps> = memo(({placeholder, routerPath}) => {
    const router = useRouter()
    return (
        <>
            <div className={styles.container}>
                <div className={styles.input_container}>
                    <MainInput placeholder={placeholder}/>
                </div>
            </div>
            <div className={styles.btn_container}>
                <Btn 
                    onClick={()=> router.push(routerPath)}>
                    Загрузить
                </Btn>
                
                <DropDownMenu/>
                    
            </div>
        </>
    )
})

export default HeaderList