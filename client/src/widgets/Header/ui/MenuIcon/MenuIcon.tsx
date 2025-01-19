import { useNavBarStore } from '@/shared/model/NavBarStore'
import styles from './MenuIcon.module.scss'
import menuIcon from './menu.svg'

export const MenuIcon = () => {

  const { isMenuOpen, setIsMenuOpen } = useNavBarStore()

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className={styles.MenuIcon} onClick={handleClick}>
      <img src={menuIcon} alt="menu" />
    </div>
  )
}
