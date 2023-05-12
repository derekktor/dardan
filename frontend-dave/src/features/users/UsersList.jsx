import { useGetUsersQuery } from "./usersApiSlice";
import UserExcerpt from "./UserExcerpt";

const UsersList = () => {
  const fetchOptions = {
    // refetch user data every 4min
    pollingInterval: 240000,
    // when focus on another window and return, refetch user data
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  }

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", fetchOptions);

  const { ids } = users ? users : { ids: [] };
  // const ids = useSelector(selectUserIds)

  let content;
  if (isLoading) {
    content = <h3>Уншиж байна...</h3>;
  } else if (isSuccess) {
    content = ids.map((userId) => <UserExcerpt key={userId} userId={userId} />);
  } else if (isError) {
    content = <h3>{error?.data?.message}</h3>;
  }

  return (
    <>
      <h2>Хэрэглэгчид</h2>
      <div className="users-grid m align-center">
        <h4>Нэр</h4>
        <h4>Статус</h4>
        <h4>Buttons</h4>
        {content}
      </div>
    </>
  );
};

export default UsersList;
