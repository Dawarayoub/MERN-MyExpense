import React from 'react'
import { Progress } from 'antd'; 

export const Analytics = ({alltransaction=[]}) => {
    const categories=['salary','tip','project','fee','medical','bills','movie','food','tax']


    const totaltransaction=alltransaction.length
    const totalIncomeTransactions=alltransaction.filter(transaction=> transaction.type=='income')
    const totalExpenseTransactions=alltransaction.filter(transaction=> transaction.type=='expense')
    const totalIncomePercent=(totalIncomeTransactions.length/totaltransaction)*100
    const totalExpensePercent=(totalExpenseTransactions.length/totaltransaction)*100

    const totalAmount=alltransaction.reduce(
        (acc,transaction)=>acc+transaction.amount,0
    );
    const totalincome=alltransaction.filter(
        (transaction)=>transaction.type === "income"
    ).reduce((acc,transaction)=>acc+transaction.amount,0)
    
    const totalexpense=alltransaction.filter(
        (transaction)=>transaction.type === "expense"
    ).reduce((acc,transaction)=>acc+transaction.amount,0)

    const totalIncomeAmount=(totalincome/totalAmount)*100
    const totalExpenseAmount=(totalexpense/totalAmount)*100
  return (
    <>
    <div className="row mt-3">
        <div className="col-md-4">
            <div className="card">
            <div className="card-header">
                total transactions: {totaltransaction}
            </div>
            <div className="card-body">
                <h5 className="text-success">
                    Income:{totalIncomeTransactions.length}
                </h5>
                <h5 className="text-danger">
                    Expense:{totalExpenseTransactions.length}
                </h5>
                <div>
                    <Progress   type="circle"
                    strokeColor={'green'}
                    className="mx-2"
                    percent={totalIncomePercent.toFixed(0)} />
                    <Progress   type="circle"
                    strokeColor={'red'}
                    className="mx-2"
                    percent={totalExpensePercent.toFixed(0)} />
                </div>
            </div>
            </div>
            </div>
        <div className="col-md-4">
        <div className='card'>
            <div className="card-header">
                total Amount: {totalAmount}
            </div>
            <div className="card-body">
                <h5 className="text-success">
                     Total Income:{totalincome}
                </h5>
                <h5 className="text-danger">
                    Total Expense:{totalexpense}
                </h5>
                <div>
                    <Progress   type="circle"
                    strokeColor={'green'}
                    className="mx-2"
                    percent={totalIncomeAmount.toFixed(0)} />
                    <Progress   type="circle"
                    strokeColor={'red'}
                    className="mx-2"
                    percent={totalExpenseAmount.toFixed(0)} />
                </div>
            </div>
        </div>
        </div>
        
    </div>
    
    </>
  )
};
export default Analytics;
