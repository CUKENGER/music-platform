import MainLayout from '@/layouts/MainLayout';
import { menuItems } from '@/services/menuItems';
import styles from '@/styles/index.module.css'
import { useRouter } from 'next/router';

const Index = () => {

    const router = useRouter()
    
    return (
        <MainLayout title_text='Главная'>
            
            <div className={styles.general_container}>
                <div className={styles.container}>
                    <h1 className={styles.title }>Welcome</h1>
                </div>
                <div className={styles.navBar}>
                    {menuItems.map((link, index) => (
                        <div key={index} className={styles.navBar_item} onClick={() => router.push(link.href)}>
                            <p  className={styles.link_text}>{link.text}</p>
                        </div>
                    ))}
                    
                </div>
            </div>
            
        </MainLayout>
    )
}


export default Index;