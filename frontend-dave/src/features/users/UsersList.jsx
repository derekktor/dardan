import { useGetUsersQuery } from "./usersApiSlice"
import User from "./User";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery();

  let content;

  // if loading, show loading
  if (isLoading) content = <p>Loading...</p>

  // if error, show errors
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  // if success, 
  if (isSuccess) {
    // array of user ids
    const { ids } = users

    const tableContent = ids?.length
        ? ids.map(userId => <User key={userId} userId={userId} />)
        : null

    content = (
        <table className="table table--users">
            <thead className="table__thead">
                <tr>
                    <th scope="col" className="table__th user__username">Username</th>
                    <th scope="col" className="table__th user__roles">Roles</th>
                    <th scope="col" className="table__th user__edit">Edit</th>
                </tr>
            </thead>
            <tbody>
                {tableContent}
            </tbody>
        </table>
    )
}

  return (
    <h1>UsersList</h1>
  )
}

export default UsersList