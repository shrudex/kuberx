import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";
import { getUserID } from "../hooks/getUserID";
import { useNavigate } from "react-router-dom";
import { getUserName } from "../hooks/getUserName";
import { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "react-minimal-pie-chart";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const Dashboard3 = () => {
  const navigate = useNavigate();
  const userId = getUserID();
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [email, setEmail] = useState("");
  const [spends, setSpends] = useState(null);
  const [investPieData, setInvestPieData] = useState(null);
  const [sameXAxis, setSameXAxis] = useState(null);
  const [sameYAxis, setSameYAxis] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [stockInvestments, setStockInvestments] = useState(null);
  const [incomeData, setIncomeData] = useState({
    dates: [],
    amounts: [],
    sender: [],
  });
  const [expenseData, setExpenseData] = useState({
    dates: [],
    amounts: [],
    receiver: [],
    category: [],
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [incomeDataChart, setIncomeDataChart] = useState(null);
  const [expenseDataChart, setExpenseDataChart] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
  }, [userId, navigate]);

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0, so we add 1
  const day = String(today.getDate()).padStart(2, "0");

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[today.getDay()];

  const formattedDate = `${year}-${month}-${day} (${dayOfWeek})`;

  useEffect(() => {
    //timeout for 1 second

    const balance = async () => {
      try {
        const response = await axios.get(`user/dashboard/fetchInfo/${userId}`);
        console.log(response.data);
        setBalance(response.data.availableBalance);
        setIncome(response.data.totalIncome);
        setExpense(response.data.totalExpenses);
        setEmail(response.data.email);
        setIncomeData({
          dates: response.data.income.map((entry) => entry.date),
          amounts: response.data.income.map((entry) => entry.amount),
          sender: response.data.income.map((entry) => entry.sender),
        });
        setExpenseData({
          dates: response.data.expense.map((entry) => entry.date),
          amounts: response.data.expense.map((entry) => entry.amount),
          receiver: response.data.expense.map((entry) => entry.receiver),
          category: response.data.expense.map((entry) => entry.category),
        });
        setSpends(response.data.groupedExpenditures);
        const getRandomColor = () =>
          "#" + Math.floor(Math.random() * 16777215).toString(16);
        setInvestPieData(
          Object.entries(response.data.categoryPercentages).map(
            ([category, percentage]) => ({
              title: category,
              value: parseFloat(percentage),
              color: getRandomColor(), // You can define this function to generate random colors or use predefined colors
            })
          )
        );
        console.log(response.data);
        setStockInvestments(response.data.stockInvestments);
        console.log("stock -> ", stockInvestments);
        console.log(investPieData);
      } catch (error) {
        console.error(error);
      }
    };
    balance();

    const transactions = async () => {
      try {
        const response = await axios.get(`user/transactions/${userId}`);
        console.log("thisdjfdjhfkdh");
        console.log(response.data);
        setTransactions(response.data.transactions.slice(0, 5));
        console.log(transactions);
      } catch (error) {
        console.error(error);
      }
    };
    transactions();
  }, [userId]);
  useEffect(() => {
    if (incomeData.dates.length > 0) {
      console.log("hi");
      console.log(incomeData.dates, incomeData.amounts, incomeData.sender);
      const temp = incomeData.dates.map((timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        return hours;
      });
      setIncomeDataChart({
        xAxis: temp,
        yAxis: incomeData.amounts,
      });
    }

    if (expenseData.dates.length > 0) {
      const temp = expenseData.dates.map((timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        return hours;
      });
      setExpenseDataChart({
        xAxis: temp,
        yAxis: expenseData.amounts,
      });

      if (incomeData.dates.length > 0 && expenseData.dates.length > 0) {
        const minDataLength = Math.min(
          incomeData.dates.length,
          expenseData.dates.length
        );

        // Prepare data for income chart
        const sameXin = incomeData.amounts.slice(0, minDataLength);
        const sameXex = expenseData.amounts.slice(0, minDataLength);
        const itTemp = incomeData.dates
          .slice(0, minDataLength)
          .map((timestamp) => {
            const date = new Date(timestamp);
            const hours = date.getHours();
            return hours;
          });
        // Prepare data for expense chart
        setSameYAxis({
          in: sameXin,
          exp: sameXex,
        });

        setSameXAxis(itTemp);
      }
    }
  }, [incomeData, expenseData]);

  return (
    <div className="w-full flex flex-col justify-center items-center mt-6">
      <div className="row1 flex justify-between w-11/12">
        <div className="flex text-4xl flex-col">
          <h1>Available Balance</h1>
          {balance >= 0 ? (
            <h2 className="text-green-500">₹{balance}</h2>
          ) : (
            <h2 className="text-red-500">₹{balance}</h2>
          )}
        </div>
        <h2 className="text-3xl">{formattedDate}</h2>
        <div className="flex">
          <div className="text-6xl">👤</div>
          <div className="text-2xl">
            <h2 className="text-left text-violet-200">{getUserName()}</h2>
            <p className="text-left">{email}</p>
          </div>
        </div>
      </div>
      <div className="row2 w-11/12 flex gap-8 mt-4">
        <div className="flex flex-col gap-4 w-fit">
          <div className="flex gap-4">
            {incomeDataChart && (
              <div className="bg-[#ffffff] text-violet-900 text-center text-3xl p-2 rounded-2xl ">
                <p className="leading-5">
                  Income Chart <br />
                  <span className="text-lg text-green-500">₹{income}</span>
                </p>
                <LineChart
                  xAxis={[{ data: incomeDataChart?.xAxis }]}
                  series={[
                    {
                      data: incomeDataChart?.yAxis,
                    },
                  ]}
                  width={"300"}
                  margin={{ top: 10, right: 10, bottom: 10 }}
                  height={150}
                  grid={{}}
                  style={{ textColor: "white" }}
                />
              </div>
            )}
            {expenseDataChart && (
              <div className="bg-[#ffffff] text-violet-900 text-center text-3xl p-2 rounded-2xl ">
                <p className="leading-5">
                  Expense Chart <br />
                  <span className="text-lg text-red-500">₹{expense}</span>
                </p>{" "}
                <LineChart
                  xAxis={[{ data: expenseDataChart?.xAxis }]}
                  series={[
                    {
                      data: expenseDataChart?.yAxis,
                    },
                  ]}
                  width={"300"}
                  margin={{ top: 10, right: 10, bottom: 10 }}
                  height={150}
                  grid={{}}
                  style={{ textColor: "white" }}
                />
              </div>
            )}
          </div>
          {incomeDataChart &&
            expenseDataChart &&
            incomeDataChart.xAxis.length === expenseDataChart.xAxis.length && (
              <div className="bg-[#ffffff] text-violet-900 text-center text-3xl p-2 rounded-2xl ">
                <p className="leading-5">
                  Income vs Expense <br />
                </p>
                <LineChart
                  xAxis={[
                    {
                      data:
                        incomeDataChart?.xAxis > expenseDataChart?.xAxis
                          ? expenseDataChart?.xAxis
                          : incomeDataChart?.xAxis,
                    },
                  ]}
                  series={[
                    {
                      label: "Income",
                      data: sameYAxis?.in,
                      borderColor: "#00FF00", // Green color for income
                      fill: false,
                      tension: 0.1,
                    },
                    {
                      label: "Expenditure",
                      data: sameYAxis?.exp,
                      borderColor: "rgb(255, 99, 132)",
                      fill: false,
                      tension: 0.1,
                    },
                  ]}
                  width={"600"}
                  margin={{ top: 10, right: 10, bottom: 10 }}
                  height={150}
                  grid={{}}
                  style={{ textColor: "white" }}
                />
              </div>
            )}
        </div>
        {spends && (
          <div className="flex flex-col bg-violet-600 rounded-2xl px-6 mr-6 py-1 w-fit">
            <h2 className="text-center text-3xl mb-8">Spends</h2>
            <div className="text-white text-center flex flex-col gap-4">
              {Object.entries(spends).map(([category, amount]) => (
                <div key={category}>
                  <p className="text-xl">{category}</p>
                  <p className="text-lg">₹{amount}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {investPieData && (
          <div className="w-fit">
            <h3 className="text-center -mb-24 text-3xl">Investments</h3>
            <PieChart
              onClick={handleOpen}
              className="w-68 mt-16"
              data={investPieData}
              paddingAngle=""
              animate="true"
            />
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <h3 className="text-center text-3xl text-violet-600 mb-2">
                  Investment Categories
                </h3>
                {investPieData.map((data, index) => (
                  <div className="" key={index}>
                    <p>
                      <span className="font-bold">{data.title}</span> :{" "}
                      {data.value} %
                    </p>
                  </div>
                ))}
              </Box>
            </Modal>
          </div>
        )}
      </div>
      <div className="row3 w-11/12 mt-8 rounded-2xl pb-4 bg-violet-600">
        <h2 className="text-3xl px-5 py-3">Recent Transactions</h2>
        <div className="flex flex-col gap-2 px-4">
          {transactions &&
            transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex bg-white rounded-lg justify-between items-center p-3"
              >
                <div className="flex flex-col ">
                  <p className="text-xl text-black">
                    {transaction.description}
                  </p>
                  <p className="text-md text-violet-500 ">
                    📅{transaction.date.slice(0, 10)} - ⌚
                    {transaction.date.slice(11, 19)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-lg text-right">
                    {transaction.type === "Income" ? (
                      <span className="text-green-500 text-xl">
                        ₹{transaction.amount} ({transaction.type})
                      </span>
                    ) : transaction.type === "Expense" ? (
                      <span className="text-red-500 text-xl">
                        ₹{transaction.amount} ({transaction.type})
                      </span>
                    ) : (
                      <span className="text-black text-xl">
                        ₹{transaction.amount} ({transaction.type})
                      </span>
                    )}
                  </p>
                  <p className="text-md text-right text-violet-500">
                    {transaction.category}
                  </p>
                </div>
              </div>
            ))}
        </div>{" "}
        <Link to="/transactions" className="text-white  text-lg pt-5 pl-5">
          View all transactions
        </Link>
      </div>
      {stockInvestments && (
        <div className="row4 w-11/12 mt-8 rounded-2xl bg-white flex flex-col">
          <h2 className="text-center text-black text-3xl p-4">My Stocks</h2>
          <div className="">
            {stockInvestments.map((stock) => (
              <div
                key={stock._id}
                className="flex bg-violet-600 rounded-lg justify-between items-center p-3"
              >
                <div className="flex flex-col">
                  <p className="text-xl text-white">{stock.investedWhere}</p>
                  <p className="text-md text-white">
                    📅{stock.date.slice(0, 10)} - ⌚{stock.date.slice(11, 19)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-lg text-white text-right">
                    ₹{stock.amount} ({stock.type})
                  </p>
                  <p className="text-md text-white text-right">
                    {stock.quantity} shares
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard3;
