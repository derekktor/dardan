import { useSelector } from "react-redux";
import { selectUserIds } from "./usersSlice";
import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "./usersSlice";
import UserExcerpt from "./UserExcerpt";

const UsersList = () => {
  const navigate = useNavigate();
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();


  const userIds = useSelector(selectUserIds)

  let content;
  if (isLoading) {
    content = <h3>Уншиж байна...</h3>;
  } else if (isSuccess) {
    content = userIds.map((userId) => (
      <UserExcerpt key={userId} userId={userId} />
    ));
  } else if (isError) {
    content = <h3>{error}</h3>;
  }

  return (
    <>
      <h2>Хэрэглэгчид</h2>
      <div>{content}</div>
    </>
  );;
};

export default UsersList;
