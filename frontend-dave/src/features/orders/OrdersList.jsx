import { useGetOrdersQuery } from "./ordersApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import OrderExcerpt from "./OrderExcerpt";
import useAuth from "../../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { Calendar } from "react-date-range";
import format from "date-fns/format";
import { FaCalendarAlt, FaQuestionCircle } from "react-icons/fa";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useResolvedPath } from "react-router-dom";

const DATE_REGEX =
  /^((0[1-9]|1[0-2])|([1-9]|1[0-2]))\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

const OrdersList = () => {
  const { name, userId, isAdmin } = useAuth();

  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const refOne = useRef(null);
  const refHint = useRef(null);

  const fetchOptions = {
    // refetch user data every 2m
    pollingInterval: 120000,
    // when focus on another window and return, refetch user data
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  };

  const { data: users } = useGetUsersQuery();

  const {
    data: orders,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetOrdersQuery("ordersList", fetchOptions);

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  let content;
  if (isLoading) {
    content = <h3>Loading...</h3>;
  } else if (isSuccess) {
    const { ids, entities } = orders ? orders : { ids: [] };

    let filteredIds;
    if (isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(
        (orderId) => entities[orderId].created_by === userId
      );
    }

    content =
      filteredIds?.length &&
      filteredIds
        .filter((id) => {
          if (searchValue === "") {
            return id;
          } else if (searchValue.startsWith("/")) {
            const userName = searchValue.substring(1);
            let filteredUserId = users.ids.filter(
              (id) => users.entities[id].name === userName
            );
            return orders.entities[id].created_by.includes(filteredUserId[0]);
          } else if (searchValue.startsWith("-")) {
            const loadName = searchValue.substring(1);
            return orders.entities[id].load_name.includes(loadName);
          } else if (searchValue.startsWith(">")) {
            const date = searchValue.substring(1);

            if (DATE_REGEX.test(date)) {
              const d = new Date(date);
              return new Date(orders.entities[id].date_entered) > d;
            }
          } else if (searchValue.startsWith("<")) {
            const date = searchValue.substring(1);

            if (DATE_REGEX.test(date)) {
              const d = new Date(date);
              return new Date(orders.entities[id].date_entered) < d;
            }
          } else {
            return orders.entities[id].truck_id_digits.includes(searchValue);
          }
        })
        .map((orderId) => <OrderExcerpt key={orderId} orderId={orderId} />);
  } else if (isError) {
    content = <h3>{error?.data?.message}</h3>;
  }

  const handleKeyChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleDateSelect = (date) => {
    if (searchValue.startsWith(">")) {
      setSearchValue(`>${format(date, "MM/dd/yyyy")}`);
    } else if (searchValue.startsWith("<")) {
      setSearchValue(`<${format(date, "MM/dd/yyyy")}`);
    } else if (searchValue === "") {
      setSearchValue(`>${format(date, "MM/dd/yyyy")}`);
    }
  };

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      setHintVisible(false);
    }
  };

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }

    if (refHint.current && !refHint.current.contains(e.target)) {
      setHintVisible(false);
    }
  };
  return (
    <>
      {hintVisible && (
        <div id="hintDisplay" className="">
          <div ref={refHint}>
            <h3>Тусламж</h3>
            <div>
              <h4>
                <i>1234</i>
              </h4>
              <p>1234 гэсэг арлын дугаартай бүртгэлийг гаргаж ирэх</p>
            </div>
            <div>
              <h4>
                <i>&gt;12/31/2022</i>
              </h4>
              <p>12/31/2022-оос хойш хийгдсэн бүртгэлүүдийг харах</p>
            </div>
            <div>
              <h4>
                <i>&lt;12/31/2022</i>
              </h4>
              <p>12/31/2022-оос өмнө хийгдсэн бүртгэлүүдийг харах</p>
            </div>
            <div>
              <h4>
                <i>-төмөр</i>
              </h4>
              <p>төмөр гэсэн ачаатай бүртгэлүүдийг харах</p>
            </div>
            {isAdmin && (
              <div>
                <h4>
                  <i>/bataa</i>
                </h4>
                <p>bataa хэрэглэгчийн бүртгэсэн бүртгэлүүдийг харах</p>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex-col">
        <h1>Бүртгэлүүд</h1>
        <div className="flex-row align-center space-evenly gap10 mb">
          <input
            className="round-border"
            type="text"
            value={searchValue}
            onChange={handleKeyChange}
            style={{ flex: 3 }}
          />
          <div style={{ flex: 1 }}>
            <span
              style={{ marginRight: "10px", cursor: "pointer" }}
              onClick={() => setOpen((open) => !open)}
            >
              <FaCalendarAlt />
            </span>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setHintVisible((hintVisible) => !hintVisible)}
            >
              <FaQuestionCircle />
            </span>
          </div>
        </div>
        <div ref={refOne}>
          {open && (
            <Calendar
              className="calendarElement"
              date={new Date()}
              onChange={handleDateSelect}
            />
          )}
        </div>
        <div className="orders-grid">
          <div className="">
            <h4>Арлын дугаар</h4>
            <h4>Орсон огноо</h4>
            <h4>Барааны нэр</h4>
            <h4>Buttons</h4>
          </div>
          {content}
        </div>
      </div>
    </>
  );
};

export default OrdersList;
