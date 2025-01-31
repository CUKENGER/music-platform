import { useGetUserById } from "@/entities/user";
import { Loader } from "@/shared/ui";
import { useParams } from "react-router-dom";

export const Profile = () => {

  const { id } = useParams()
  const { data: user, isLoading } = useGetUserById(Number(id))

  if(isLoading) {
    return <Loader/>
  }

  return (
  <div>
    <h1>{user?.username}</h1>
    <p>{user?.email}</p>
  </div>
  )
};
