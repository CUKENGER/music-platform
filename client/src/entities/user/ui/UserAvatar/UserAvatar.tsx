import { FC } from 'react';
import styles from './UserAvatar.module.scss'
import { useGetByEmail } from '../../api/useUserApi';
import { useUserStore } from '../../model/userStore';

interface UserAvatarProps {
}

const UserAvatar: FC<UserAvatarProps> = () => {

  const token = localStorage.getItem('token')

  // const {data: userData, isLoading} = useGetByEmail(user?.email ?? "")

  // console.log('userData', userData)

  // if (isLoading) {
    // return <p>...LOadibng</p>
  // }

  return (

    <div className={styles.user_container}>
      <div className={styles.user_avatar}>
      </div>
      <div className={styles.name_container}>
        {/* <p>{userData?.username} член {userData?.email} {userData?.id}</p> */}
      </div>
    </div>

  );
}

export default UserAvatar;
