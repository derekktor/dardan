import { useGetOrdersQuery } from "../orders/ordersApiSlice";
import ReportExcerpt from "./ReportExcerpt";
import { formatCurrency } from "../orders/SingleOrder";

const ReportList = ({ orderIds, orderIdsPrev }) => {
  const { data: orders } = useGetOrdersQuery();

  let orderIdsEntered;
  let orderIdsPrevLeft;
  let orderIdsLeft;
  let ordersData;
  let stats = {
    totalRevenue: 0,
    totalRevenuePrev: 0,
    totalWeight: 0,
    totalAmt302: 0,
    totalAmt601: 0,
    totalAmtWNoat: 0,
    totalAmtWoNoat: 0,
    tavtsan: {
      gadna: 0,
      aguulah: 0,
    },
    puulelt: {
      suudliin: 0,
      busad: 0,
    },
    forklift: {
      neg: 0,
      hours: 0,
    },
    crane: {
      hooson: 0,
      achaatai: 0,
    },
  };

  if (orderIdsPrev) {
    orderIdsPrevLeft = orderIdsPrev.filter((id) => {
      return orders.entities[id].stage === 1;
    });

    orderIdsPrevLeft.forEach(id => {
      const thisOrder = orders.entities[id]; 

      if (thisOrder.invoice_to_302) {
        stats.totalRevenuePrev += thisOrder.invoice_to_302;
      }

      if (thisOrder.invoice_to_601) {
        stats.totalRevenuePrev += thisOrder.invoice_to_601;
      }
    })
  }

  if (orderIds) {
    orderIds.sort((a, b) => {
      const dateA = new Date(orders.entities[a].date_entered);
      const dateB = new Date(orders.entities[b].date_entered);
      return dateA - dateB;
    });

    orderIdsEntered = orderIds.filter((id) => {
      return orders.entities[id].stage === 1 || orders.entities[id].stage === 0;
    });

    orderIdsLeft = orderIds.filter((id) => {
      return orders.entities[id].stage === 1;
    });

    if (orderIds.length === 0) {
      ordersData = <h4>Ямар ч бүртгэл байхгүй байна!</h4>;
    }

    orderIdsEntered.forEach((id) => {
      const thisOrder = orders.entities[id];

      if (thisOrder.tavtsan_usage === "aguulah_tavtsan") {
        stats.tavtsan.aguulah += 1;
      } else if (thisOrder.tavtsan_usage === "gadna_tavtsan") {
        stats.tavtsan.gadna += 1;
      }

      if (thisOrder.puulelt === 1) {
        stats.puulelt.suudliin += 1;
      } else if (thisOrder.puulelt === 2) {
        stats.puulelt.busad += 1;
      }

      if (
        thisOrder.forklift_usage === "neg" ||
        thisOrder.forklift_usage === "нэг"
      ) {
        stats.forklift.neg += 1;
      } else if (parseInt(thisOrder.forklift_usage)) {
        stats.forklift.hours += parseInt(thisOrder.forklift_usage);
      }

      if (thisOrder.crane_usage === 1) {
        stats.crane.hooson += 1;
      } else if (thisOrder.crane_usage === 2) {
        stats.crane.achaatai += 1;
      }

      stats.totalWeight += thisOrder.load_weight;
    });


    orderIdsLeft.forEach((id) => {
      const thisOrder = orders.entities[id];
      if (!thisOrder.invoice_to_302) {
        stats.totalAmt302 += 0;
      } else {
        stats.totalAmt302 += thisOrder.invoice_to_302;
        stats.totalRevenue += thisOrder.invoice_to_302;
      }

      if (!thisOrder.invoice_to_601) {
        stats.totalAmt302 += 0;
      } else {
        stats.totalAmt601 += thisOrder.invoice_to_601;
        stats.totalRevenue += thisOrder.invoice_to_601;
      }

      if (!thisOrder.amount_w_noat) {
        stats.totalAmt302 += 0;
      } else {
        stats.totalAmtWNoat += thisOrder.amount_w_noat;
      }

      if (!thisOrder.amount_wo_noat) {
        stats.totalAmt302 += 0;
      } else {
        stats.totalAmtWoNoat += thisOrder.amount_wo_noat;
      }
    });
    
    ordersData = orderIds.map((id) => <ReportExcerpt key={id} orderId={id} />);
  }

  const statsContent = (
    <div className="stats-grid">
      <div>
        <h4>Хоносон:</h4>
        <h4>{orderIdsPrev.length}</h4>
      </div>
      <div>
        <h4>Орсон:</h4>
        <h4>{orderIdsEntered.length}</h4>
      </div>
      <div>
        <h4>Гарсан:</h4>
        <h4>{orderIdsLeft.length}</h4>
      </div>
      <div>
        <h4>Үлдэгдэл:</h4>
        <h4>{formatCurrency(stats.totalRevenuePrev)}</h4>
      </div>
      <div>
        <h4>Орлого:</h4>
        <h4>{formatCurrency(stats.totalRevenue)}</h4>
      </div>
    </div>
  );

  const header = (
    <>
      <h4>Орсон огноо</h4>
      <h4>Гарсан огноо</h4>
      <h4>Арлын дугаар</h4>
      <h4>Ачаа, барааны нэр</h4>
      <h4>Ачааны жин</h4>
      <h4>Тавцан ашиглалт</h4>
      <h4>Пүүлэлт</h4>
      <h4>Сэрээт өргөгч</h4>
      <h4>Авто кран ашиглалт</h4>
      <h4>Торгууль</h4>
      <h4>Бусад</h4>
      <h4>
        5131240302 <br />
        дансанд шилжүүлсэн <br />
        дүн
      </h4>
      <h4>
        5212124601 <br />
        дансанд шилжүүлсэн <br />
        дүн
      </h4>
      <h4>
        НӨАТ падаан <br />
        бичсэн дүн
      </h4>
      <h4>
        НӨАТ падаан <br />
        бичээгүй дүн
      </h4>
      <h4>
        Байгууллага, <br />
        хувь хүний <br />
        нэр
      </h4>
    </>
  );

  const footer = (
    <>
      <h4></h4> {/* Орсон огноо */}
      <h4></h4> {/* Гарсан огноо */}
      <h4></h4>{/* Арлын дугаар */}
      <h4></h4>{/* Ачаа, барааны нэр */}
      <h4>{stats.totalWeight} тн</h4>
      <h4>
        <p>Гадна тавцан - {stats.tavtsan.gadna}</p>
        <p>Агуулах тавцан - {stats.tavtsan.aguulah}</p>
      </h4>
      <h4>
        <p>Суудлын машин - {stats.tavtsan.gadna}</p>
        <p>Бусад - {stats.tavtsan.aguulah}</p>
      </h4>
      <h4>
        <p>Нэг удаагийн өргөлт - {stats.forklift.neg}</p>
        <p>Нийт цаг - {stats.forklift.hours}</p>
      </h4>
      <h4>
        <p>Хоосон өргөлт - {stats.crane.hooson}</p>
        <p>Ачаатай өргөлт - {stats.crane.achaatai}</p>
      </h4>
      <h4></h4>{/* Торгууль */}
      <h4></h4>{/* Бусад */}
      <h4>{formatCurrency(stats.totalAmt302)}</h4>
      <h4>{formatCurrency(stats.totalAmt601)}</h4>
      <h4>{formatCurrency(stats.totalAmtWNoat)}</h4>
      <h4>{formatCurrency(stats.totalAmtWoNoat)}</h4>
      <h4></h4>
    </>
  );

  return (
    <div>
      {statsContent}
      <div className="report-container">
        <div>{header}</div>
        <div>{ordersData}</div>
        <div>{footer}</div>
      </div>
    </div>
  );
};

export default ReportList;
