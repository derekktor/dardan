import { useNavigate, useParams } from "react-router-dom";
import { useDeleteUserMutation, useGetUsersQuery } from "./usersApiSlice";
import { useGetOrdersQuery } from "../orders/ordersApiSlice";
import { memo } from "react";
import OrderExcerpt from "../orders/OrderExcerpt";

const SingleUser = () => {
  const navigate = useNavigate();
  const [deleteUser] = useDeleteUserMutation();

  const { userId } = useParams();
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  const fetchOptions = {
    // refetch user data every 2m
    pollingInterval: 120000,
    // when focus on another window and return, refetch user data
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  };

  const {
    data: orders,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetOrdersQuery("ordersList", fetchOptions);

  const handleDelete = async () => {
    try {
      await deleteUser(userId).unwrap();
      navigate("/dash/users");
    } catch (error) {
      console.error("Хэрэглэгчийн мэдээллийг устгаж чадсангүй", error);
    }
  };

  const { ids, entities } = orders ? orders : { ids: [], entities: null };
  const orderIds = ids.filter(
    (orderId) => entities[orderId].created_by === user.id
  );
  let content = orderIds.map((orderId) => (
    <OrderExcerpt key={orderId} orderId={orderId} />
  ));

  const handleEdit = (userId) => {
    navigate(`/dash/users/edit/${userId}`);
  };

  if (user) {
    return (
      <div>
        <div className="flex-col space-evenly">
          <div className="flex-row align-center gap10">
            <h3>Хэрэглэгчийн нэр:</h3>
            <h2>{user.name}</h2>
          </div>
          <p>Эрх:</p>
          <h4>{user.roles}</h4>
        </div>
        {/*  <p>Үүсгэсэн: {user.createdAt}</p>
         <p>Шинэчилсэн: {user.updatedAt}</p> */}
        <div className="buttons">
          <button onClick={() => handleEdit(userId)}>Өөрчлөх</button>
          <button onClick={() => handleDelete(userId)}>Устгах</button>
        </div>
        {orderIds.length !== 0 && (
          <div className="orders-grid m align-center">
            <h4>Арлын дугаар</h4>
            <h4>Орсон огноо</h4>
            <h4>Барааны нэр</h4>
            <h4>Buttons</h4>
            {content}
          </div>
        )}
      </div>
    );
  } else return null;
};

const memoizedUser = memo(SingleUser);
export default memoizedUser;
