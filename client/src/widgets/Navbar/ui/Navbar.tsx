import { NavTo } from '@/features';
import styles from './Navbar.module.scss';
import UserAvatar from '@/entities/user/ui/UserAvatar/UserAvatar';
import { Btn, ModalContainer, useModal } from '@/shared';
import { useLogoutUser } from '@/entities/user/api/useUserApi';
import { useUserStore } from '@/entities';
import { useNavigate } from 'react-router-dom';
import { PublicRoutes } from '@/shared/consts/routes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAll, refreshToken } from '@/entities/user/api/userApi';

const Navbar = () => {
  const { mutate: logout } = useLogoutUser();

  const {showModal, hideModal, modal} = useModal()

  const {mutate: getUsers, error: userError} = useMutation({mutationFn: getAll})

  const {data: tokenResult, error: tokenError} = useQuery({queryFn: refreshToken, queryKey: ['auth']})

  console.log('getAll error', userError)
  console.log('token error', tokenError)

  console.log('token.result', tokenResult)

  const { setIsAuth } = useUserStore();
  const navigate = useNavigate();

  const handleClick = () => {
    // Вызов функции logout для выполнения запроса на выход
    logout(undefined, {
      onSuccess: () => {
        // Успешный logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setIsAuth(false);
        navigate(PublicRoutes.LOGIN); // Перенаправление на страницу входа
      },
      onError: (error) => {
        console.error('Ошибка при выходе:', error);
        showModal(`Произошла ошибка ${error}`)
        // Здесь вы можете обработать ошибку, например, показать уведомление
      },
    });
  };

  return (
    <div className={styles.container}>
      <UserAvatar />
      <NavTo />
      <Btn onClick={handleClick}>
        Выйти
      </Btn>
      {modal.isOpen && (
        <ModalContainer
          hideModal={hideModal}
          text={modal.message}
          onClick={modal.onClick}
        />
      )}
      <Btn onClick={() => getUsers}>
        Get All
      </Btn>


      <Btn onClick={() => getUsers}>
        refresh
      </Btn>
    </div>
  );
}

export default Navbar;
